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
import type { UserModel, ClassroomModel } from "@zdnevnik/toolkit";
import { type InferModelFields, UserRole } from "@zdnevnik/toolkit";
import invariant from "tiny-invariant";

import { buildApp } from "~/api/app";
import { registerEnvPlugin, type EnvRecord } from "~/api/env/util";
import type { ModelORM } from "~/api/db/orm";
import { generateSecureString, securelyHashString } from "~/api/util/secure";
import { generateUdid } from "~/api/util/udid";

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
    MAILGUN_API_KEY: "test",
    MAILGUN_API_URL: "https://example.com",
    WEB_APP_URL: "http://zdnevnik.local",
  };

  await registerEnvPlugin(app, {
    data: env,
  });

  await app.register(fp(buildApp), {
    testing: true,
    pgPool: postgresClient,
    env,
    appEnv: "local",
    emailClient: {
      async send() {},
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
  const salt = generateSecureString();
  const hashedPassword = securelyHashString(password, salt);

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

export const insertMockTeacher = async (
  usersModel: ModelORM<typeof UserModel>,
  password: string,
) => {
  const salt = generateSecureString();
  const hashedPassword = securelyHashString(password, salt);

  const teacher = await usersModel
    .insert([
      ["Id", generateUdid()],
      ["Username", "test"],
      ["PasswordHash", hashedPassword],
      ["PasswordSalt", salt],
      ["Role", UserRole.Teacher],
    ])
    .executeOne<InferModelFields<typeof UserModel>>();

  invariant(teacher, "Teacher not created");

  return teacher;
};

export const insertMockClassroom = async (
  classroomsModel: ModelORM<typeof ClassroomModel>,
) => {
  const classroom = await classroomsModel
    .insert([
      ["Id", generateUdid()],
      ["Name", "classroom"],
    ])
    .executeOne<ClassroomModel>();

  invariant(classroom, "Classroom not created");

  return classroom;
};
