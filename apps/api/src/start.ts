import path from "path";

import Fastify from "fastify";
import fp from "fastify-plugin";
import { Pool } from "pg";
import yargs from "yargs";

import { createEmailClient } from "./email/client";

import { appEnvArgSchema, type AppEnv } from "~/api/types";
import { buildApp } from "~/api/app";
import { registerEnvPlugin } from "~/api/env/util";

const args = process.argv.slice(2);

const argv = yargs(args)
  .option({
    env: {
      type: "string",
      alias: "e",
      default: "local",
    },
  })
  .check((argv) => {
    if (!appEnvArgSchema.safeParse(argv.env).success) {
      throw new Error(`Invalid env argument: ${argv.env}`);
    }

    return true;
  }).argv;

async function main() {
  const app = Fastify({
    logger: true,
  });

  await registerEnvPlugin(app, {
    dotenv: {
      path: path.join(process.cwd(), `.env.${argv.env}`),
    },
  });

  const envs = app.getEnvs();

  const pool = new Pool({
    connectionString: envs.DATABASE_URL,
  });

  await app.register(fp(buildApp), {
    env: envs,
    pgPool: pool,
    appEnv: argv.env as AppEnv,
    emailClient: createEmailClient(envs),
  });

  app.addHook("onClose", async () => {
    await pool.end();
  });

  app.listen(
    { port: envs.PORT ?? 5050, host: "0.0.0.0" },
    function (err, address) {
      if (err) {
        app.log.error(err);
        process.exit(1);
      }

      console.log(`server listening on ${address}`);
    },
  );
}

void main();
