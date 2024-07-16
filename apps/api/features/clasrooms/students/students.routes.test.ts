import type { FastifyInstance } from "fastify";
import invariant from "tiny-invariant";

import { ModelORM } from "~/api/db/orm";
import { HttpErrorCode, type HttpError } from "~/api/error/types";
import { buildTestApp } from "~/api/test/util";
import { UserRole } from "~/api/features/users/user.types";
import { generatePasswordSalt, hashPassword } from "~/api/features/auth/util";
import { UserModel } from "~/api/features/users/users.model";
import { ClassroomModel } from "~/api/features/clasrooms/classrooms.model";
import { UserClasroomModel } from "~/api/db/models";

describe("students routes", () => {
  let fastify: FastifyInstance;
  let clasroomsModel: ModelORM<typeof ClassroomModel>;
  let usersModel: ModelORM<typeof UserModel>;
  let userClassroomModel: ModelORM<typeof UserClasroomModel>;

  beforeAll(async () => {
    fastify = await buildTestApp();
    clasroomsModel = new ModelORM(ClassroomModel, fastify.dbPool);
    usersModel = new ModelORM(UserModel, fastify.dbPool);
    userClassroomModel = new ModelORM(UserClasroomModel, fastify.dbPool);
  });

  afterAll(async () => {
    await fastify.close();
  });

  afterEach(async () => {
    await usersModel.delete().execute();
  });

  it("should return unauthorized if not logged in", async () => {
    const response = await fastify.inject({
      method: "GET",
      url: "/clasrooms/sadsadsa/students",
    });

    expect(response.statusCode).toBe(401);
    const error: HttpError = {
      code: HttpErrorCode.Unathorized,
      message: "Unauthorized",
      statusCode: 401,
    };
    expect(response.json()).toEqual(error);
  });

  it("should return 403 if a student tries to access list of classroom students", async () => {
    const password = "testtesttest";
    const salt = generatePasswordSalt();
    const hashedPassword = hashPassword(password, salt);

    const student = await usersModel
      .insert(
        ["id", "username", "role", "password_hash", "password_salt"],
        ["1", "test", UserRole.Student, hashedPassword, salt],
      )
      .executeOne<UserModel>();

    if (!student) {
      throw new Error("Student not created");
    }

    const authResponse = await fastify.inject({
      method: "POST",
      url: "/auth/login",
      payload: {
        username: student.username,
        password,
      },
    });

    const response = await fastify.inject({
      method: "GET",
      url: `/clasrooms/123123/students`,
      headers: {
        cookie: authResponse.headers["set-cookie"],
      },
    });

    expect(response.statusCode).toBe(403);
    const error: HttpError = {
      code: HttpErrorCode.Forbidden,
      message: "Forbidden",
      statusCode: 403,
    };
    expect(response.json()).toEqual(error);
  });

  it("should return 200 if a teacher tries to access list of classroom students", async () => {
    const password = "testtesttest";
    const salt = generatePasswordSalt();
    const hashedPassword = hashPassword(password, salt);

    const classroom = await clasroomsModel
      .insert(["id", "name"], ["1", "classroom"])
      .executeOne<ClassroomModel>();

    invariant(classroom, "Classroom not created");

    const teacher = await usersModel
      .insert(
        ["id", "username", "role", "password_hash", "password_salt"],
        ["1", "teacher", UserRole.Teacher, hashedPassword, salt],
      )
      .executeOne<UserModel>();

    invariant(teacher, "Teacher not created");

    const student = await usersModel
      .insert(["id", "username", "role"], ["2", "student", UserRole.Student])
      .executeOne<UserModel>();

    invariant(student, "Student not created");

    await userClassroomModel.transaction(async (tx) => {
      await tx
        .insert(["user_id", "classroom_id"], [teacher.id, classroom.id])
        .execute();
      await tx
        .insert(["user_id", "classroom_id"], [student.id, classroom.id])
        .execute();
    });

    const authResponse = await fastify.inject({
      method: "POST",
      url: "/auth/login",
      payload: {
        username: teacher.username,
        password,
      },
    });

    const response = await fastify.inject({
      method: "GET",
      url: `/clasrooms/${classroom.id}/students`,
      headers: {
        cookie: authResponse.headers["set-cookie"],
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual([student]);
  });
});
