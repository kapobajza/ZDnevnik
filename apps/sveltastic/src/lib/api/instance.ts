import { createAuthApi, type AuthApi } from "./auth.api";

import { PUBLIC_API_URL } from "$env/static/public";

export const createApiInstance = (): {
  auth: AuthApi;
} => ({
  auth: createAuthApi({
    baseUrl: PUBLIC_API_URL,
  }),
});

export type ApiInstance = ReturnType<typeof createApiInstance>;
