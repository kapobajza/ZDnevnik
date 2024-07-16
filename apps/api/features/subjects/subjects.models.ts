import { CommonModelField } from "~/api/db/util";
import type { FieldModel, ModelSchema } from "~/api/db/types";
import {
  ClassroomModel,
  ClassroomModelField,
} from "~/api/features/clasrooms/classrooms.model";

export const SubjectModelField = {
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
  ClassroomId: {
    name: "classroom_id",
    type: "string",
  },
} as const satisfies FieldModel;

export const SubjectModel = {
  name: "subjects",
  fields: SubjectModelField,
  foreignKeys: [
    {
      key: SubjectModelField.ClassroomId.name,
      references: ClassroomModel.name,
      referenceKey: ClassroomModelField.Id.name,
    },
  ],
} as const satisfies ModelSchema;
