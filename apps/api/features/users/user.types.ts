import type { UserModel } from "~/api/db/models";

export type UserSessionDTO = Pick<UserModel, "id" | "username">;
