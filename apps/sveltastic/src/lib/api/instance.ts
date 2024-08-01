import { createAuthApi, type AuthApi } from "./auth.api";

import type { CreateApiOptions } from ".";

import { PUBLIC_API_URL } from "$env/static/public";

export const createApiInstance = ({
  origin,
}: Pick<CreateApiOptions, "origin">): {
  auth: AuthApi;
} => ({
  auth: createAuthApi({
    baseUrl: PUBLIC_API_URL,
    origin,
  }),
});

export type ApiInstance = ReturnType<typeof createApiInstance>;
