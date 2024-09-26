import type { toZod } from "tozod";
import { z } from "zod";

import { UserModel } from "~/toolkit/models/user";
import type {
  ColumnOptionsMap,
  InferColumnOptionsResult,
} from "~/toolkit/models/types";

export const teacherStudentsSelect = {
  id: UserModel.fields.Id,
  firstName: UserModel.fields.FirstName,
  lastName: UserModel.fields.LastName,
  avatar: UserModel.fields.Avatar,
  ordinalNumber: UserModel.fields.OrdinalNumber,
  averageGrade: UserModel.fields.AverageGrade,
} as const satisfies ColumnOptionsMap;

export type TeacherStudentsDTO = InferColumnOptionsResult<
  typeof teacherStudentsSelect
>;

const teacherStudentSelectSchema: toZod<TeacherStudentsDTO> = z.object({
  avatar: z.string().nullable() as never,
  firstName: z.string(),
  id: z.string(),
  lastName: z.string(),
  ordinalNumber: z.number(),
  averageGrade: z.number(),
});

export const classroomStudentsDTOSchema = z.object({
  students: z.array(teacherStudentSelectSchema),
  classroom: z.object({
    id: z.string().optional(),
    name: z.string().optional(),
  }),
});

export type ClasroomStudentsDTO = z.infer<typeof classroomStudentsDTOSchema>;

export const getTeacherClasroomsDTOSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
  }),
);

export type GetTeacherClasroomsDTO = z.infer<
  typeof getTeacherClasroomsDTOSchema
>;
