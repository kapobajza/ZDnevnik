import path from "path";

import { PostgreSqlContainer } from "@testcontainers/postgresql";
import Fastify, {
  type FastifyInstance,
  type InjectOptions,
  type LightMyRequestResponse,
} from "fastify";
import fp from "fastify-plugin";
import { Pool } from "pg";
import { runner as migrate } from "node-pg-migrate";
import { getRelativeMonoRepoPath } from "@zdnevnik/scripting";
import type { UserModel } from "@zdnevnik/toolkit";
import invariant from "tiny-invariant";

import { buildApp } from "~/api/app";
import { registerEnvPlugin, type EnvRecord } from "~/api/env/util";
import type { ModelORM } from "~/api/db/orm";
import { generatePasswordSalt, hashPassword } from "~/api/features/auth/util";

export async function buildTestApp() {
  const app = Fastify();
  const { postgresClient, postgresContainer } = await setupPgTestDatabase();

  const env: EnvRecord = {
    DATABASE_URL: postgresContainer.getConnectionUri(),
    SESSION_COOKIE_MAX_AGE: 60 * 60 * 1000,
    SESSION_COOKIE_NAME: "test",
    SESSION_COOKIE_DOMAIN: "test",
    SESSION_SECRET:
      "1111111111111111111111111111111111111111111111111111111111111111",
    AWS_SECRET_ACCESS_KEY: "test",
    AWS_ACCESS_KEY_ID: "test",
    AWS_REGION: "test",
    AWS_S3_IMAGES_BUCKET: "test",
    DEFAULT_USER_PASSWORD: "testtesttest",
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

  await migrate({
    databaseUrl: connectionString,
    dir: path.join(getRelativeMonoRepoPath("api"), "migrations"),
    direction: "up",
    migrationsTable: "pgmigrations",
    log: () => {},
  });

  return { postgresContainer, postgresClient };
}

export async function createMockUser(
  usersModel: ModelORM<typeof UserModel>,
  data: Partial<{
    password: string;
    role: string;
    username: string;
  }> = {},
) {
  const {
    password = "testtesttest",
    role = "test",
    username = "test",
  } = data || {};
  const salt = generatePasswordSalt();
  const hashedPassword = hashPassword(password, salt);

  const user = await usersModel
    .insert([
      ["Id", "1"],
      ["Username", username],
      ["PasswordHash", hashedPassword],
      ["PasswordSalt", salt],
      ["Role", role],
    ])
    .executeOne();

  invariant(user, "User not created");

  return {
    ...user,
    plainPassword: password,
  };
}

export const doAuthenticatedRequest = async (
  app: FastifyInstance,
  opts: InjectOptions & {
    username: string;
    password: string;
  },
): Promise<LightMyRequestResponse> => {
  const { username, password, ...injectOpts } = opts;

  const authResponse = await app.inject({
    method: "POST",
    url: "/auth/login",
    payload: {
      username,
      password,
    },
  });

  return app.inject({
    ...injectOpts,
    headers: {
      ...injectOpts.headers,
      cookie: authResponse.headers["set-cookie"],
    },
  });
};
