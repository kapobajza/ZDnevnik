import type { UsersMeDTO } from "@zdnevnik/toolkit";

import { createApi } from "./api";

export const createUserApi = (fetchFn: typeof fetch) => {
  const userApi = createApi({
    fetchFn,
    routePrefix: "users",
  });

  return {
    me: async () => {
      const { data } = await userApi.get<{ user: UsersMeDTO }>("me");
      return data.user;
    },
  };
};

export type UserApi = ReturnType<typeof createUserApi>;
