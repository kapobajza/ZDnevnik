import type { Pool } from "pg";
import type { ModelFieldStartingOptions } from "@zdnevnik/toolkit";
import type { FastifyInstance } from "fastify";

import type { ModelSchema } from "./types";
import { ModelORM } from "./orm";

import type { MappedTable } from "~/api/types";

export const createForeignKeyConstraints = (model: ModelSchema) => {
  if (!model.foreignKeys) {
    return "";
  }

  return model.foreignKeys
    .map(
      (foreignKey) => `
ALTER TABLE ${model.name}
  ADD FOREIGN KEY (${foreignKey.key})
    REFERENCES ${foreignKey.references} (${foreignKey.referenceKey});
  `,
    )
    .join("\n\n");
};

export const CommonModelField = {
  CreatedAt: {
    name: "created_at",
    type: "number",
    category: "timestamp",
  },
  UpdatedAt: {
    name: "updated_at",
    type: "number",
    category: "timestamp",
  },
} as const satisfies Record<string, ModelFieldStartingOptions>;

export const mapTables = async (client: Pool) => {
  const res = await client.query<{ table_id: number; table_name: string }>(`
      SELECT oid as table_id, relname as table_name
      FROM pg_class
      WHERE relkind = 'r' AND relname NOT LIKE 'pg_%';
  `);

  return res.rows.reduce<MappedTable>((acc, row) => {
    acc[row.table_name] = row.table_id;
    return acc;
  }, {});
};

export function createModelORM<TModel extends ModelSchema>(
  model: TModel,
  fastify: FastifyInstance,
) {
  return new ModelORM(model, fastify.dbPool, fastify.mappedTable);
}
