import type { toZod } from "tozod";
import { z } from "zod";

import {
  UserModel,
  type ColumnOptionsMap,
  type InferColumnOptionsResult,
} from "~/toolkit/models";

export const usersDefaultSelect = {
  id: UserModel.fields.Id,
  firstName: UserModel.fields.FirstName,
  lastName: UserModel.fields.LastName,
  username: UserModel.fields.Username,
  role: UserModel.fields.Role,
  avatar: UserModel.fields.Avatar,
  ordinalNumber: UserModel.fields.OrdinalNumber,
  averageGrade: UserModel.fields.AverageGrade,
} as const satisfies ColumnOptionsMap;

export type UsersDefaultDTO = InferColumnOptionsResult<
  typeof usersDefaultSelect
>;

export const usersDefaultSelectSchema = z.object({
  avatar: z.string().nullable().optional(),
  averageGrade: z.number(),
  firstName: z.string(),
  id: z.string(),
  lastName: z.string(),
  ordinalNumber: z.number(),
  role: z.string(),
  username: z.string(),
}) satisfies toZod<Omit<UsersDefaultDTO, "avatar">>;
