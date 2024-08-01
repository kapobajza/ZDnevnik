import path from "path";

import Fastify from "fastify";
import fp from "fastify-plugin";
import { Pool } from "pg";
import yargs from "yargs";
import { z } from "zod";

import { buildApp } from "~/api/app";
import { registerEnvPlugin } from "~/api/env/util";

const args = process.argv.slice(2);

const envArgSchema = z.union([
  z.literal("local"),
  z.literal("dev"),
  z.literal("prod"),
]);

const argv = yargs(args)
  .option({
    env: {
      type: "string",
      alias: "e",
      default: "local",
    },
  })
  .check((argv) => {
    if (!envArgSchema.safeParse(argv.env).success) {
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
  });

  app.addHook("onClose", async () => {
    await pool.end();
  });

  app.listen({ port: 5000 }, function (err, address) {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }

    console.log(`server listening on ${address}`);
  });
}

void main();
