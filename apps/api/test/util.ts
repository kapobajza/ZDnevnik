import path from "path";

import { PostgreSqlContainer } from "@testcontainers/postgresql";
import Fastify from "fastify";
import fp from "fastify-plugin";
import { Pool } from "pg";
import Postgrator from "postgrator";
import { getRelativeMonoRepoPath } from "@zdnevnik/toolkit";

import { buildApp } from "~/api/app";

export async function buildTestApp() {
  const app = Fastify();
  const { postgresClient, postgresContainer } = await setupPgTestDatabase();

  await app.register(fp(buildApp), {
    testing: true,
    pgPool: postgresClient,
    env: {
      DATABASE_URL: postgresContainer.getConnectionUri(),
      COOKIE_NAME: "test",
    },
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
    migrationPattern: `${path.join(getRelativeMonoRepoPath("api"), "migrations", "sql")}/*`,
    driver: "pg",
    database,
    execQuery: (query) => postgresClient.query(query),
  });

  await postgrator.migrate();

  return { postgresContainer, postgresClient };
}
