import type { ObjectValues } from "@zdnevnik/toolkit";
import type { ModelSchema } from "./models";

export type ConditionalClause<TModel extends ModelSchema> = {
  field: ObjectValues<TModel["fields"]>;
  operator: "=" | "!=" | ">" | ">=" | "<" | "<=";
  value: string | number;
};

export type AdditionalClause<TModel extends ModelSchema> = {
  type: "AND" | "OR";
} & ConditionalClause<TModel>;
