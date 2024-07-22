import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { paginationQueryParamSchema } from "@zdnevnik/toolkit";

import { UserClasroomModel } from "~/api/db/models";
import { ModelORM } from "~/api/db/orm";
import { idParamSchema } from "~/api/types/validation.types";
import { UserModel } from "~/api/features/users/users.model";
import { UserRole } from "~/api/features/users/user.types";

export const autoPrefix = "/clasrooms/:id/students";

export default function clasroomStudents(
  fastify: FastifyInstance,
  _opts: unknown,
  done: () => void,
) {
  const userModel = new ModelORM(
    UserModel,
    fastify.dbPool,
    fastify.mappedTable,
  );

  fastify.withTypeProvider<ZodTypeProvider>().get(
    "",
    {
      schema: {
        params: idParamSchema,
        querystring: paginationQueryParamSchema,
      },
      preHandler: fastify.auth(
        [fastify.verifyUserFromSession, fastify.verifyTeacherHasAccessToClass],
        {
          relation: "and",
        },
      ),
    },
    async (request, reply) => {
      const students = await userModel
        .select({
          id: UserModel.fields.Id,
          firstName: UserModel.fields.FirstName,
          lastName: UserModel.fields.LastName,
          avatar: UserModel.fields.Avatar,
          ordinalNumber: UserModel.fields.OrdinalNumber,
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
        .limit(request.query.limit)
        .offset((request.query.page - 1) * request.query.limit)
        .join({
          table: UserClasroomModel,
          on: {
            field: UserModel.fields.Id,
            other: UserClasroomModel.fields.UserId,
          },
        })
        .execute();

      return reply.send(students);
    },
  );

  done();
}
