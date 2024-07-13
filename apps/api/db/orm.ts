import type { ObjectValues } from "@zdnevnik/toolkit";
import type { Pool as PgPool, QueryResultRow } from "pg";

import type { ModelSchema } from "./models";
import type {
  ConditionalClause,
  IQueryBuilder,
  InsertOptions,
  QueryBuilderState,
  SortingOptions,
} from "./types";
import { QueryBuilder } from "./queryBuilder";

export class ModelORM<TModel extends ModelSchema>
  implements IQueryBuilder<TModel>
{
  private queryBuilder: QueryBuilder<TModel>;

  constructor(
    private model: TModel,
    private pool: PgPool,
  ) {
    this.queryBuilder = new QueryBuilder(this.model);
  }

  cloneAndUpdate(update: Partial<QueryBuilderState<TModel>>) {
    this.queryBuilder = this.queryBuilder.cloneAndUpdate(update);
    return this;
  }

  select(...columns: ObjectValues<TModel["fields"]>[]) {
    this.queryBuilder = this.queryBuilder.select(...columns);
    return this;
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
    columns: ObjectValues<TModel["fields"]>[],
    values: (string | number)[],
    options?: Partial<InsertOptions<TModel>> | undefined,
  ) {
    this.queryBuilder = this.queryBuilder.insert(columns, values, options);
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

  async execute<TResult extends QueryResultRow>() {
    const client = await this.pool.connect();

    try {
      const query = this.build();
      const queryValues = this.getQueryValues();

      const res = await this.pool.query<TResult>(query, queryValues);

      return res.rows;
    } finally {
      this.queryBuilder.reset();
      client?.release();
    }
  }

  async executeOne<TResult extends QueryResultRow>() {
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
