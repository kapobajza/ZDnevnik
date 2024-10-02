import { createInfiniteQuery } from "./util";

import { api } from "$lib/api";
import type { SelectListItem } from "$lib/components/ui/Select";

const CLASROOM_PREFIX = "clasroom";

export const clasroomQueryKey = {
  teacherStudents: (classroomId: string | undefined = undefined) => [
    CLASROOM_PREFIX,
    "teacher",
    "students",
    { classroomId },
  ],
  teacherClassrooms: [CLASROOM_PREFIX, "teacher", "classrooms"],
} as const;

export const createClassroomSelectInfiniteQuery = () =>
  createInfiniteQuery({
    queryFn: ({ limit, page }) => api().clasroom.all({ page, limit }),
    queryKey: clasroomQueryKey.teacherClassrooms,
    select(data) {
      return {
        ...data,
        pages: data.pages.map((page) => ({
          ...page,
          results: page.results.map(
            (classroom) =>
              ({
                id: classroom.id,
                label: classroom.name,
                value: classroom.id,
              }) satisfies SelectListItem,
          ),
        })),
      };
    },
  });
