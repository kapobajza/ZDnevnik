import type { FastifyInstance } from "fastify";
import { describe, beforeAll, expect, it, afterEach, afterAll } from "vitest";
import invariant from "tiny-invariant";
import type { GetTeacherClasroomsDTO } from "@zdnevnik/toolkit";
import {
  UserModel,
  ClassroomModel,
  UserClasroomModel,
  UserRole,
} from "@zdnevnik/toolkit";

import { ModelORM } from "~/api/db/orm";
import { HttpErrorCode, type HttpError } from "~/api/error/types";
import {
  buildTestApp,
  doAuthenticatedRequest,
  insertMockClassroom,
  insertMockTeacher,
  insertMockTeacherIntoClassroom,
} from "~/api/test/util";
import { generateSecureString, securelyHashString } from "~/api/util/secure";

describe("clasrooms routes", () => {
  let fastify: FastifyInstance;
  let classroomModel: ModelORM<typeof ClassroomModel>;
  let userModel: ModelORM<typeof UserModel>;
  let userClassroomModel: ModelORM<typeof UserClasroomModel>;
  const VALID_PASSWORD = "testtesttest";

  beforeAll(async () => {
    fastify = await buildTestApp();
    classroomModel = new ModelORM(
      ClassroomModel,
      fastify.dbPool,
      fastify.mappedTable,
    );
    userModel = new ModelORM(UserModel, fastify.dbPool, fastify.mappedTable);
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
    await classroomModel.delete().execute();
  });

  it("should return 403 if a student tries to access list of classroom students", async () => {
    const password = "testtesttest";
    const salt = generateSecureString();
    const hashedPassword = securelyHashString(password, salt);

    const student = await userModel
      .insert(
        [
          ["Id", "1"],
          ["Username", "test"],
          ["Role", UserRole.Student],
          ["PasswordHash", hashedPassword],
          ["PasswordSalt", salt],
        ],
        {
          returningFields: "*",
        },
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
    const classroom = await insertMockClassroom(classroomModel);
    const teacher = await insertMockTeacher(userModel, VALID_PASSWORD);
    const student = await userModel
      .insert(
        [
          ["Id", "2"],
          ["Username", "student"],
          ["FirstName", "Student"],
          ["LastName", "Last"],
          ["OrdinalNumber", 1],
          ["Role", UserRole.Student],
          ["AverageGrade", 0.0],
          ["PasswordHash", "test"],
          ["PasswordSalt", "test"],
        ],
        {
          returningFields: "*",
        },
      )
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

    const response = await doAuthenticatedRequest(fastify, {
      method: "GET",
      url: "/classrooms/students",
      username: teacher.username,
      password: VALID_PASSWORD,
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      classroom: {
        id: classroom.id,
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

  it("should return all classrooms for a teacher", async () => {
    const { teacher, classroom } = await insertMockTeacherIntoClassroom({
      classroomModel,
      userModel,
      userClassroomModel,
      password: VALID_PASSWORD,
    });

    const response = await doAuthenticatedRequest(fastify, {
      method: "GET",
      url: "/classrooms",
      username: teacher.username,
      password: VALID_PASSWORD,
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual([
      {
        id: classroom.id,
        name: classroom.name,
      },
    ] satisfies GetTeacherClasroomsDTO);
  });
});
