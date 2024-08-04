import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { paginationQueryParamSchema } from "@zdnevnik/toolkit";
import invariant from "tiny-invariant";

import { UserClasroomModel } from "~/api/db/models";
import { ModelORM } from "~/api/db/orm";
import { UserModel } from "~/api/features/users/users.model";
import { UserRole } from "~/api/features/users/user.types";

export default function clasrooms(
  fastify: FastifyInstance,
  _opts: unknown,
  done: () => void,
) {
  const userModel = new ModelORM(
    UserModel,
    fastify.dbPool,
    fastify.mappedTable,
  );
  const userClasroomModel = new ModelORM(
    UserClasroomModel,
    fastify.dbPool,
    fastify.mappedTable,
  );

  fastify.withTypeProvider<ZodTypeProvider>().get(
    "/students",
    {
      schema: {
        querystring: paginationQueryParamSchema,
      },
      preHandler: fastify.auth(
        [fastify.verifyUserFromSession, fastify.verifyTeacherFromSession],
        {
          relation: "and",
        },
      ),
    },
    async (request, reply) => {
      invariant(request.session.user, "User from session not found");

      const teacherClasroom = await userClasroomModel
        .select({
          clasroomId: UserClasroomModel.fields.ClassroomId,
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
        .limit(1)
        .executeOne();

      if (!teacherClasroom) {
        return reply.send([]);
      }

      const students = await userModel
        .select({
          id: UserModel.fields.Id,
          firstName: UserModel.fields.FirstName,
          lastName: UserModel.fields.LastName,
          avatar: UserModel.fields.Avatar,
          ordinalNumber: UserModel.fields.OrdinalNumber,
          averageGrade: UserModel.fields.AverageGrade,
        })
        .join({
          table: UserClasroomModel,
          on: {
            field: UserModel.fields.Id,
            other: UserClasroomModel.fields.UserId,
          },
        })
        .where({
          field: UserClasroomModel.fields.ClassroomId,
          operator: "=",
          value: teacherClasroom?.clasroomId,
        })
        .and({
          field: UserModel.fields.Role,
          operator: "=",
          value: UserRole.Student,
        })
        .limit(request.query.limit)
        .offset((request.query.page - 1) * request.query.limit)
        .execute();

      return reply.send(students);
    },
  );

  done();
}
