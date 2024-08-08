import { z } from "zod";

import type { PascalToSnakeCaseRecord } from "~/toolkit/types";

export type ForeignKey = {
  key: string;
  references: string;
  referenceKey: string;
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
  z.object({
    type: z.literal("boolean"),
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

export type InferColumnOptionsResult<TColumnOptions> = {
  [key in keyof TColumnOptions]: TColumnOptions[key] extends ModelFieldStartingOptions
    ? TColumnOptions[key]["type"] extends "string"
      ? string
      : TColumnOptions[key]["type"] extends "number"
        ? number
        : never
    : InferColumnOptionsResult<TColumnOptions[key]>;
};

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface NestedColumnOptionsMap
  extends Record<string, ModelFieldOptions | NestedColumnOptionsMap> {}

export type ColumnOptionsMap = Record<
  string,
  ModelFieldOptions | NestedColumnOptionsMap
>;
