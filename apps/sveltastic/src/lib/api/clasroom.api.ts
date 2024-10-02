import type { AddStudentBody, GetTeacherClasroomsDTO } from "@zdnevnik/toolkit";
import {
  type ClasroomStudentsDTO,
  type PaginationQueryParam,
  type TeacherStudentsDTO,
} from "@zdnevnik/toolkit";

import type { CreateInstanceOptions } from "./api";
import { createApi } from "./api";

import type { InfiniteQueryFnData } from "$lib/query";

export const createClassroomApi = (options: CreateInstanceOptions) => {
  const classroomApi = createApi({
    ...options,
    routePrefix: "classrooms",
  });

  return {
    students: async (
      params: PaginationQueryParam & {
        classroomId?: string | undefined;
      },
    ): Promise<
      InfiniteQueryFnData<
        TeacherStudentsDTO[],
        ClasroomStudentsDTO["classroom"]
      >
    > => {
      const { classroomId, ...queryParams } = params;
      const { data } = await classroomApi.get<ClasroomStudentsDTO>(
        `${classroomId ? `${classroomId}/students` : "students"}`,
        {
          queryParams,
        },
      );

      return {
        results: data.students,
        extraData: data.classroom,
      };
    },
    all: async (
      params: PaginationQueryParam,
    ): Promise<InfiniteQueryFnData<GetTeacherClasroomsDTO>> => {
      const { data } = await classroomApi.get<GetTeacherClasroomsDTO>("", {
        queryParams: params,
      });

      return {
        results: data,
      };
    },
    addStudent(classroomId: string, body: AddStudentBody) {
      return classroomApi.post(`${classroomId}/students`, body);
    },
  };
};

export type ClassroomApi = ReturnType<typeof createClassroomApi>;
