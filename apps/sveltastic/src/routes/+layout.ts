import { QueryClient } from "@tanstack/svelte-query";

import type { LayoutLoad } from "./$types";

import { loadLocaleAsync } from "$src/i18n/i18n-util.async";
import { setLocale } from "$src/i18n/i18n-svelte";
import { browser } from "$app/environment";

export const load: LayoutLoad = async (event) => {
  const locale = event.data.locale;
  await loadLocaleAsync(locale);
  setLocale(locale);

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        enabled: browser,
        staleTime: 60 * 1000,
      },
    },
  });

  return {
    ...event.data,
    queryClient,
  };
};
