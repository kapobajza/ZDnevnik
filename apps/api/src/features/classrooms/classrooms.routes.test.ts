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
} from "~/api/test/util";
import { generateSecureString, securelyHashString } from "~/api/util/secure";

describe("clasrooms routes", () => {
  let fastify: FastifyInstance;
  let classroomsModel: ModelORM<typeof ClassroomModel>;
  let usersModel: ModelORM<typeof UserModel>;
  let userClassroomModel: ModelORM<typeof UserClasroomModel>;
  const VALID_PASSWORD = "testtesttest";

  // const addStudentAsTeacher = async (classroomId: string, username: string) => {
  //   const response = await doAuthenticatedRequest(fastify, {
  //     method: "POST",
  //     url: `/classrooms/${classroomId}/students`,
  //     username,
  //     password: VALID_PASSWORD,
  //     body: {
  //       firstName: "test",
  //       lastName: "test",
  //     } satisfies AddStudentBody,
  //   });

  //   const res: UsersDefaultDTO = response.json();

  //   return {
  //     data: res,
  //     response,
  //   };
  // };

  beforeAll(async () => {
    fastify = await buildTestApp();
    classroomsModel = new ModelORM(
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
    await classroomsModel.delete().execute();
  });

  it("should return 403 if a student tries to access list of classroom students", async () => {
    const password = "testtesttest";
    const salt = generateSecureString();
    const hashedPassword = securelyHashString(password, salt);

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
    const classroom = await insertMockClassroom(classroomsModel);
    const teacher = await insertMockTeacher(usersModel, VALID_PASSWORD);
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

  // it("should return 200 when teacher tries to add student", async () => {
  //   const classroom = await insertClassroom();
  //   const teacher = await insertTeacher();

  //   await userClassroomModel
  //     .insert([
  //       ["ClassroomId", classroom.id],
  //       ["UserId", teacher.id],
  //       ["Id", "1"],
  //       ["IsTeacher", true],
  //     ])
  //     .execute();

  //   const { data, response } = await addStudentAsTeacher(
  //     classroom.id,
  //     teacher.username,
  //   );
  //   const addedStudent = await usersModel
  //     .select(usersDefaultSelect)
  //     .where({
  //       field: UserModel.fields.Id,
  //       operator: "=",
  //       value: data.id,
  //     })
  //     .executeOne();

  //   expect(response.statusCode).toBe(200);
  //   expect(data).toEqual(addedStudent);
  // });

  // it("should increment ordinal_number when adding student automatically", async () => {
  //   const classroom = await insertClassroom();
  //   const teacher = await insertTeacher();

  //   await userClassroomModel
  //     .insert([
  //       ["ClassroomId", classroom.id],
  //       ["UserId", teacher.id],
  //       ["Id", "1"],
  //       ["IsTeacher", true],
  //     ])
  //     .execute();

  //   const { data: studentFirst } = await addStudentAsTeacher(
  //     classroom.id,
  //     teacher.username,
  //   );

  //   const { data: studentSecond } = await addStudentAsTeacher(
  //     classroom.id,
  //     teacher.username,
  //   );

  //   expect(studentFirst.ordinalNumber).toBe(1);
  //   expect(studentSecond.ordinalNumber).toBe(2);
  // });

  it("should return all classrooms for a teacher", async () => {
    const classroom = await insertMockClassroom(classroomsModel);
    const teacher = await insertMockTeacher(usersModel, VALID_PASSWORD);

    await userClassroomModel
      .insert([
        ["ClassroomId", classroom.id],
        ["UserId", teacher.id],
        ["Id", "1"],
        ["IsTeacher", true],
      ])
      .execute();

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
