import type { Pool } from "pg";

import type { ApiEnv } from "~/api/env/types";

declare module "fastify" {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  export interface FastifyInstance {
    getEnvs(): ApiEnv;
    dbPool: Pool;
  }
}
