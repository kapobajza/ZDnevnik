import type { GetTeacherClasroomsDTO } from "@zdnevnik/toolkit";
import {
  type ClasroomStudentsDTO,
  type PaginationQueryParam,
  type TeacherStudentsDTO,
} from "@zdnevnik/toolkit";

import { createApi } from "./api";

import type { InfiniteQueryFnData } from "$lib/query";

export const createClassroomApi = (fetchFn: typeof fetch) => {
  const classroomApi = createApi({
    fetchFn,
    routePrefix: "classrooms",
  });

  return {
    students: async (
      params: PaginationQueryParam,
    ): Promise<
      InfiniteQueryFnData<
        TeacherStudentsDTO[],
        ClasroomStudentsDTO["classroom"]
      >
    > => {
      const { data } = await classroomApi.get<ClasroomStudentsDTO>("students", {
        queryParams: params,
      });

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
  };
};

export type ClassroomApi = ReturnType<typeof createClassroomApi>;
