import type { FieldModel, InferModelField, ModelSchema } from "./types";
import { CommonModelField } from "./util";

import {
  ClassroomModel,
  ClassroomModelField,
} from "~/api/features/clasrooms/classrooms.model";
import { UserModel, UserModelField } from "~/api/features/users/users.model";
import {
  SubjectModel,
  SubjectModelField,
} from "~/api/features/subjects/subjects.models";

export const UserClasroomModelField = {
  ...CommonModelField,
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
} as const satisfies FieldModel;

export type UserClasroomModel = InferModelField<typeof UserClasroomModelField>;

export const UserClasroomModel = {
  name: "users_classrooms",
  fields: UserClasroomModelField,
  foreignKeys: [
    {
      key: UserClasroomModelField.UserId.name,
      referenceKey: UserModelField.Id.name,
      references: UserModel.name,
    },
    {
      key: UserClasroomModelField.ClassroomId.name,
      referenceKey: ClassroomModelField.Id.name,
      references: ClassroomModel.name,
    },
  ],
} as const satisfies ModelSchema;

export const UserGradeModelField = {
  ...CommonModelField,
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
} as const satisfies FieldModel;

export const UserGradeModel = {
  name: "users_grades",
  fields: UserGradeModelField,
  foreignKeys: [
    {
      key: UserGradeModelField.UserId.name,
      referenceKey: UserModelField.Id.name,
      references: UserModel.name,
    },
    {
      key: UserGradeModelField.SubjectId.name,
      referenceKey: SubjectModelField.Id.name,
      references: SubjectModel.name,
    },
  ],
} as const satisfies ModelSchema;
