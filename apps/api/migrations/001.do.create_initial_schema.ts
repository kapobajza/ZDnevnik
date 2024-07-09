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
  "${UserModel.fields.Id}" varchar PRIMARY KEY,
  "${UserModel.fields.CreatedAt}" timestamp,
  "${UserModel.fields.UpdatedAt}" timestamp,
  "${UserModel.fields.FirstName}" varchar(255),
  "${UserModel.fields.LastName}" varchar(255),
  "${UserModel.fields.Username}" varchar(255) UNIQUE,
  "${UserModel.fields.PasswordHash}" varchar,
  "${UserModel.fields.PasswordSalt}" varchar,
  "${UserModel.fields.Avatar}" varchar,
  "${UserModel.fields.Role}" varchar(255),
  "${UserModel.fields.OrdinalNumber}" integer,
  "${UserModel.fields.AverageGrade}" decimal
);
  
CREATE TABLE "${ClassroomModel.name}" (
  "${ClassroomModel.fields.Id}" varchar PRIMARY KEY,
  "${ClassroomModel.fields.CreatedAt}" timestamp,
  "${ClassroomModel.fields.UpdatedAt}" timestamp,
  "${ClassroomModel.fields.Name}" varchar(255),
  "${ClassroomModel.fields.StudentId}" varchar
);

CREATE TABLE "${SubjectModel.name}" (
  "${SubjectModel.fields.Id}" varchar PRIMARY KEY,
  "${SubjectModel.fields.CreatedAt}" timestamp,
  "${SubjectModel.fields.UpdatedAt}" timestamp,
  "${SubjectModel.fields.Name}" varchar(500),
  "${SubjectModel.fields.ClassroomId}" varchar
);

CREATE TABLE "${UserGradeModel.name}" (
  "${UserGradeModel.fields.Id}" varchar PRIMARY KEY,
  "${UserGradeModel.fields.CreatedAt}" timestamp,
  "${UserGradeModel.fields.UpdatedAt}" timestamp,
  "${UserGradeModel.fields.UserId}" varchar,
  "${UserGradeModel.fields.SubjectId}" varchar,
  "${UserGradeModel.fields.Grade}" smallint
);

${createForeignKeyConstraints(ClassroomModel)}
${createForeignKeyConstraints(SubjectModel)}
${createForeignKeyConstraints(UserGradeModel)}
  `;
}
