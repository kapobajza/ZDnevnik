import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  ClassroomModel,
  UserClasroomModel,
  UserModel,
  UserRole,
  paginationQueryParamSchema,
  classroomStudentsDTOSchema,
  addStudentBodySchema,
  usersDefaultSelectSchema,
  getTeacherClasroomsDTOSchema,
} from "@zdnevnik/toolkit";
import invariant from "tiny-invariant";

import { generatePasswordSalt, hashPassword } from "~/api/features/auth/util";
import { generateUdid } from "~/api/util/udid";
import { createInternalServerErrorReply } from "~/api/error/replies";
import { idParamSchema } from "~/api/types/validation.types";
import { createModelORM } from "~/api/db/util";

export default function clasrooms(
  fastify: FastifyInstance,
  _opts: unknown,
  done: () => void,
) {
  fastify.withTypeProvider<ZodTypeProvider>().get(
    "",
    {
      schema: {
        querystring: paginationQueryParamSchema,
        response: {
          200: getTeacherClasroomsDTOSchema,
        },
      },
      preHandler: fastify.verifyTeacherFromSession,
    },
    async (request, reply) => {
      invariant(request.session.user, "User from session not found");
      const userClasroomModel = createModelORM(UserClasroomModel, fastify);

      const res = await userClasroomModel
        .select({
          id: ClassroomModel.fields.Id,
          name: ClassroomModel.fields.Name,
        })
        .join({
          on: {
            field: UserClasroomModel.fields.ClassroomId,
            other: ClassroomModel.fields.Id,
          },
          table: ClassroomModel,
        })
        .where({
          field: UserClasroomModel.fields.UserId,
          operator: "=",
          value: request.session.user.id,
        })
        .sort({
          by: [UserClasroomModel.fields.CreatedAt],
          order: "DESC",
        })
        .limit(request.query.limit)
        .offset((request.query.page - 1) * request.query.limit)
        .execute();

      return reply.send(res);
    },
  );

  fastify.withTypeProvider<ZodTypeProvider>().get(
    "/students",
    {
      schema: {
        querystring: paginationQueryParamSchema,
        response: {
          200: classroomStudentsDTOSchema,
        },
      },
      preHandler: fastify.verifyTeacherFromSession,
    },
    async (request, reply) => {
      invariant(request.session.user, "User from session not found");
      const response = await fastify.service.classroom.getStudents(
        request.session.user.id,
        undefined,
        request.query,
      );

      return reply.send(response);
    },
  );

  fastify.withTypeProvider<ZodTypeProvider>().get(
    "/:id/students",
    {
      schema: {
        querystring: paginationQueryParamSchema,
        params: idParamSchema,
        response: {
          200: classroomStudentsDTOSchema,
        },
      },
      preHandler: fastify.verifyTeacherHasAccessToClass,
    },
    async (request, reply) => {
      invariant(request.session.user, "User from session not found");
      const response = await fastify.service.classroom.getStudents(
        request.session.user.id,
        request.params.id,
        request.query,
      );

      return reply.send(response);
    },
  );

  fastify.withTypeProvider<ZodTypeProvider>().post(
    "/:id/students",
    {
      schema: {
        body: addStudentBodySchema,
        params: idParamSchema,
        response: {
          200: usersDefaultSelectSchema,
        },
      },
      preHandler: fastify.verifyTeacherHasAccessToClass,
    },
    async (request, reply) => {
      const { firstName, lastName, avatarUrl } = request.body;
      const env = fastify.getEnvs();
      const userClasroomModel = createModelORM(UserClasroomModel, fastify);
      const userModel = createModelORM(UserModel, fastify);

      const passwordSalt = generatePasswordSalt();
      const passwordHash = hashPassword(
        env.DEFAULT_USER_PASSWORD,
        passwordSalt,
      );
      const username = `${firstName.toLowerCase()}.${lastName.slice(0, 1).toLowerCase()}-${Math.floor(Math.random() * 1000)}`;
      const latestStudent = await userModel
        .select({
          ordinalNumber: UserModel.fields.OrdinalNumber,
        })
        .join({
          on: {
            field: UserModel.fields.Id,
            other: UserClasroomModel.fields.UserId,
          },
          table: UserClasroomModel,
        })
        .where({
          field: UserClasroomModel.fields.ClassroomId,
          operator: "=",
          value: request.params.id,
        })
        .and({
          field: UserModel.fields.Role,
          operator: "=",
          value: UserRole.Student,
        })
        .sort({
          by: [UserModel.fields.OrdinalNumber],
          order: "DESC",
        })
        .executeOne();

      const { ordinalNumber = 0 } = latestStudent ?? {};

      const user = await userModel
        .insert([
          ["FirstName", firstName],
          ["LastName", lastName],
          ["OrdinalNumber", ordinalNumber + 1],
          ["Role", UserRole.Student],
          ["AverageGrade", 0.0],
          ["Avatar", avatarUrl],
          ["PasswordHash", passwordHash],
          ["PasswordSalt", passwordSalt],
          ["Id", generateUdid()],
          ["Username", username],
        ])
        .executeOne();

      if (!user) {
        console.error("User not created");
        return createInternalServerErrorReply(reply);
      }

      await userClasroomModel
        .insert([
          ["ClassroomId", request.params.id],
          ["UserId", user.id],
          ["Id", generateUdid()],
          ["IsTeacher", false],
        ])
        .executeOne();

      return reply.send({
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        ordinalNumber: user.ordinal_number,
        role: user.role,
        username: user.username,
        avatar: user.avatar,
        averageGrade: user.average_grade,
      });
    },
  );

  done();
}
