import { createAuthApi, type AuthApi } from "./auth.api";

import type { CreateApiOptions } from ".";

import { PUBLIC_API_URL } from "$env/static/public";

export const createApiInstance = ({
  origin,
  responseInterceptor,
}: Omit<CreateApiOptions, "baseUrl">): {
  auth: AuthApi;
} => ({
  auth: createAuthApi({
    baseUrl: PUBLIC_API_URL,
    origin,
    responseInterceptor,
  }),
});

export type ApiInstance = ReturnType<typeof createApiInstance>;
