import type {
  ColumnOptionsMap,
  InferColumnOptionsResult,
} from "~/api/db/types";
import { UserModel } from "~/api/features/users/users.model";

export const LoginSelectedUserDTO = {
  username: UserModel.fields.Username,
  passwordHash: UserModel.fields.PasswordHash,
  passwordSalt: UserModel.fields.PasswordSalt,
  id: UserModel.fields.Id,
  role: UserModel.fields.Role,
} as const satisfies ColumnOptionsMap;

export type LoginSelectedUserDTO = InferColumnOptionsResult<
  typeof LoginSelectedUserDTO
>;
