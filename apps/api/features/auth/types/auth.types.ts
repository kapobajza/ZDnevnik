import type { UserModel } from "~/api/db/models";

export type LoginSelectedUserDTO = Pick<
  UserModel,
  "username" | "password_hash" | "password_salt" | "id"
>;
