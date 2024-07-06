import { fastify } from "~/api/instance";
import postgresPlugin from "@fastify/postgres";
import type { ApiEnv } from "~/api/env/types";

export const registerDbPlugin = () => {
  const env = fastify.getEnvs<ApiEnv>();

  fastify.register(postgresPlugin, {
    connectionString: env.DATABASE_URL,
  });
};
