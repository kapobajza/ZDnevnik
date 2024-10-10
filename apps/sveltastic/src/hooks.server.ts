import { redirect, type Handle, type HandleFetch } from "@sveltejs/kit";

import { SESSION_COOKIE_NAME } from "$env/static/private";
import { initZodErrorMap } from "$lib/util";
import { base } from "$app/paths";
import { detectLocale, isLocale } from "$src/i18n/i18n-util";

let translationsLoaded = false;

export const getPathnameWithoutBase = (url: URL) => {
  return url.pathname.replace(new RegExp(`^${base}`), "");
};

export const handle: Handle = async ({ event, resolve }) => {
  const [, lang] = getPathnameWithoutBase(event.url).split("/");

  if (!lang || !isLocale(lang)) {
    const locale = detectLocale();
    throw redirect(307, `${base}/${locale}${event.url.pathname}`);
  }

  event.locals.locale = lang;

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
    transformPageChunk: ({ html }) => html.replace("%lang%", lang),
  });
};

export const handleFetch: HandleFetch = async ({ event, request, fetch }) => {
  const sessionId = event.request.headers.get(SESSION_COOKIE_NAME);

  if (sessionId) {
    request.headers.set("cookie", sessionId);
  }

  return fetch(request);
};
