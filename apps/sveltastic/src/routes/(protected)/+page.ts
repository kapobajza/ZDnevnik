import type { PageLoad } from "./$types";

import { studentsQueryOptions, meQueryOptions } from "$lib/query";
import { loadNamespaceAsync } from "$src/i18n/i18n-util.async";
import { setLocale } from "$src/i18n/i18n-svelte";

export const load: PageLoad = async ({ parent, fetch, data }) => {
  const { queryClient, locale } = await parent();

  await loadNamespaceAsync(locale, "home");
  setLocale(locale);

  await queryClient.prefetchQuery({
    ...meQueryOptions(fetch),
    staleTime: Infinity,
  });
  await queryClient.prefetchInfiniteQuery(studentsQueryOptions(fetch));

  return { form: data.form };
};
