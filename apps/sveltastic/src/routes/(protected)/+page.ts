import type { PageLoad } from "./$types";

import { clasroomQuery } from "$lib/query";
import { api } from "$lib/api";

export const load: PageLoad = async ({ parent, fetch }) => {
  const { queryClient } = await parent();

  await queryClient.prefetchQuery({
    queryKey: clasroomQuery.teacherStudents,
    queryFn: () =>
      api(fetch).clasroom.students({
        page: 1,
        limit: 10,
      }),
  });
};
