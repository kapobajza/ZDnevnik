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
