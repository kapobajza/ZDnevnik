import {
  UserModel,
  type ColumnOptionsMap,
  type InferColumnOptionsResult,
} from "~/toolkit/models";

export const usersMeSelect = {
  id: UserModel.fields.Id,
  firstName: UserModel.fields.FirstName,
  lastName: UserModel.fields.LastName,
  username: UserModel.fields.Username,
  role: UserModel.fields.Role,
  avatar: UserModel.fields.Avatar,
  ordinalNumber: UserModel.fields.OrdinalNumber,
  averageGrade: UserModel.fields.AverageGrade,
} as const satisfies ColumnOptionsMap;

export type UsersMeDTO = InferColumnOptionsResult<typeof usersMeSelect>;
