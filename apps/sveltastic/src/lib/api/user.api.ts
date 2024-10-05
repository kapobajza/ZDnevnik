import type { UsersDefaultDTO } from "@zdnevnik/toolkit";

import type { CreateInstanceOptions } from "./api";
import { createApi } from "./api";

export const createUserApi = (options: CreateInstanceOptions) => {
  const userApi = createApi({
    ...options,
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
