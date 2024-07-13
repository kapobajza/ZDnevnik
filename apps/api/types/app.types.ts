import type { FastifyInstance as FastifyDefaultInstance } from "fastify";
import type { Pool as PgPool } from "pg";

import type { ApiEnv } from "~/api/env/types";

export const FastifyCustomProp = {
  DbPool: "dbPool",
} as const;

export type FastifyInstance = Omit<FastifyDefaultInstance, "getEnvs"> & {
  getEnvs: () => ApiEnv;
  [FastifyCustomProp.DbPool]: PgPool;
};
