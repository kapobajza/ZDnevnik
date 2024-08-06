import type { PageLoad } from "./$types";

import { studentsQueryOptions } from "$lib/query";

export const load: PageLoad = async ({ parent, fetch }) => {
  const { queryClient } = await parent();

  await queryClient.prefetchInfiniteQuery(studentsQueryOptions(fetch));
};
