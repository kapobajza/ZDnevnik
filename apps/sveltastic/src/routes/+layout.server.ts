import { detectLocale } from "typesafe-i18n/detectors";
import { redirect } from "@sveltejs/kit";

import type { LayoutServerLoad } from "./$types";

import { baseLocale, locales } from "$src/i18n/i18n-util";

const langParam = "lang";

export const load: LayoutServerLoad = (event) => {
  const newLocale = event.url.searchParams.get(langParam);

  if (newLocale) {
    event.cookies.set(langParam, newLocale, { path: "/" });
    const url = new URL(event.url);
    url.searchParams.delete(langParam);
    return redirect(303, url.toString());
  }

  const locale = detectLocale(baseLocale, locales);
  return { locale };
};
