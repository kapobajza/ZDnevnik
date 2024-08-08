import { ClassroomModel } from "./classroom";
import { SubjectModel } from "./subject";
import type { InferModelFields, ModelFieldsStartingMap } from "./types";
import { UserModel } from "./user";
import { model } from "./util";

const UserClasroomModelField = {
  Id: {
    name: "id",
    type: "string",
  },
  UserId: {
    name: "user_id",
    type: "string",
  },
  ClassroomId: {
    name: "classroom_id",
    type: "string",
  },
  IsTeacher: {
    name: "is_teacher",
    type: "boolean",
  },
} as const satisfies ModelFieldsStartingMap;

export const UserClasroomModel = model({
  name: "users_classrooms",
  fields: UserClasroomModelField,
  foreignKeys: [
    {
      key: UserClasroomModelField.UserId.name,
      referenceKey: UserModel.fields.Id.name,
      references: UserModel.name,
    },
    {
      key: UserClasroomModelField.ClassroomId.name,
      referenceKey: ClassroomModel.fields.Id.name,
      references: ClassroomModel.name,
    },
  ],
});

export type UserClasroomModel = InferModelFields<typeof UserClasroomModel>;

export const UserGradeModelField = {
  Id: {
    name: "id",
    type: "string",
  },
  UserId: {
    name: "user_id",
    type: "string",
  },
  SubjectId: {
    name: "subject_id",
    type: "string",
  },
  Grade: {
    name: "grade",
    type: "number",
    category: "smallint",
  },
} as const satisfies ModelFieldsStartingMap;

export const UserGradeModel = model({
  name: "users_grades",
  fields: UserGradeModelField,
  foreignKeys: [
    {
      key: UserGradeModelField.UserId.name,
      referenceKey: UserModel.fields.Id.name,
      references: UserModel.name,
    },
    {
      key: UserGradeModelField.SubjectId.name,
      referenceKey: SubjectModel.fields.Id.name,
      references: SubjectModel.name,
    },
  ],
});
