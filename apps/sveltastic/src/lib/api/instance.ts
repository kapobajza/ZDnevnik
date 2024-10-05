import type { CreateInstanceOptions } from "./api";
import { createAuthApi, type AuthApi } from "./auth.api";
import { createClassroomApi, type ClassroomApi } from "./clasroom.api";
import type { ImageApi } from "./image.api";
import { createImageApi } from "./image.api";
import { createUserApi, type UserApi } from "./user.api";

export const api = (
  options?: CreateInstanceOptions,
): {
  auth: AuthApi;
  clasroom: ClassroomApi;
  user: UserApi;
  image: ImageApi;
} => {
  const apiOptions: CreateInstanceOptions = {
    ...options,
    fetch: options?.fetch ?? fetch,
  };

  return {
    auth: createAuthApi(apiOptions),
    clasroom: createClassroomApi(apiOptions),
    user: createUserApi(apiOptions),
    image: createImageApi(apiOptions),
  };
};

export type ZdnevnikApi = ReturnType<typeof api>;

export type ApiFn = typeof api;
