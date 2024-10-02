import {
  ClassroomModel,
  UserClasroomModel,
  UserModel,
  UserRole,
  teacherStudentsSelect,
  type ClasroomStudentsDTO,
  type PaginationQueryParam,
} from "@zdnevnik/toolkit";
import fp from "fastify-plugin";

import { createModelORM } from "~/api/db/util";
import { FastifyCustomProp } from "~/api/types";

export type ClassroomService = {
  getStudents(
    userId: string,
    classroomId: string | undefined,
    paginationParams: PaginationQueryParam,
  ): Promise<ClasroomStudentsDTO>;
};

export default fp((fastify, _opts, done) => {
  const classroomService: ClassroomService = {
    async getStudents(userId, classroomId, paginationParams) {
      const userClasroomModel = createModelORM(UserClasroomModel, fastify);
      const userModel = createModelORM(UserModel, fastify);
      const classroomModel = createModelORM(ClassroomModel, fastify);

      const studentsQueryBuilder = userModel
        .select(teacherStudentsSelect)
        .join({
          table: UserClasroomModel,
          on: {
            field: UserModel.fields.Id,
            other: UserClasroomModel.fields.UserId,
          },
        })
        .where({
          field: UserModel.fields.Role,
          operator: "=",
          value: UserRole.Student,
        });

      let classroom: ClasroomStudentsDTO["classroom"];

      if (classroomId) {
        studentsQueryBuilder.and({
          field: UserClasroomModel.fields.ClassroomId,
          operator: "=",
          value: classroomId,
        });

        const res = await classroomModel
          .select({
            id: ClassroomModel.fields.Id,
            name: ClassroomModel.fields.Name,
          })
          .where({
            field: ClassroomModel.fields.Id,
            operator: "=",
            value: classroomId,
          })
          .executeOne();

        if (!res) {
          return {
            students: [],
            classroom: {},
          };
        }

        classroom = res;
      } else {
        const teacherClasroom = await userClasroomModel
          .select({
            id: UserClasroomModel.fields.ClassroomId,
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
            value: userId,
          })
          .sort({
            by: [UserClasroomModel.fields.CreatedAt],
            order: "DESC",
          })
          .executeOne();

        if (!teacherClasroom) {
          return {
            students: [],
            classroom: {},
          };
        }

        studentsQueryBuilder.and({
          field: UserClasroomModel.fields.ClassroomId,
          operator: "=",
          value: teacherClasroom.id,
        });

        classroom = teacherClasroom;
      }

      const students = await studentsQueryBuilder
        .limit(paginationParams.limit)
        .offset((paginationParams.page - 1) * paginationParams.limit)
        .execute();

      return {
        students,
        classroom,
      };
    },
  };

  fastify.decorate(FastifyCustomProp.Service, {
    ...fastify.service,
    classroom: classroomService,
  });

  done();
});
