import type {
  ClasroomStudentsDTO,
  PaginationQueryParam,
} from "@zdnevnik/toolkit";

export type Service = {
  classroom: {
    getStudents(
      userId: string,
      classroomId: string | undefined,
      paginationParams: PaginationQueryParam,
    ): Promise<ClasroomStudentsDTO>;
  };
};
