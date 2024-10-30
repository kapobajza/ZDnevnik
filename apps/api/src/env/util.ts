import type { FastifyInstance } from "fastify";
import type { FromSchema, JSONSchema } from "json-schema-to-ts";
import type { FastifyEnvOptions } from "@fastify/env";
import Env from "@fastify/env";

export const envSchema = {
  type: "object",
  required: [
    "DATABASE_URL",
    "SESSION_COOKIE_NAME",
    "SESSION_COOKIE_DOMAIN",
    "SESSION_COOKIE_MAX_AGE",
    "SESSION_SECRET",
    "AWS_SECRET_ACCESS_KEY",
    "AWS_ACCESS_KEY_ID",
    "AWS_REGION",
    "AWS_S3_IMAGES_BUCKET",
    "DEFAULT_USER_PASSWORD",
    "MAILGUN_API_KEY",
    "MAILGUN_API_URL",
    "WEB_APP_URL",
  ],
  properties: {
    DATABASE_URL: {
      type: "string",
    },
    SESSION_COOKIE_NAME: {
      type: "string",
    },
    SESSION_COOKIE_DOMAIN: {
      type: "string",
    },
    SESSION_COOKIE_MAX_AGE: {
      type: "integer",
    },
    PORT: {
      type: "integer",
    },
    SESSION_SECRET: {
      type: "string",
    },
    AWS_SECRET_ACCESS_KEY: {
      type: "string",
    },
    AWS_ACCESS_KEY_ID: {
      type: "string",
    },
    AWS_REGION: {
      type: "string",
    },
    AWS_S3_IMAGES_BUCKET: {
      type: "string",
    },
    DEFAULT_USER_PASSWORD: {
      type: "string",
    },
    MAILGUN_API_KEY: {
      type: "string",
    },
    MAILGUN_API_URL: {
      type: "string",
    },
    WEB_APP_URL: {
      type: "string",
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
