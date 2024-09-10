import path from "path";

import {
  serializerCompiler as zodSerializerCompiler,
  validatorCompiler as zodValidatorCompiler,
} from "fastify-type-provider-zod";
import Postgres from "@fastify/postgres";
import AutoLoad from "@fastify/autoload";
import PrintRoutes from "fastify-print-routes";
import SecureSession from "@fastify/secure-session";
import { type FastifyInstance } from "fastify";
import type { Pool } from "pg";
import { ZodError } from "zod";
import FastifyAuth from "@fastify/auth";

import type { AppEnv } from "./types";

import {
  HttpErrorCode,
  HttpErrorStatus,
  type HttpValidationError,
  type ValidationError,
} from "~/api/error/types";
import { type EnvRecord } from "~/api/env/util";

export async function buildApp(
  fastify: FastifyInstance,
  opts: {
    testing?: boolean;
    env: EnvRecord;
    pgPool: Pool;
    appEnv: AppEnv;
  },
) {
  fastify.setErrorHandler((error, _request, reply) => {
    if (error instanceof ZodError) {
      const responseError: HttpValidationError = {
        code: HttpErrorCode.ValidationError,
        message: "An error occured during validation",
        validationErrors: error.issues.map<ValidationError>((issue) => ({
          code: issue.code,
          message: issue.message,
          path: issue.path,
        })),
        statusCode: HttpErrorStatus.UnprocessableEntity,
      };
      return reply.status(responseError.statusCode).send(responseError);
    }

    return reply.status(500).send(error);
  });

  await fastify.register(Postgres, {
    connectionString: opts.env.DATABASE_URL,
  });

  fastify.setValidatorCompiler(zodValidatorCompiler);
  fastify.setSerializerCompiler(zodSerializerCompiler);

  await fastify.register(AutoLoad, {
    dir: path.join(__dirname, "plugins"),
    options: {
      pool: opts.pgPool,
    },
  });

  if (!opts?.testing) {
    await fastify.register(PrintRoutes);
  }

  await fastify.register(SecureSession, {
    key: Buffer.from(opts.env.SESSION_SECRET, "hex"),
    cookieName: opts.env.SESSION_COOKIE_NAME,
    cookie: {
      httpOnly: true,
      path: "/",
      domain: opts.env.SESSION_COOKIE_DOMAIN,
      secure: opts.appEnv !== "local",
      sameSite: opts.appEnv === "local" ? "none" : "lax",
    },
  });

  await fastify.register(FastifyAuth);

  await fastify.register(AutoLoad, {
    dir: path.join(__dirname, "features"),
    matchFilter: (path) => {
      return /\.routes\.(t|j)s$/.test(path);
    },
    maxDepth: 2,
  });
}
