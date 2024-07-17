import { CommonModelField } from "~/api/db/util";
import type { FieldModel, InferModelField, ModelSchema } from "~/api/db/types";

const ClassroomModelField = {
  ...CommonModelField,
  Id: {
    name: "id",
    type: "string",
  },
  Name: {
    name: "name",
    type: "string",
    length: 255,
  },
} as const satisfies FieldModel;

export type ClassroomModel = InferModelField<typeof ClassroomModelField>;

export const ClassroomModel = {
  name: "classrooms",
  fields: ClassroomModelField,
} as const satisfies ModelSchema;
