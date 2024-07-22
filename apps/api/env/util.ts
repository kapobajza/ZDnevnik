import type { FastifyInstance } from "fastify";
import type { FromSchema, JSONSchema } from "json-schema-to-ts";
import type { FastifyEnvOptions } from "@fastify/env";
import Env from "@fastify/env";

export const envSchema = {
  type: "object",
  required: [
    "DATABASE_URL",
    "COOKIE_NAME",
    "ACCESS_COOKIE_MAX_AGE",
    "REFRESH_COOKIE_MAX_AGE",
  ],
  properties: {
    DATABASE_URL: {
      type: "string",
    },
    COOKIE_NAME: {
      type: "string",
    },
    ACCESS_COOKIE_MAX_AGE: {
      type: "integer",
    },
    REFRESH_COOKIE_MAX_AGE: {
      type: "integer",
    },
  },
} as const satisfies JSONSchema;

export type EnvRecord = FromSchema<typeof envSchema>;

export const registerEnvPlugin = async (
  fastify: FastifyInstance,
  options?: FastifyEnvOptions,
) => {
  await fastify.register(Env, {
    schema: envSchema,
    ...options,
  });
};
