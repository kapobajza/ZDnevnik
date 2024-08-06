import {
  defaultInfiniteQueryOptions,
  type CreateInfiniteQueryOptions,
} from "./util";

import { api } from "$lib/api";

const CLASROOM_PREFIX = "clasroom";

export const clasroomQuery = {
  teacherStudents: [CLASROOM_PREFIX, "teacher", "students"],
} as const;

export const studentsQueryOptions = (fetchFn: typeof fetch = fetch) =>
  ({
    queryKey: clasroomQuery.teacherStudents,
    queryFn: ({ limit, page }) =>
      api(fetchFn).clasroom.students({
        page,
        limit,
      }),
    ...defaultInfiniteQueryOptions,
  }) satisfies CreateInfiniteQueryOptions;
