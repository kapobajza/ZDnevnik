import type { PascalToSnakeCaseRecord } from "@zdnevnik/toolkit";

export type InsertOptions<TModel extends ModelSchema> = {
  returningFields?: (keyof InferModelField<TModel["fields"]>)[];
};

export type SortingOptions<TModel extends ModelSchema> = {
  by: (keyof InferModelField<TModel["fields"]>)[];
  order?: "ASC" | "DESC";
};

export type ConditionalClause<TModel extends ModelSchema> = {
  field: keyof InferModelField<TModel["fields"]>;
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
  deleteStatement: boolean | undefined;
};

export type IQueryBuilder<TModel extends ModelSchema> = {
  select(
    ...columns: (keyof InferModelField<TModel["fields"]>)[]
  ): IQueryBuilder<TModel>;
  where(clause: ConditionalClause<TModel>): IQueryBuilder<TModel>;
  and(clause: ConditionalClause<TModel>): IQueryBuilder<TModel>;
  or(clause: ConditionalClause<TModel>): IQueryBuilder<TModel>;
  insert(
    columns: (keyof InferModelField<TModel["fields"]>)[],
    values: (string | number)[],
    options?: Partial<InsertOptions<TModel>>,
  ): IQueryBuilder<TModel>;
  delete(): IQueryBuilder<TModel>;
  sort(options: SortingOptions<TModel>): IQueryBuilder<TModel>;
  limit(by: number): IQueryBuilder<TModel>;
  offset(by: number): IQueryBuilder<TModel>;
  build(): string;
};

export type ModelFieldOptions = {
  name: string;
} & (
  | {
      type: "string";
      length?: number;
    }
  | {
      type: "number";
      category: "timestamp" | "integer" | "decimal" | "smallint";
    }
);

export type FieldModel = Record<string, ModelFieldOptions>;

export type InferModelField<TField extends FieldModel> =
  PascalToSnakeCaseRecord<{
    [K in keyof TField]: TField[K]["type"] extends "string"
      ? string
      : TField[K]["type"] extends "number"
        ? number
        : never;
  }>;

export type ModelSchema = {
  name: string;
  fields: FieldModel;
  foreignKeys?: {
    key: string;
    references: string;
    referenceKey: string;
  }[];
};
