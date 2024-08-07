import { UserModel, type UsersMeDTO } from "@zdnevnik/toolkit";
import type { FastifyInstance } from "fastify";
import { beforeAll, describe, expect, test } from "vitest";

import { ModelORM } from "~/api/db/orm";
import {
  buildTestApp,
  createMockUser,
  doAuthenticatedRequest,
} from "~/api/test/util";

describe("users routes", () => {
  let usersModel: ModelORM<typeof UserModel>;
  let fastify: FastifyInstance;

  beforeAll(async () => {
    fastify = await buildTestApp();
    usersModel = new ModelORM(UserModel, fastify.dbPool, fastify.mappedTable);
  });

  test("should return current user", async () => {
    const user = await createMockUser(usersModel);

    const response = await doAuthenticatedRequest(fastify, {
      method: "GET",
      url: "/users/me",
      username: user.username,
      password: user.plainPassword,
    });

    const expectetResponse: UsersMeDTO = {
      id: user.id,
      username: user.username,
      role: user.role,
      avatar: user.avatar,
      averageGrade: user.average_grade,
      ordinalNumber: user.ordinal_number,
      firstName: user.first_name,
      lastName: user.last_name,
    };

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      user: expectetResponse,
    });
  });
});
