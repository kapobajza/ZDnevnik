import type { UserModel } from "~/api/features/users/users.model";

export type LoginSelectedUserDTO = Pick<
  UserModel,
  "username" | "password_hash" | "password_salt" | "id" | "role"
>;
