import type { ObjectValues } from "@zdnevnik/toolkit";

import type { ModelSchema } from "./models";

export type InsertOptions<TModel extends ModelSchema> = {
  returningFields?: ObjectValues<TModel["fields"]>[];
};

export type SortingOptions<TModel extends ModelSchema> = {
  by: ObjectValues<TModel["fields"]>[];
  order?: "ASC" | "DESC";
};

export type ConditionalClause<TModel extends ModelSchema> = {
  field: ObjectValues<TModel["fields"]>;
  operator: "=" | "!=" | ">" | ">=" | "<" | "<=";
  value: string | number;
};

export type AdditionalClause<TModel extends ModelSchema> = {
  type: "AND" | "OR";
} & ConditionalClause<TModel>;

export type QueryBuilderState<TModel extends ModelSchema> = {
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

export type IQueryBuilder<TModel extends ModelSchema> = {
  select(...columns: ObjectValues<TModel["fields"]>[]): IQueryBuilder<TModel>;
  where(clause: ConditionalClause<TModel>): IQueryBuilder<TModel>;
  and(clause: ConditionalClause<TModel>): IQueryBuilder<TModel>;
  or(clause: ConditionalClause<TModel>): IQueryBuilder<TModel>;
  insert(
    columns: ObjectValues<TModel["fields"]>[],
    values: (string | number)[],
    options?: Partial<InsertOptions<TModel>>,
  ): IQueryBuilder<TModel>;
  sort(options: SortingOptions<TModel>): IQueryBuilder<TModel>;
  limit(by: number): IQueryBuilder<TModel>;
  offset(by: number): IQueryBuilder<TModel>;
  build(): string;
};
