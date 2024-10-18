import type { InferModelFields, ModelFieldsStartingMap } from "./types";
import { model } from "./util";

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
});

export type SubjectModel = InferModelFields<typeof SubjectModel>;
