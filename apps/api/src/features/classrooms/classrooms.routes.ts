import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  ClassroomModel,
  UserClasroomModel,
  paginationQueryParamSchema,
  classroomStudentsDTOSchema,
  getTeacherClasroomsDTOSchema,
} from "@zdnevnik/toolkit";
import invariant from "tiny-invariant";

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
      preHandler: fastify.verifyTeacherHasAccessToClass(),
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

  done();
}
