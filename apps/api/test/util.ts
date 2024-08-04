import path from "path";

import { PostgreSqlContainer } from "@testcontainers/postgresql";
import Fastify from "fastify";
import fp from "fastify-plugin";
import { Pool } from "pg";
import Postgrator from "postgrator";
import { getRelativeMonoRepoPath } from "@zdnevnik/scripting";

import { buildApp } from "~/api/app";
import { registerEnvPlugin, type EnvRecord } from "~/api/env/util";

export async function buildTestApp() {
  const app = Fastify();
  const { postgresClient, postgresContainer } = await setupPgTestDatabase();

  const env: EnvRecord = {
    DATABASE_URL: postgresContainer.getConnectionUri(),
    SESSION_COOKIE_MAX_AGE: 60 * 60 * 1000,
    SESSION_COOKIE_NAME: "test",
    SESSION_COOKIE_DOMAIN: "test",
  };

  await registerEnvPlugin(app, {
    data: env,
  });

  await app.register(fp(buildApp), {
    testing: true,
    pgPool: postgresClient,
    env,
    appEnv: "local",
  });

  app.addHook("onClose", async () => {
    await postgresClient.end();
    await postgresContainer.stop();
  });

  return app;
}

export async function setupPgTestDatabase() {
  const postgresContainer = await new PostgreSqlContainer().start();
  const connectionString = postgresContainer.getConnectionUri();
  const postgresClient = new Pool({
    connectionString,
  });

  const database = "zdnevnik_test";
  await postgresClient.query(`CREATE DATABASE ${database}`);

  const postgrator = new Postgrator({
    migrationPattern: `${path.join(getRelativeMonoRepoPath("api"), "migrations")}/*`,
    driver: "pg",
    database,
    execQuery: (query) => postgresClient.query(query),
  });

  await postgrator.migrate();

  return { postgresContainer, postgresClient };
}
