import { redirect } from "@sveltejs/kit";

import type { Locales } from "$src/i18n/i18n-types";

type RedirectParams = Parameters<typeof redirect>;

export const redirectWithLocale = (
  locale: Locales,
  status: RedirectParams[0],
  route: string,
) => {
  return redirect(status, `/${locale}${route}`);
};
