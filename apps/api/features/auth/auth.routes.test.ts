import { type FastifyInstance } from "fastify";
import invariant from "tiny-invariant";
import { describe, beforeAll, expect, it, afterEach, afterAll } from "vitest";

import { generatePasswordSalt, hashPassword } from "./util";

import { buildTestApp } from "~/api/test/util";
import { UserModel } from "~/api/features/users/users.model";
import { ModelORM } from "~/api/db/orm";
import {
  HttpErrorCode,
  HttpErrorStatus,
  type HttpError,
  type HttpValidationError,
} from "~/api/error/types";

describe("auth routes", () => {
  let fastify: FastifyInstance;
  const username = "test";
  const password = "testtesttest";
  const protectedRoute = "/protected";
  let usersModel: ModelORM<typeof UserModel>;

  beforeAll(async () => {
    fastify = await buildTestApp();
    fastify.get(
      protectedRoute,
      {
        preHandler: [fastify.verifyUserFromSession],
      },
      (_request, reply) => {
        return reply.send({ ok: true });
      },
    );
    usersModel = new ModelORM(UserModel, fastify.dbPool, fastify.mappedTable);
  });

  afterAll(async () => {
    await fastify.close();
  });

  const inserNewUser = async () => {
    const salt = generatePasswordSalt();
    const hashedPassword = hashPassword(password, salt);

    const user = await usersModel
      .insert([
        ["Id", "1"],
        ["Username", username],
        ["PasswordHash", hashedPassword],
        ["PasswordSalt", salt],
      ])
      .executeOne();

    invariant(user, "User not created");

    return user;
  };

  afterEach(async () => {
    await usersModel.delete().execute();
  });

  it("should get invalid_credentials if username doesn't exist", async () => {
    const response = await fastify.inject({
      method: "POST",
      url: "/auth/login",
      payload: {
        username,
        password,
      },
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(
      JSON.stringify({
        error: "invalid_credentials",
      }),
    );
  });

  it("should get invalid_credentials if password is incorrect", async () => {
    await inserNewUser();

    const response = await fastify.inject({
      method: "POST",
      url: "/auth/login",
      payload: {
        username: username,
        password: "testtesttest2",
      },
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(
      JSON.stringify({
        error: "invalid_credentials",
      }),
    );
  });

  it("should login with correct credentials", async () => {
    await inserNewUser();

    const response = await fastify.inject({
      method: "POST",
      url: "/auth/login",
      payload: {
        username: username,
        password: password,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.headers["set-cookie"]).toBeTruthy();
  });

  it("should get 422 if username or password don't pass validation", async () => {
    const response = await fastify.inject({
      method: "POST",
      url: "/auth/login",
      payload: {
        username: "",
        password: "",
      },
    });

    expect(response.statusCode).toBe(422);
    const errorResponse: HttpValidationError = {
      code: HttpErrorCode.ValidationError,
      message: "An error occured during validation",
      validationErrors: [
        {
          code: "too_small",
          message: "String must contain at least 1 character(s)",
          path: ["username"],
        },
        {
          code: "too_small",
          message: "String must contain at least 8 character(s)",
          path: ["password"],
        },
      ],
      statusCode: HttpErrorStatus.UnprocessableEntity,
    };

    expect(response.body).toEqual(JSON.stringify(errorResponse));
  });

  it("should return unauthorized if not logged in for protected routes", async () => {
    const response = await fastify.inject({
      method: "GET",
      url: protectedRoute,
    });

    expect(response.statusCode).toBe(401);
    const error: HttpError = {
      code: HttpErrorCode.Unathorized,
      message: "unauthorized",
      statusCode: 401,
    };
    expect(response.json()).toEqual(error);
  });

  it("should return ok if logged in", async () => {
    await inserNewUser();

    const authResponse = await fastify.inject({
      method: "POST",
      url: "/auth/login",
      payload: {
        username: username,
        password: password,
      },
    });

    const okResponse = await fastify.inject({
      method: "GET",
      url: protectedRoute,
      headers: {
        cookie: authResponse.headers["set-cookie"],
      },
    });

    expect(okResponse.statusCode).toBe(200);
    expect(okResponse.body).toEqual(JSON.stringify({ ok: true }));
  });
});
