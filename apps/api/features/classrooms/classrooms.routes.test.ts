import type { FastifyInstance } from "fastify";
import { describe, beforeAll, expect, it, afterEach, afterAll } from "vitest";
import invariant from "tiny-invariant";
import type { InferModelFields } from "@zdnevnik/toolkit";
import {
  UserModel,
  ClassroomModel,
  UserClasroomModel,
  UserRole,
} from "@zdnevnik/toolkit";

import { ModelORM } from "~/api/db/orm";
import { HttpErrorCode, type HttpError } from "~/api/error/types";
import { buildTestApp } from "~/api/test/util";
import { generatePasswordSalt, hashPassword } from "~/api/features/auth/util";

describe("clasrooms routes", () => {
  let fastify: FastifyInstance;
  let clasroomsModel: ModelORM<typeof ClassroomModel>;
  let usersModel: ModelORM<typeof UserModel>;
  let userClassroomModel: ModelORM<typeof UserClasroomModel>;
  const VALID_PASSWORD = "testtesttest";

  const insertTeacher = async () => {
    const password = VALID_PASSWORD;
    const salt = generatePasswordSalt();
    const hashedPassword = hashPassword(password, salt);

    return usersModel
      .insert([
        ["Id", "1"],
        ["Username", "test"],
        ["PasswordHash", hashedPassword],
        ["PasswordSalt", salt],
        ["Role", UserRole.Teacher],
      ])
      .executeOne<InferModelFields<typeof UserModel>>();
  };

  beforeAll(async () => {
    fastify = await buildTestApp();
    clasroomsModel = new ModelORM(
      ClassroomModel,
      fastify.dbPool,
      fastify.mappedTable,
    );
    usersModel = new ModelORM(UserModel, fastify.dbPool, fastify.mappedTable);
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
    await usersModel.delete().execute();
    await clasroomsModel.delete().execute();
  });

  it("should return 403 if a student tries to access list of classroom students", async () => {
    const password = "testtesttest";
    const salt = generatePasswordSalt();
    const hashedPassword = hashPassword(password, salt);

    const student = await usersModel
      .insert([
        ["Id", "1"],
        ["Username", "test"],
        ["Role", UserRole.Student],
        ["PasswordHash", hashedPassword],
        ["PasswordSalt", salt],
      ])
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
      url: `/classrooms/students`,
      headers: {
        cookie: authResponse.headers["set-cookie"],
      },
    });

    expect(response.statusCode).toBe(403);
    const error: HttpError = {
      code: HttpErrorCode.Forbidden,
      message: "forbidden",
      statusCode: 403,
    };
    expect(response.json()).toEqual(error);
  });

  it("should return 200 if a teacher tries to access list of classroom students", async () => {
    const classroom = await clasroomsModel
      .insert([
        ["Id", "1"],
        ["Name", "classroom"],
      ])
      .executeOne<ClassroomModel>();

    invariant(classroom, "Classroom not created");

    const teacher = await insertTeacher();

    invariant(teacher, "Teacher not created");

    const student = await usersModel
      .insert([
        ["Id", "2"],
        ["Username", "student"],
        ["FirstName", "Student"],
        ["LastName", "Last"],
        ["OrdinalNumber", 1],
        ["Role", UserRole.Student],
        ["AverageGrade", 0.0],
        ["PasswordHash", "test"],
        ["PasswordSalt", "test"],
      ])
      .executeOne<UserModel>();

    invariant(student, "Student not created");

    await userClassroomModel.transaction(async (tx) => {
      await tx
        .insert([
          ["Id", "1"],
          ["UserId", teacher.id],
          ["ClassroomId", classroom.id],
        ])
        .execute();
      await tx
        .insert([
          ["Id", "2"],
          ["UserId", student.id],
          ["ClassroomId", classroom.id],
        ])
        .execute();
    });

    const authResponse = await fastify.inject({
      method: "POST",
      url: "/auth/login",
      payload: {
        username: teacher.username,
        password: VALID_PASSWORD,
      },
    });

    const response = await fastify.inject({
      method: "GET",
      url: `/classrooms/students`,
      headers: {
        cookie: authResponse.headers["set-cookie"],
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      classroom: {
        id: "1",
        name: "classroom",
      },
      students: [
        {
          avatar: null,
          averageGrade: 0,
          firstName: "Student",
          id: "2",
          lastName: "Last",
          ordinalNumber: 1,
        },
      ],
    });
  });
});
