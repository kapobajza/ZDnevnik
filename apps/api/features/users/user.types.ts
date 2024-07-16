import type { UserModel } from "./users.model";

export type UserSessionDTO = Pick<UserModel, "id" | "username" | "role">;

export const UserRole = {
  Teacher: "teacher",
  Student: "student",
} as const;
