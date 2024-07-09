import type { DbModel } from "./types";

export function createDbORM<TModel extends DbModel>(tableName: string) {
  const queries = {
    select: "",
  };

  return {
    select(columns?: (keyof TModel)[]) {
      queries.select = `SELECT ${columns ? columns.join(", ") : "*"} FROM ${tableName}`;
      return this;
    },
  };
}
