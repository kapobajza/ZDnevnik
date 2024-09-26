import {
  defaultInfiniteQueryOptions,
  type CreateInfiniteQueryOptions,
} from "./util";

import { api } from "$lib/api";

const CLASROOM_PREFIX = "clasroom";

export const clasroomQueryKey = {
  teacherStudents: [CLASROOM_PREFIX, "teacher", "students"],
  teacherClassrooms: [CLASROOM_PREFIX, "teacher", "classrooms"],
} as const;

export const studentsQueryOptions = (fetchFn: typeof fetch = fetch) =>
  ({
    queryKey: clasroomQueryKey.teacherStudents,
    queryFn: ({ limit, page }) =>
      api(fetchFn).clasroom.students({
        page,
        limit,
      }),
    ...defaultInfiniteQueryOptions,
  }) satisfies CreateInfiniteQueryOptions;
