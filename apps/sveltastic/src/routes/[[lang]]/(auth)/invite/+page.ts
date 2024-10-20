import type { PageLoad } from "./$types";

import { setLocale } from "$src/i18n/i18n-svelte";
import { loadNamespaceAsync } from "$src/i18n/i18n-util.async";

export const load: PageLoad = async ({ parent, data }) => {
  const { locale } = await parent();
  await loadNamespaceAsync(locale, "invite");
  setLocale(locale);

  return { form: data.form };
};
