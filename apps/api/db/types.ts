import type { PascalToSnakeCaseRecord } from "@zdnevnik/toolkit";
import { z } from "zod";

import type { ModelReturnType } from "./util";

export type ForeignKey = {
  key: string;
  references: string;
  referenceKey: string;
};

export type ModelSchema = {
  name: string;
  fields: ModelFieldsMap;
  foreignKeys?: {
    key: string;
    references: string;
    referenceKey: string;
  }[];
};

export type InsertOptions<
  TColumnOptions extends ColumnOptionsMap = ColumnOptionsMap,
> = {
  returningFields?: TColumnOptions;
};

export type SortingOptions = {
  by: ModelFieldOptions[];
  order?: "ASC" | "DESC";
};

export type ConditionalClause = {
  field: ModelFieldOptions;
  operator: "=" | "!=" | ">" | ">=" | "<" | "<=";
  value: string | number;
};

export type AdditionalClause = {
  type: "AND" | "OR";
} & ConditionalClause;

export type JoinOptions = {
  type?: "INNER" | "LEFT" | "RIGHT" | "FULL";
  table: ModelReturnType;
  on: {
    field: ModelFieldOptions;
    other: ModelFieldOptions;
  };
};

const modelFieldIntersectionSchema = z.object({
  name: z.string(),
});

const modelFieldUnionSchema = z.union([
  z.object({
    type: z.literal("string"),
    length: z.number().optional(),
  }),
  z.object({
    type: z.literal("number"),
    category: z.union([
      z.literal("timestamp"),
      z.literal("integer"),
      z.literal("decimal"),
      z.literal("smallint"),
    ]),
  }),
]);

const modelFieldStartingOptionsSchema = z.intersection(
  modelFieldIntersectionSchema,
  modelFieldUnionSchema,
);

export const modelFieldOptionsSchema = z.intersection(
  modelFieldIntersectionSchema.extend({
    modelName: z.string(),
  }),
  modelFieldUnionSchema,
);

export type ModelFieldOptions = z.infer<typeof modelFieldOptionsSchema>;

export type ModelFieldStartingOptions = z.infer<
  typeof modelFieldStartingOptionsSchema
>;

export type ModelFieldsMap = Record<string, ModelFieldOptions>;

export type ModelFieldsStartingMap = Record<string, ModelFieldStartingOptions>;

export type ColumnOptionsMap = Record<
  string,
  ModelFieldOptions | Record<string, ModelFieldOptions>
>;

export type QueryBuilderState<
  TColumnOptions extends ColumnOptionsMap = ColumnOptionsMap,
> = {
  selectColumns: TColumnOptions | undefined;
  whereClause: ConditionalClause | undefined;
  additionalClauses: AdditionalClause[] | undefined;
  insertColumns: TColumnOptions | undefined;
  insertValues: (string | number)[] | undefined;
  insertOptions: Partial<InsertOptions<TColumnOptions>> | undefined;
  sortOptions: SortingOptions | undefined;
  limit: number | undefined;
  offset: number | undefined;
  deleteStatement: boolean | undefined;
  joinOptions: JoinOptions[] | undefined;
};

export type IQueryBuilder<
  TModel extends ModelSchema,
  TColumnOptions extends ColumnOptionsMap = ColumnOptionsMap,
> = {
  select(columns?: TColumnOptions): IQueryBuilder<TModel, TColumnOptions>;
  where(clause: ConditionalClause): IQueryBuilder<TModel, TColumnOptions>;
  and(clause: ConditionalClause): IQueryBuilder<TModel, TColumnOptions>;
  or(clause: ConditionalClause): IQueryBuilder<TModel, TColumnOptions>;
  insert(
    columns: TColumnOptions,
    values: (string | number)[],
    options?: Partial<InsertOptions<TColumnOptions>>,
  ): IQueryBuilder<TModel, TColumnOptions>;
  delete(): IQueryBuilder<TModel, TColumnOptions>;
  sort(options: SortingOptions): IQueryBuilder<TModel, TColumnOptions>;
  limit(by: number): IQueryBuilder<TModel, TColumnOptions>;
  offset(by: number): IQueryBuilder<TModel, TColumnOptions>;
  join(options: JoinOptions): IQueryBuilder<TModel, TColumnOptions>;
  leftJoin(options: JoinOptions): IQueryBuilder<TModel, TColumnOptions>;
  rightJoin(options: JoinOptions): IQueryBuilder<TModel, TColumnOptions>;
  fullJoin(options: JoinOptions): IQueryBuilder<TModel, TColumnOptions>;
  build(): string;
};

export type InferModelFields<
  TModel extends {
    fields: Record<
      string,
      {
        type: number | string;
      }
    >;
  },
> = PascalToSnakeCaseRecord<{
  [K in keyof TModel["fields"]]: TModel["fields"][K]["type"] extends "string"
    ? string
    : TModel["fields"][K]["type"] extends "number"
      ? number
      : never;
}>;
