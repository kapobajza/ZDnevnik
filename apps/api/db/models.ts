import type { FieldModel, InferModelField } from "./types";

export type ModelSchema = {
  name: string;
  fields: FieldModel;
  foreignKeys?: {
    key: string;
    references: string;
    referenceKey: string;
  }[];
};

const CommonModelField = {
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

const UserModelField = {
  ...CommonModelField,
  Id: {
    name: "id",
    type: "string",
  },
  FirstName: {
    name: "first_name",
    type: "string",
    length: 255,
  },
  LastName: {
    name: "last_name",
    type: "string",
    length: 255,
  },
  Username: {
    name: "username",
    type: "string",
    length: 255,
  },
  PasswordHash: {
    name: "password_hash",
    type: "string",
  },
  PasswordSalt: {
    name: "password_salt",
    type: "string",
  },
  Avatar: {
    name: "avatar",
    type: "string",
  },
  Role: {
    name: "role",
    type: "string",
    length: 255,
  },
  OrdinalNumber: {
    name: "ordinal_number",
    type: "number",
    category: "integer",
  },
  AverageGrade: {
    name: "average_grade",
    type: "number",
    category: "decimal",
  },
} as const satisfies FieldModel;

export type UserModel = InferModelField<typeof UserModelField>;

export const UserModel = {
  name: "users",
  fields: UserModelField,
} as const satisfies ModelSchema;

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
  StudentId: {
    name: "student_id",
    type: "string",
  },
} as const satisfies FieldModel;

export const ClassroomModel = {
  name: "classrooms",
  fields: ClassroomModelField,
  foreignKeys: [
    {
      references: UserModel.name,
      key: ClassroomModelField.StudentId.name,
      referenceKey: UserModelField.Id.name,
    },
  ],
} as const satisfies ModelSchema;

const SubjectModelField = {
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

const UserGradeModelField = {
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
  name: "user_grades",
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
