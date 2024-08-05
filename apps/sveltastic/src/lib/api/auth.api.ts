import { createApi } from "./api";

export const createAuthApi = (fetchFn: typeof fetch) => {
  const authApi = createApi({
    fetchFn,
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
