import type { ObjectValues } from "@zdnevnik/toolkit";
import type { ModelSchema } from "./models";
import type { ConditionalClause, WhereClause } from "./types";
import type { Client as PgClient, QueryResultRow } from "pg";

type InsertOptions<TModel extends ModelSchema> = {
  returningFields?: ObjectValues<TModel["fields"]>[];
};

type QueryBuilderState<TModel extends ModelSchema> = {
  selectColumns: string | undefined;
  whereClause: WhereClause<TModel> | undefined;
  andClause: ConditionalClause<TModel> | undefined;
  orClause: ConditionalClause<TModel> | undefined;
  insertColumns: string | undefined;
  insertValues: (string | number)[] | undefined;
  insertOptions: Partial<InsertOptions<TModel>> | undefined;
};

export type ModelORM<TModel extends ModelSchema> = {
  select(...columns: ObjectValues<TModel["fields"]>[]): ModelORM<TModel>;
  where(clause: WhereClause<TModel>): ModelORM<TModel>;
  and(clause: WhereClause<TModel>): ModelORM<TModel>;
  or(clause: WhereClause<TModel>): ModelORM<TModel>;
  insert(
    columns: ObjectValues<TModel["fields"]>[],
    values: (string | number)[],
    options?: Partial<InsertOptions<TModel>>,
  ): ModelORM<TModel>;
  build(): string;
  setState(newState: Partial<QueryBuilderState<TModel>>): ModelORM<TModel>;
  execute<TResult extends QueryResultRow>(): Promise<TResult[]>;
  executeOne<TResult extends QueryResultRow>(): Promise<TResult>;
};

export function createModelORM<TModel extends ModelSchema>(
  model: TModel,
  client: PgClient,
): ModelORM<TModel> {
  let state: Partial<QueryBuilderState<TModel>> = {};

  const cloneAndUpdate = (update: Partial<QueryBuilderState<TModel>>) => {
    const newState = {
      ...state,
      ...update,
    };

    if (update.whereClause) {
      newState.whereClause = {
        ...state.whereClause,
        ...update.whereClause,
      };
    }

    if (update.andClause) {
      newState.andClause = {
        ...state.andClause,
        ...update.andClause,
      };
    }

    if (update.orClause) {
      newState.orClause = {
        ...state.orClause,
        ...update.orClause,
      };
    }

    if (update.insertValues) {
      newState.insertValues = [
        ...(state.insertValues ?? []),
        ...update.insertValues,
      ];
    }

    if (update.insertOptions) {
      newState.insertOptions = {
        ...state.insertOptions,
        ...update.insertOptions,
      };
    }

    return createModelORM(model, client).setState(newState);
  };

  const getQueryValues = () => {
    if (state.insertValues) {
      return state.insertValues;
    }

    if (state.whereClause?.value) {
      const values = [state.whereClause.value];

      if (state.andClause?.value) {
        values.push(state.andClause.value);
      }

      if (state.orClause?.value) {
        values.push(state.orClause.value);
      }

      return values;
    }

    return undefined;
  };

  const conditionalClauseWithIndex = (
    clause: WhereClause<TModel>,
  ): ConditionalClause<TModel> => {
    let index = 1;

    if (state.whereClause) {
      index++;
    }

    if (state.andClause?.index) {
      index = state.andClause.index + 1;
    }

    if (state.orClause?.index) {
      index = state.orClause.index + 1;
    }

    return {
      ...clause,
      index,
    };
  };

  return {
    setState(newState) {
      state = newState;
      return this;
    },
    select(...columns: ObjectValues<TModel["fields"]>[]) {
      return cloneAndUpdate({ selectColumns: columns.join(", ") });
    },
    where(clause: WhereClause<TModel>) {
      return cloneAndUpdate({ whereClause: clause });
    },
    and(clause) {
      return cloneAndUpdate({ andClause: conditionalClauseWithIndex(clause) });
    },
    or(clause) {
      return cloneAndUpdate({ orClause: conditionalClauseWithIndex(clause) });
    },
    build() {
      let query: string | undefined;
      const {
        insertColumns,
        insertValues,
        whereClause,
        selectColumns,
        insertOptions,
        andClause,
        orClause,
      } = state || {};

      if (insertColumns && insertValues) {
        return `INSERT INTO ${model.name}(${insertColumns}) VALUES(${insertValues.map((_value, index) => `$${index + 1}`).join(", ")}) RETURNING ${insertOptions?.returningFields?.join(", ") ?? "*"}`;
      }

      query = `SELECT ${selectColumns ?? "*"} FROM ${model.name}`;

      if (whereClause) {
        query += ` WHERE ${whereClause.field as string} ${whereClause.operator} $1`;

        if (andClause) {
          query += ` AND ${andClause.field as string} ${andClause.operator} $${andClause.index}`;
        }

        if (orClause) {
          query += ` OR ${orClause.field as string} ${orClause.operator} $${orClause.index}`;
        }
      }

      return query;
    },
    insert(columns, values, options) {
      return cloneAndUpdate({
        insertColumns: columns.join(", "),
        insertValues: values,
        insertOptions: options,
      });
    },
    async execute<TResult extends QueryResultRow>() {
      const query = this.build();
      const queryValues = getQueryValues();

      const res = await client.query<TResult>(query, queryValues);

      if (res.rows.length === 0) {
        throw new Error("Not found");
      }

      return res.rows;
    },
    async executeOne<TResult extends QueryResultRow>() {
      const results = await this.execute<TResult>();
      return results?.[0] as TResult;
    },
  };
}
