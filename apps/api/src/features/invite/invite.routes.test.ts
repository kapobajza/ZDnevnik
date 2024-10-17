import {
  ClassroomModel,
  UserModel,
  type AddStudentBody,
} from "@zdnevnik/toolkit";
import type { FastifyInstance } from "fastify";
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { ModelORM } from "~/api/db/orm";
import {
  buildTestApp,
  doAuthenticatedRequest,
  insertMockTeacher,
} from "~/api/test/util";
import type { OkResponse } from "~/api/types/validation.types";

describe("invite routes", () => {
  let fastify: FastifyInstance;
  let classroomsModel: ModelORM<typeof ClassroomModel>;
  let usersModel: ModelORM<typeof UserModel>;
  const VALID_PASSWORD = "testtesttest";

  beforeAll(async () => {
    fastify = await buildTestApp();
    classroomsModel = new ModelORM(
      ClassroomModel,
      fastify.dbPool,
      fastify.mappedTable,
    );
    usersModel = new ModelORM(UserModel, fastify.dbPool, fastify.mappedTable);
  });

  afterAll(async () => {
    await fastify.close();
  });

  afterEach(async () => {
    await usersModel.delete().execute();
    await classroomsModel.delete().execute();
  });

  it("should return 422 when teacher tries to invite student with invalid body", async () => {
    const teacher = await insertMockTeacher(usersModel, VALID_PASSWORD);

    const response = await doAuthenticatedRequest(fastify, {
      method: "POST",
      url: "/invite/student",
      username: teacher.username,
      password: VALID_PASSWORD,
      body: {},
    });

    expect(response.statusCode).toBe(422);
  });

  it("should send invite email", async () => {
    const teacher = await insertMockTeacher(usersModel, VALID_PASSWORD);
    const spy = vi.spyOn(fastify.emailClient, "send");

    const response = await doAuthenticatedRequest(fastify, {
      method: "POST",
      url: "/invite/student",
      username: teacher.username,
      password: VALID_PASSWORD,
      body: {
        email: "test@example.com",
      } satisfies AddStudentBody,
    });

    expect(spy).toHaveBeenCalled();
    expect(response.json()).toEqual({ ok: true } satisfies OkResponse);
  });
});
