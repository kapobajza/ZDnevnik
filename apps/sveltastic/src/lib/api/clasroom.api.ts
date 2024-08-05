import type {
  ClasroomStudentsDTO,
  PaginationQueryParam,
} from "@zdnevnik/toolkit";

import { createApi } from "./api";

export const createClassroomApi = (fetchFn: typeof fetch) => {
  const classroomApi = createApi({
    fetchFn,
    routePrefix: "classrooms",
  });

  return {
    students: async (params: PaginationQueryParam) => {
      const { data } = await classroomApi.get<ClasroomStudentsDTO[]>(
        "students",
        {
          queryParams: params,
        },
      );
      return data;
    },
  };
};

export type ClassroomApi = ReturnType<typeof createClassroomApi>;
