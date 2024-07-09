export type ModelSchema = {
  name: string;
  fields: object;
  foreignKeys?: {
    key: string;
    references: string;
    referenceKey: string;
  }[];
};

const UserModelField = {
  Id: "id",
  CreatedAt: "created_at",
  UpdatedAt: "updated_at",
  FirstName: "first_name",
  LastName: "last_name",
  Username: "username",
  PasswordHash: "password_hash",
  PasswordSalt: "password_salt",
  Avatar: "avatar",
  Role: "role",
  OrdinalNumber: "ordinal_number",
  AverageGrade: "average_grade",
} as const;

export const UserModel = {
  name: "users",
  fields: UserModelField,
} as const satisfies ModelSchema;

const ClassroomModelField = {
  Id: "id",
  CreatedAt: "created_at",
  UpdatedAt: "updated_at",
  Name: "name",
  StudentId: "student_id",
} as const;

export const ClassroomModel = {
  name: "classrooms",
  fields: ClassroomModelField,
  foreignKeys: [
    {
      references: UserModel.name,
      key: ClassroomModelField.StudentId,
      referenceKey: UserModelField.Id,
    },
  ],
} as const satisfies ModelSchema;

const SubjectModelField = {
  Id: "id",
  CreatedAt: "created_at",
  UpdatedAt: "updated_at",
  Name: "name",
  ClassroomId: "classroom_id",
} as const;

export const SubjectModel = {
  name: "subjects",
  fields: SubjectModelField,
  foreignKeys: [
    {
      key: SubjectModelField.ClassroomId,
      references: ClassroomModel.name,
      referenceKey: ClassroomModelField.Id,
    },
  ],
} as const satisfies ModelSchema;

const UserGradeModelField = {
  Id: "id",
  CreatedAt: "created_at",
  UpdatedAt: "updated_at",
  UserId: "user_id",
  SubjectId: "subject_id",
  Grade: "grade",
} as const;

export const UserGradeModel = {
  name: "user_grades",
  fields: UserGradeModelField,
  foreignKeys: [
    {
      key: UserGradeModelField.UserId,
      referenceKey: UserModelField.Id,
      references: UserModel.name,
    },
    {
      key: UserGradeModelField.SubjectId,
      referenceKey: SubjectModelField.Id,
      references: SubjectModel.name,
    },
  ],
} as const satisfies ModelSchema;
