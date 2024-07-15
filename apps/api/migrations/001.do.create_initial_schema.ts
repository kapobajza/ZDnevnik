import {
  ClassroomModel,
  SubjectModel,
  UserGradeModel,
  UserModel,
} from "~/api/db/models";
import { createForeignKeyConstraints } from "~/api/db/util";

export default function generateSql() {
  return `
CREATE TABLE "${UserModel.name}" (
  "${UserModel.fields.Id.name}" varchar PRIMARY KEY,
  "${UserModel.fields.CreatedAt.name}" timestamp,
  "${UserModel.fields.UpdatedAt.name}" timestamp,
  "${UserModel.fields.FirstName.name}" varchar(255),
  "${UserModel.fields.LastName.name}" varchar(255),
  "${UserModel.fields.Username.name}" varchar(255) UNIQUE,
  "${UserModel.fields.PasswordHash.name}" varchar,
  "${UserModel.fields.PasswordSalt.name}" varchar,
  "${UserModel.fields.Avatar.name}" varchar,
  "${UserModel.fields.Role.name}" varchar(255),
  "${UserModel.fields.OrdinalNumber.name}" integer,
  "${UserModel.fields.AverageGrade.name}" decimal
);
  
CREATE TABLE "${ClassroomModel.name}" (
  "${ClassroomModel.fields.Id.name}" varchar PRIMARY KEY,
  "${ClassroomModel.fields.CreatedAt.name}" timestamp,
  "${ClassroomModel.fields.UpdatedAt.name}" timestamp,
  "${ClassroomModel.fields.Name.name}" varchar(255),
  "${ClassroomModel.fields.StudentId.name}" varchar
);

CREATE TABLE "${SubjectModel.name}" (
  "${SubjectModel.fields.Id.name}" varchar PRIMARY KEY,
  "${SubjectModel.fields.CreatedAt.name}" timestamp,
  "${SubjectModel.fields.UpdatedAt.name}" timestamp,
  "${SubjectModel.fields.Name.name}" varchar(500),
  "${SubjectModel.fields.ClassroomId.name}" varchar
);

CREATE TABLE "${UserGradeModel.name}" (
  "${UserGradeModel.fields.Id.name}" varchar PRIMARY KEY,
  "${UserGradeModel.fields.CreatedAt.name}" timestamp,
  "${UserGradeModel.fields.UpdatedAt.name}" timestamp,
  "${UserGradeModel.fields.UserId.name}" varchar,
  "${UserGradeModel.fields.SubjectId.name}" varchar,
  "${UserGradeModel.fields.Grade.name}" smallint
);

${createForeignKeyConstraints(ClassroomModel)}
${createForeignKeyConstraints(SubjectModel)}
${createForeignKeyConstraints(UserGradeModel)}
  `;
}