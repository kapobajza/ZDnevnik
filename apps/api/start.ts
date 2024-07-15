import Fastify from "fastify";
import fp from "fastify-plugin";
import { Pool } from "pg";
import Env from "@fastify/env";

import { buildApp } from "~/api/app";
import { ApiEnv } from "~/api/env/types";

async function main() {
  const app = Fastify({
    logger: true,
  });

  await app.register(Env, {
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

  const envs = app.getEnvs();

  const pool = new Pool({
    connectionString: envs.DATABASE_URL,
  });

  await app.register(fp(buildApp), {
    env: envs,
    pgPool: pool,
  });

  app.addHook("onClose", async () => {
    await pool.end();
  });

  app.listen({ port: 3000 }, function (err, address) {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }

    console.log(`server listening on ${address}`);
  });
}

void main();
