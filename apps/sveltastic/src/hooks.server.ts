import { redirect, type Handle } from "@sveltejs/kit";
import { detectLocale } from "typesafe-i18n/detectors";
import { i18nObject } from "typesafe-i18n";
import cookie from "cookie";

import type { TranslationFunctions } from "./i18n/i18n-types";

import { SESSION_COOKIE_NAME } from "$env/static/private";
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

  event.locals.api = createApiInstance({
    origin: event.url.origin,
    responseInterceptor(response) {
      const setCookie = response.headers?.getSetCookie?.()?.[0];

      if (!setCookie) {
        event.cookies.delete(SESSION_COOKIE_NAME, { path: "/" });
        return;
      }

      const parsedCookie = cookie.parse(setCookie);
      const value = parsedCookie[SESSION_COOKIE_NAME];

      if (!value) {
        event.cookies.delete(SESSION_COOKIE_NAME, { path: "/" });
        return;
      }

      event.cookies.set(SESSION_COOKIE_NAME, value, {
        path: parsedCookie.Path ?? "/",
      });
    },
  });
  event.locals.LL = LL;

  const sessionCookie = event.cookies.get(SESSION_COOKIE_NAME);

  if (event.route.id?.includes("protected") && !sessionCookie) {
    throw redirect(303, "/login");
  }

  if (event.route.id?.includes("auth") && sessionCookie) {
    throw redirect(303, "/");
  }

  return resolve(event, {
    transformPageChunk: ({ html }) => html.replace("%lang%", locale),
  });
};
