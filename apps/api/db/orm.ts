import type { ObjectValues } from "@zdnevnik/toolkit";
import type { ModelSchema } from "./models";
import type {
  AdditionalClause,
  ConditionalClause,
  InsertOptions,
  SortingOptions,
} from "./types";
import type { Client as PgClient, QueryResultRow } from "pg";
import { HttpError, HttpErrorStatus } from "~/api/error/httpError";

type QueryBuilderState<TModel extends ModelSchema> = {
  selectColumns: string | undefined;
  whereClause: ConditionalClause<TModel> | undefined;
  additionalClauses: AdditionalClause<TModel>[] | undefined;
  insertColumns: string | undefined;
  insertValues: (string | number)[] | undefined;
  insertOptions: Partial<InsertOptions<TModel>> | undefined;
  sortOptions: SortingOptions<TModel> | undefined;
  limit: number | undefined;
  offset: number | undefined;
};

export type ModelORM<TModel extends ModelSchema> = {
  select(...columns: ObjectValues<TModel["fields"]>[]): ModelORM<TModel>;
  where(clause: ConditionalClause<TModel>): ModelORM<TModel>;
  and(clause: ConditionalClause<TModel>): ModelORM<TModel>;
  or(clause: ConditionalClause<TModel>): ModelORM<TModel>;
  insert(
    columns: ObjectValues<TModel["fields"]>[],
    values: (string | number)[],
    options?: Partial<InsertOptions<TModel>>,
  ): ModelORM<TModel>;
  sort(options: SortingOptions<TModel>): ModelORM<TModel>;
  limit(by: number): ModelORM<TModel>;
  offset(by: number): ModelORM<TModel>;
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

    if (update.additionalClauses) {
      newState.additionalClauses = [
        ...(state.additionalClauses ?? []),
        ...update.additionalClauses,
      ];
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

      if (state.additionalClauses) {
        values.push(...state.additionalClauses.map((c) => c.value));
      }

      return values;
    }

    return undefined;
  };

  return {
    setState(newState) {
      state = newState;
      return this;
    },
    select(...columns: ObjectValues<TModel["fields"]>[]) {
      return cloneAndUpdate({ selectColumns: columns.join(", ") });
    },
    where(clause: ConditionalClause<TModel>) {
      return cloneAndUpdate({ whereClause: clause });
    },
    and(clause) {
      return cloneAndUpdate({
        additionalClauses: [
          {
            ...clause,
            type: "AND",
          },
        ],
      });
    },
    or(clause) {
      return cloneAndUpdate({
        additionalClauses: [
          {
            ...clause,
            type: "OR",
          },
        ],
      });
    },
    sort(options) {
      return cloneAndUpdate({ sortOptions: options });
    },
    limit(by) {
      return cloneAndUpdate({ limit: by });
    },
    offset(by) {
      return cloneAndUpdate({ offset: by });
    },
    build() {
      let query: string | undefined;
      const {
        insertColumns,
        insertValues,
        whereClause,
        selectColumns,
        insertOptions,
        additionalClauses,
      } = state || {};

      if (insertColumns && insertValues) {
        return `INSERT INTO ${model.name}(${insertColumns}) VALUES(${insertValues.map((_value, index) => `$${index + 1}`).join(", ")}) RETURNING ${insertOptions?.returningFields?.join(", ") ?? "*"}`;
      }

      query = `SELECT ${selectColumns ?? "*"} FROM ${model.name}`;

      if (whereClause) {
        query += ` WHERE ${whereClause.field as string} ${whereClause.operator} $1`;

        if (additionalClauses) {
          query += ` ${additionalClauses.map((clause, index) => `${clause.type} ${clause.field as string} ${clause.operator} $${index + 2}`).join(" ")}`;
        }
      }

      if (state.sortOptions) {
        query += ` ORDER BY ${state.sortOptions.by.join(", ")} ${state.sortOptions.order ?? "ASC"}`;
      }

      if (state.limit) {
        query += ` LIMIT ${state.limit}`;
      }

      if (state.offset) {
        query += ` OFFSET ${state.offset}`;
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
        throw new HttpError(HttpErrorStatus.NotFound);
      }

      return res.rows;
    },
    async executeOne<TResult extends QueryResultRow>() {
      const results = await this.execute<TResult>();
      return results?.[0] as TResult;
    },
  };
}
