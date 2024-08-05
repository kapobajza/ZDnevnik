import { redirect, type Handle, type HandleFetch } from "@sveltejs/kit";
import { detectLocale } from "typesafe-i18n/detectors";
import { i18nObject } from "typesafe-i18n";

import type { TranslationFunctions } from "./i18n/i18n-types";

import { SESSION_COOKIE_NAME } from "$env/static/private";
import { baseLocale, locales } from "$src/i18n/i18n-util";
import { importLocaleAsync } from "$src/i18n/i18n-util.async";
import { initZodErrorMap } from "$lib/util";

let translationsLoaded = false;

export const handle: Handle = async ({ event, resolve }) => {
  const locale = detectLocale(baseLocale, locales);
  const importedLocales = await importLocaleAsync(locale);
  const LL: TranslationFunctions = i18nObject(locale, importedLocales);

  if (!translationsLoaded) {
    initZodErrorMap(LL);
    translationsLoaded = true;
  }

  event.locals.LL = LL;

  const sessionCookie = event.cookies.get(SESSION_COOKIE_NAME);

  if (event.route.id?.includes("protected") && !sessionCookie) {
    throw redirect(301, "/login");
  }

  if (event.route.id?.includes("auth") && sessionCookie) {
    throw redirect(301, "/");
  }

  return resolve(event, {
    transformPageChunk: ({ html }) => html.replace("%lang%", locale),
  });
};

export const handleFetch: HandleFetch = async ({ event, request, fetch }) => {
  const sessionId = event.request.headers.get(SESSION_COOKIE_NAME);

  if (sessionId) {
    request.headers.set("cookie", sessionId);
  }

  return fetch(request);
};
