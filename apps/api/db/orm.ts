import type { Pool as PgPool, QueryResultRow } from "pg";
import type {
  PascalToSnakeCaseRecord,
  SnakeToPascalCase,
} from "@zdnevnik/toolkit";

import type {
  ColumnOptionsMap,
  ConditionalClause,
  IQueryBuilder,
  InsertOptions,
  JoinOptions,
  ModelFieldStartingOptions,
  ModelSchema,
  QueryBuilderState,
  SortingOptions,
} from "./types";
import { QueryBuilder } from "./queryBuilder";

import type { MappedTable } from "~/api/types";

type InferColumnOptionsResult<TColumnOptions> = {
  [key in keyof TColumnOptions]: TColumnOptions[key] extends ModelFieldStartingOptions
    ? TColumnOptions[key]["type"] extends "string"
      ? string
      : TColumnOptions[key]["type"] extends "number"
        ? number
        : never
    : InferColumnOptionsResult<TColumnOptions[key]>;
};

export class ModelORM<
  TModel extends ModelSchema,
  TColumnOptions extends ColumnOptionsMap = ColumnOptionsMap,
> implements IQueryBuilder<TModel, TColumnOptions>
{
  private queryBuilder: QueryBuilder<TModel>;

  constructor(
    private model: TModel,
    private pool: PgPool,
    private mappedTable: MappedTable,
  ) {
    this.queryBuilder = new QueryBuilder(this.model);
  }

  cloneAndUpdate(update: Partial<QueryBuilderState<TModel>>) {
    this.queryBuilder = this.queryBuilder.cloneAndUpdate(update);
    return this;
  }

  select<TColumnOptions extends ColumnOptionsMap | undefined = undefined>(
    columns?: TColumnOptions,
  ) {
    this.queryBuilder = this.queryBuilder.select(columns);
    return this as unknown as ModelORM<
      TModel,
      TColumnOptions extends undefined
        ? {
            [Key in keyof PascalToSnakeCaseRecord<
              TModel["fields"]
            >]: TModel["fields"][SnakeToPascalCase<Key>];
          }
        : TColumnOptions
    >;
  }

  where(clause: ConditionalClause<TModel>) {
    this.queryBuilder = this.queryBuilder.where(clause);
    return this;
  }

  and(clause: ConditionalClause<TModel>) {
    this.queryBuilder = this.queryBuilder.and(clause);
    return this;
  }

  or(clause: ConditionalClause<TModel>) {
    this.queryBuilder = this.queryBuilder.or(clause);
    return this;
  }

  sort(options: SortingOptions<TModel>) {
    this.queryBuilder = this.queryBuilder.sort(options);
    return this;
  }

  limit(by: number) {
    this.queryBuilder = this.queryBuilder.limit(by);
    return this;
  }

  offset(by: number) {
    this.queryBuilder = this.queryBuilder.offset(by);
    return this;
  }

  build(): string {
    return this.queryBuilder.build();
  }

  insert(
    columns: TColumnOptions,
    values: (string | number)[],
    options?: Partial<InsertOptions<TModel>> | undefined,
  ) {
    this.queryBuilder = this.queryBuilder.insert(columns, values, options);
    return this as ModelORM<TModel, TColumnOptions>;
  }

  delete() {
    this.queryBuilder = this.queryBuilder.delete();
    return this;
  }

  join<TJoinModel extends ModelSchema>(
    options: JoinOptions<TModel, TJoinModel>,
  ) {
    this.queryBuilder = this.queryBuilder.join(options);
    return this;
  }

  leftJoin<TJoinModel extends ModelSchema>(
    options: JoinOptions<TModel, TJoinModel>,
  ) {
    this.queryBuilder = this.queryBuilder.leftJoin(options);
    return this;
  }

  rightJoin<TJoinModel extends ModelSchema>(
    options: JoinOptions<TModel, TJoinModel>,
  ) {
    this.queryBuilder = this.queryBuilder.rightJoin(options);
    return this;
  }

  fullJoin<TJoinModel extends ModelSchema>(
    options: JoinOptions<TModel, TJoinModel>,
  ) {
    this.queryBuilder = this.queryBuilder.fullJoin(options);
    return this;
  }

  getQueryValues = () => {
    const state = this.queryBuilder.state;

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

  async execute<
    TResult extends QueryResultRow = InferColumnOptionsResult<TColumnOptions>,
  >() {
    const client = await this.pool.connect();
    const { joinOptions } = this.queryBuilder.state;

    try {
      const query = this.build();
      const queryValues = this.getQueryValues();

      const res = await this.pool.query<TResult>(
        {
          text: query,
          // @ts-expect-error - Incorrect types provided by pg
          rowMode: joinOptions ? "array" : undefined,
        },
        queryValues,
      );

      if (joinOptions) {
        const finalResult: Record<string, Record<string, TResult>>[] = [];

        for (const row of res.rows as unknown as TResult[][]) {
          const obj: Record<string, Record<string, TResult>> = {};
          const joinedTables = joinOptions.map((join) => join.table.name);

          for (const table of [this.model.name, ...joinedTables]) {
            const tableId = this.mappedTable[table];
            for (let i = 0; i < res.fields.length; i++) {
              const field = res.fields[i];
              const value = row[i];

              if (tableId === field?.tableID) {
                obj[table] = {
                  ...obj[table],
                  [field?.name as string]: value as TResult,
                };
              }
            }
          }

          finalResult.push(obj);
        }

        return finalResult as unknown as TResult[];
      }

      return res.rows;
    } finally {
      this.queryBuilder.reset();
      client?.release();
    }
  }

  async executeOne<
    TResult extends QueryResultRow = InferColumnOptionsResult<TColumnOptions>,
  >() {
    const results = await this.execute<TResult>();
    return results?.[0];
  }

  async transaction(callback: (cb: this) => Promise<void>) {
    const client = await this.pool.connect();

    try {
      await client.query("BEGIN");
      await callback(this);
      await client.query("COMMIT");
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
      this.queryBuilder.reset();
    }
  }
}
