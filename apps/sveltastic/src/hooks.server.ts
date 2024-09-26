import { redirect, type Handle, type HandleFetch } from "@sveltejs/kit";
import { detectLocale } from "typesafe-i18n/detectors";

import { SESSION_COOKIE_NAME } from "$env/static/private";
import { baseLocale, locales } from "$src/i18n/i18n-util";
import { initZodErrorMap } from "$lib/util";

let translationsLoaded = false;

export const handle: Handle = async ({ event, resolve }) => {
  const locale = detectLocale(baseLocale, locales);

  if (!translationsLoaded) {
    initZodErrorMap();
    translationsLoaded = true;
  }

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
