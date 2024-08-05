import type {
  ForeignKey,
  ModelFieldStartingOptions,
  ModelFieldsStartingMap,
} from "./types";

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
      modelName: otherSchemaOptions.name,
    },
    UpdatedAt: {
      name: "updated_at",
      type: "number",
      category: "timestamp",
      modelName: otherSchemaOptions.name,
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
