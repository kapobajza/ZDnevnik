import type { UserSessionDTO } from "~/api/features/users/user.types";

declare module "@fastify/secure-session" {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface SessionData {
    user: UserSessionDTO;
  }
}
