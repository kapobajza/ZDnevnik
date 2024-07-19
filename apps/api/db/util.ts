import type { Pool } from "pg";

import type {
  ForeignKey,
  ModelFieldStartingOptions,
  ModelFieldsStartingMap,
  ModelSchema,
} from "./types";

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
  const res = await client.query<{ table_id: string; table_name: string }>(`
      SELECT oid as table_id, relname as table_name
      FROM pg_class
      WHERE relkind = 'r' AND relname NOT LIKE 'pg_%';
  `);

  return res.rows.reduce<MappedTable>((acc, row) => {
    acc[row.table_name] = row.table_id;
    return acc;
  }, {});
};

export function model<
  TFields extends ModelFieldsStartingMap = ModelFieldsStartingMap,
>({
  fields,
  ...otherSchemaOptions
}: {
  fields: TFields;
  name: string;
  foreignKeys?: ForeignKey[];
}) {
  const extendedFields = {
    ...fields,
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

  type ExtendedTFields = typeof extendedFields;

  return {
    ...otherSchemaOptions,
    fields: Object.entries(extendedFields).reduce(
      (acc, [key, value]) => {
        // @ts-expect-error acc cannot be indexed by key since it's a generic type
        acc[key] = {
          ...value,
          modelName: otherSchemaOptions.name,
        };

        return acc;
      },
      {} as {
        [key in keyof ExtendedTFields]: ExtendedTFields[key] & {
          modelName: string;
        };
      },
    ),
  };
}

export type ModelReturnType<
  TFields extends ModelFieldsStartingMap = ModelFieldsStartingMap,
> = ReturnType<typeof model<TFields>>;
