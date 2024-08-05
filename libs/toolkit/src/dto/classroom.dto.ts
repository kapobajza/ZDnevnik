import { UserModel } from "~/toolkit/models/user";
import type {
  ColumnOptionsMap,
  InferColumnOptionsResult,
} from "~/toolkit/models/types";

export const clasroomStudentsSelect = {
  id: UserModel.fields.Id,
  firstName: UserModel.fields.FirstName,
  lastName: UserModel.fields.LastName,
  avatar: UserModel.fields.Avatar,
  ordinalNumber: UserModel.fields.OrdinalNumber,
  averageGrade: UserModel.fields.AverageGrade,
} as const satisfies ColumnOptionsMap;

export type ClasroomStudentsDTO = InferColumnOptionsResult<
  typeof clasroomStudentsSelect
>;
