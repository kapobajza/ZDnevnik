import {
  ClassroomModel,
  UserModel,
  type InviteStudentBody,
  InviteTokenModel,
  type InviteResponseBody,
  UserClasroomModel,
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
import invariant from "tiny-invariant";
import * as DateFns from "date-fns";

import { InviteTokenStatus } from "./invite.types";

import { ModelORM } from "~/api/db/orm";
import {
  buildTestApp,
  doAuthenticatedRequest,
  insertMockClassroom,
  insertMockTeacherIntoClassroom,
} from "~/api/test/util";
import type { OkResponse } from "~/api/types/validation.types";
import { generateUdid } from "~/api/util/udid";
import { timestampGeneralFormat } from "~/api/util/date_time";
import { securelyHashString } from "~/api/util/secure";

describe("invite routes", () => {
  let fastify: FastifyInstance;
  let classroomModel: ModelORM<typeof ClassroomModel>;
  let userModel: ModelORM<typeof UserModel>;
  let userClassroomModel: ModelORM<typeof UserClasroomModel>;
  let inviteTokenModel: ModelORM<typeof InviteTokenModel>;
  const VALID_PASSWORD = "testtesttest";

  beforeAll(async () => {
    fastify = await buildTestApp();
    classroomModel = new ModelORM(
      ClassroomModel,
      fastify.dbPool,
      fastify.mappedTable,
    );
    userModel = new ModelORM(UserModel, fastify.dbPool, fastify.mappedTable);
    inviteTokenModel = new ModelORM(
      InviteTokenModel,
      fastify.dbPool,
      fastify.mappedTable,
    );
    userClassroomModel = new ModelORM(
      UserClasroomModel,
      fastify.dbPool,
      fastify.mappedTable,
    );
  });

  afterAll(async () => {
    await fastify.close();
  });

  afterEach(async () => {
    await userClassroomModel.delete().execute();
    await userModel.delete().execute();
    await inviteTokenModel.delete().execute();
    await classroomModel.delete().execute();
  });

  it("should return 422 when teacher tries to invite student with invalid body", async () => {
    const { teacher, classroom } = await insertMockTeacherIntoClassroom({
      classroomModel,
      userModel,
      userClassroomModel,
      password: VALID_PASSWORD,
    });

    const response = await doAuthenticatedRequest(fastify, {
      method: "POST",
      url: `/invite/${classroom.id}/student`,
      username: teacher.username,
      password: VALID_PASSWORD,
      body: {},
    });

    expect(response.statusCode).toBe(422);
  });

  it("should send invite email", async () => {
    const { teacher, classroom } = await insertMockTeacherIntoClassroom({
      classroomModel,
      userModel,
      userClassroomModel,
      password: VALID_PASSWORD,
    });
    const spy = vi.spyOn(fastify.emailClient, "send");

    const response = await doAuthenticatedRequest(fastify, {
      method: "POST",
      url: `/invite/${classroom.id}/student`,
      username: teacher.username,
      password: VALID_PASSWORD,
      body: {
        email: "test@example.com",
      } satisfies InviteStudentBody,
    });

    expect(spy).toHaveBeenCalled();
    expect(response.json()).toEqual({ ok: true } satisfies OkResponse);
  });

  it("should return 400 and update status field if token has expired", async () => {
    const userEmail = "test@user.com";
    const token = "random_token_string";
    const tokenSalt = "some_random_salt";
    const tokenId = generateUdid();
    const classroom = await insertMockClassroom(classroomModel);

    await inviteTokenModel
      .insert([
        ["Id", tokenId],
        ["Email", userEmail],
        ["Status", InviteTokenStatus.Pending],
        ["Token", token],
        ["ExpiresAt", timestampGeneralFormat(DateFns.addDays(new Date(), -5))],
        ["TokenSalt", tokenSalt],
        ["ClassroomId", classroom.id],
      ])
      .execute();

    const response = await fastify.inject({
      method: "POST",
      url: `invite/${token}/respond`,
      body: {
        email: userEmail,
        firstName: "Test",
        lastName: "Test",
        password: "Test1234",
      } satisfies InviteResponseBody,
    });

    const newToken = await inviteTokenModel
      .select()
      .where({
        field: InviteTokenModel.fields.Id,
        operator: "=",
        value: tokenId,
      })
      .executeOne();
    invariant(newToken, "Token not created");

    expect(response.statusCode).toBe(400);
    expect(newToken).toBeDefined();
    expect(newToken.status).toBe(InviteTokenStatus.Expired);
  });

  it("should create student when responding to invite successfully", async () => {
    const userEmail = "test@user.com";
    const token = "random_token_string";
    const tokenSalt = "some_random_salt";
    const tokenId = generateUdid();
    const classroom = await insertMockClassroom(classroomModel);

    await inviteTokenModel
      .insert([
        ["Id", tokenId],
        ["Email", userEmail],
        ["Status", InviteTokenStatus.Pending],
        ["Token", securelyHashString(token, tokenSalt)],
        ["ExpiresAt", timestampGeneralFormat(DateFns.addDays(new Date(), 5))],
        ["TokenSalt", tokenSalt],
        ["ClassroomId", classroom.id],
      ])
      .execute();

    const response = await fastify.inject({
      method: "POST",
      url: `invite/${token}/respond`,
      body: {
        email: userEmail,
        firstName: "Test",
        lastName: "Test",
        password: "Test1234",
      } satisfies InviteResponseBody,
    });

    const newToken = await inviteTokenModel
      .select()
      .where({
        field: InviteTokenModel.fields.Id,
        operator: "=",
        value: tokenId,
      })
      .executeOne();
    invariant(newToken, "Token not created");

    const user = await userModel
      .select({
        email: UserModel.fields.Username,
      })
      .where({
        field: UserModel.fields.Username,
        operator: "=",
        value: userEmail,
      })
      .executeOne();

    expect(response.statusCode).toBe(200);
    expect(newToken.status).toBe(InviteTokenStatus.Accepted);
    expect(user).toBeDefined();
  });
});
