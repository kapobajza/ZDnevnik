import { createApi, type CreateApiOptions } from "./api";

export const createAuthApi = (options: CreateApiOptions) => {
  const authApi = createApi({
    ...options,
    routePrefix: "auth",
  });

  return {
    login: async (username: string, password: string) => {
      await authApi.post("login", {
        username,
        password,
      });
    },
  };
};

export type AuthApi = ReturnType<typeof createAuthApi>;
