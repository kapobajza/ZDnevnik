import type { Handle } from "@sveltejs/kit";
import { detectLocale } from "typesafe-i18n/detectors";
import { i18nObject } from "typesafe-i18n";

import type { TranslationFunctions } from "./i18n/i18n-types";

import { baseLocale, locales } from "$src/i18n/i18n-util";
import { importLocaleAsync } from "$src/i18n/i18n-util.async";
import { initZodErrorMap } from "$lib/util";
import { createApiInstance } from "$lib/api";

let translationsLoaded = false;

export const handle: Handle = async ({ event, resolve }) => {
  const locale = detectLocale(baseLocale, locales);
  const importedLocales = await importLocaleAsync(locale);
  const LL: TranslationFunctions = i18nObject(locale, importedLocales);

  if (!translationsLoaded) {
    initZodErrorMap(LL);
    translationsLoaded = true;
  }

  event.locals.api = createApiInstance();
  event.locals.LL = LL;

  return resolve(event, {
    transformPageChunk: ({ html }) => html.replace("%lang%", locale),
  });
};
