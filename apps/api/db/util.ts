import type { FieldModel, ModelSchema } from "./types";

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
} as const satisfies FieldModel;
