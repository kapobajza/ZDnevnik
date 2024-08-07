import type { PageLoad } from "./$types";

import { studentsQueryOptions, meQueryOptions } from "$lib/query";

export const load: PageLoad = async ({ parent, fetch }) => {
  const { queryClient } = await parent();

  await queryClient.prefetchQuery({
    ...meQueryOptions(fetch),
    staleTime: Infinity,
  });
  await queryClient.prefetchInfiniteQuery(studentsQueryOptions(fetch));
};
