import { createAuthApi, type AuthApi } from "./auth.api";
import { createClassroomApi, type ClassroomApi } from "./clasroom.api";

export const api = (
  fetchFn: typeof fetch = fetch,
): {
  auth: AuthApi;
  clasroom: ClassroomApi;
} => ({
  auth: createAuthApi(fetchFn),
  clasroom: createClassroomApi(fetchFn),
});

export type ZdnevnikApi = ReturnType<typeof api>;
