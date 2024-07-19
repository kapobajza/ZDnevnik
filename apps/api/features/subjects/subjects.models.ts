import type { InferModelFields, ModelFieldsStartingMap } from "~/api/db/types";
import { model } from "~/api/db/util";
import { ClassroomModel } from "~/api/features/clasrooms/classrooms.model";

const SubjectModelField = {
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
} as const satisfies ModelFieldsStartingMap;

export const SubjectModel = model({
  name: "subjects",
  fields: SubjectModelField,
  foreignKeys: [
    {
      key: SubjectModelField.ClassroomId.name,
      references: ClassroomModel.name,
      referenceKey: ClassroomModel.fields.Id.name,
    },
  ],
});

export type SubjectModel = InferModelFields<typeof SubjectModel>;
