import type { ObjectValues } from "@zdnevnik/toolkit";
import type { ModelSchema } from "./models";

export type WhereClause<TModel extends ModelSchema> = {
  field: ObjectValues<TModel["fields"]>;
  operator: "=" | "!=" | ">" | ">=" | "<" | "<=";
  value: string | number;
};

export type ConditionalClause<TModel extends ModelSchema> =
  WhereClause<TModel> & {
    index: number;
  };
