import type { UsersDefaultDTO } from "@zdnevnik/toolkit";

import { createApi } from "./api";

export const createUserApi = (fetchFn: typeof fetch) => {
  const userApi = createApi({
    fetchFn,
    routePrefix: "users",
  });

  return {
    me: async () => {
      const { data } = await userApi.get<{ user: UsersDefaultDTO }>("me");
      return data.user;
    },
  };
};

export type UserApi = ReturnType<typeof createUserApi>;
