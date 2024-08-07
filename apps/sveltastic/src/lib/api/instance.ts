import { createAuthApi, type AuthApi } from "./auth.api";
import { createClassroomApi, type ClassroomApi } from "./clasroom.api";
import { createUserApi, type UserApi } from "./user.api";

export const api = (
  fetchFn: typeof fetch = fetch,
): {
  auth: AuthApi;
  clasroom: ClassroomApi;
  user: UserApi;
} => ({
  auth: createAuthApi(fetchFn),
  clasroom: createClassroomApi(fetchFn),
  user: createUserApi(fetchFn),
});

export type ZdnevnikApi = ReturnType<typeof api>;
