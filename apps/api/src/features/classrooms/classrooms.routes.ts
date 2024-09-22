import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  ClassroomModel,
  UserClasroomModel,
  UserModel,
  UserRole,
  teacherStudentsSelect,
  paginationQueryParamSchema,
  type ClasroomStudentsDTO,
  classroomStudentsDTOSchema,
  addStudentSchema,
  usersDefaultSelectSchema,
} from "@zdnevnik/toolkit";
import invariant from "tiny-invariant";

import { ModelORM } from "~/api/db/orm";
import { generatePasswordSalt, hashPassword } from "~/api/features/auth/util";
import { generateUdid } from "~/api/util/udid";
import { createInternalServerErrorReply } from "~/api/error/replies";
import { idParamSchema } from "~/api/types/validation.types";

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
        response: {
          200: classroomStudentsDTOSchema,
        },
      },
      preHandler: fastify.verifyTeacherFromSession,
    },
    async (request, reply) => {
      invariant(request.session.user, "User from session not found");

      const teacherClasroom = await userClasroomModel
        .select({
          clasroomId: UserClasroomModel.fields.ClassroomId,
          clasroomName: ClassroomModel.fields.Name,
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
        .executeOne();

      if (!teacherClasroom) {
        return reply.send({
          students: [],
          classroom: {},
        });
      }

      const students = await userModel
        .select(teacherStudentsSelect)
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

      return reply.send({
        classroom: {
          name: teacherClasroom.clasroomName,
          id: teacherClasroom.clasroomId,
        },
        students,
      } satisfies ClasroomStudentsDTO);
    },
  );

  fastify.withTypeProvider<ZodTypeProvider>().post(
    "/:id/students",
    {
      schema: {
        body: addStudentSchema,
        params: idParamSchema,
        response: {
          200: usersDefaultSelectSchema,
        },
      },
      preHandler: fastify.verifyTeacherHasAccessToClass,
    },
    async (request, reply) => {
      const { firstName, lastName, ordinalNumber, avatarUrl } = request.body;
      const env = fastify.getEnvs();

      const passwordSalt = generatePasswordSalt();
      const passwordHash = hashPassword(
        env.DEFAULT_USER_PASSWORD,
        passwordSalt,
      );
      const username = `${firstName.toLowerCase()}.${lastName.slice(0, 1).toLowerCase()}-${Math.floor(Math.random() * 1000)}`;

      const user = await userModel
        .insert([
          ["FirstName", firstName],
          ["LastName", lastName],
          ["OrdinalNumber", ordinalNumber],
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
