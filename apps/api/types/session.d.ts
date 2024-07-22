import type { LoginSelectedUserDTO } from "~/api/features/auth/types";

declare module "@fastify/secure-session" {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface SessionData {
    user: LoginSelectedUserDTO;
    options: {
      accessCookieMaxAge: number;
      refreshCookieMaxAge: number;
    };
  }
}
