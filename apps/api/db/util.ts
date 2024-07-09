import type { ModelSchema } from "./models";

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
