import type { CreateInstanceOptions } from "./api";
import { createApi } from "./api";

export const createAuthApi = (options: CreateInstanceOptions) => {
  const authApi = createApi({
    ...options,
    routePrefix: "auth",
  });

  return {
    login: async (username: string, password: string) => {
      return authApi.post("login", {
        username,
        password,
      });
    },
  };
};

export type AuthApi = ReturnType<typeof createAuthApi>;
