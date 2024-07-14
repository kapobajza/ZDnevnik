import path from "path";
import fs from "fs";

import {
  serializerCompiler as zodSerializerCompiler,
  validatorCompiler as zodValidatorCompiler,
} from "fastify-type-provider-zod";
import Env from "@fastify/env";
import Postgres from "@fastify/postgres";
import AutoLoad from "@fastify/autoload";
import PrintRoutes from "fastify-print-routes";
import SecureSession from "@fastify/secure-session";
import type { FastifyInstance } from "fastify";
import type { Pool } from "pg";

import { ApiEnv } from "~/api/env/types";

export async function buildApp(
  fastify: FastifyInstance,
  opts: {
    testing?: boolean;
    connectionString: string;
    pgPool: Pool;
  },
) {
  await fastify.register(Env, {
    dotenv: true,
    schema: {
      type: "object",
      required: [ApiEnv.DATABASE_URL, ApiEnv.COOKIE_NAME],
      properties: {
        [ApiEnv.DATABASE_URL]: {
          type: "string",
        },
        [ApiEnv.COOKIE_NAME]: {
          type: "string",
        },
      },
    },
  });

  const env = fastify.getEnvs();

  await fastify.register(Postgres, {
    connectionString: opts.connectionString,
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
    key: fs.readFileSync(path.join(__dirname, "session_key")),
    cookieName: env.COOKIE_NAME,
  });

  await fastify.register(AutoLoad, {
    dir: path.join(__dirname, "features"),
    matchFilter: (path) => {
      return path.endsWith(".routes.ts");
    },
    ignoreFilter(path) {
      return path.endsWith("test.routes.ts");
    },
    maxDepth: 1,
  });
}
