import type { PageLoad } from "./$types";

import {
  clasroomQueryKey,
  defaultInfiniteQueryOptions,
  meQueryOptions,
} from "$lib/query";
import { loadNamespaceAsync } from "$src/i18n/i18n-util.async";
import { setLocale } from "$src/i18n/i18n-svelte";
import { api } from "$lib/api";

export const load: PageLoad = async ({ parent, fetch, data }) => {
  const { queryClient, locale } = await parent();

  await loadNamespaceAsync(locale, "home");
  setLocale(locale);

  await queryClient.prefetchQuery({
    ...meQueryOptions(fetch),
    staleTime: Infinity,
  });
  await queryClient.prefetchInfiniteQuery({
    queryKey: clasroomQueryKey.teacherStudents(),
    queryFn: ({ limit, page }) =>
      api({ fetch }).clasroom.students({
        page,
        limit,
      }),
    ...defaultInfiniteQueryOptions,
  });

  return { form: data.form };
};
