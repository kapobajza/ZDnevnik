import { superValidate, setError } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { loginBodySchema, ErrorResponseCode } from "@zdnevnik/toolkit";
import { fail, type Actions } from "@sveltejs/kit";
import cookie from "cookie";
import { get } from "svelte/store";

import type { PageServerLoad } from "./$types";

import { isResponseCode } from "$lib/util";
import { SESSION_COOKIE_NAME } from "$env/static/private";
import LL from "$src/i18n/i18n-svelte";
import { serverApi } from "$lib/api/instance.server";
import { redirectWithLocale } from "$lib/util/http";

export const load: PageServerLoad = async () => {
  const form = await superValidate(zod(loginBodySchema));

  return { form };
};

export const actions: Actions = {
  default: async ({ request, fetch, cookies, locals }) => {
    const form = await superValidate(request, zod(loginBodySchema));
    const t = get(LL);

    if (!form.valid) {
      return fail(422, { form });
    }

    try {
      const { response } = await serverApi({ fetch }).auth.login(
        form.data.username,
        form.data.password,
      );

      const setCookie = response.headers?.getSetCookie?.()?.[0];

      if (!setCookie) {
        return setError(form, t.error_unknown());
      }

      const parsedCookie = cookie.parse(setCookie);
      const value = parsedCookie[SESSION_COOKIE_NAME];

      if (!value) {
        return setError(form, t.error_unknown());
      }

      type CookieOptions = Parameters<typeof cookies.set>[2] & {
        "max-age": number;
      };

      const cookieOpts = Object.keys(parsedCookie).reduce((acc, key) => {
        if (key === SESSION_COOKIE_NAME) {
          return acc;
        }

        const val = parsedCookie[key];
        const cookieKey =
          key.toLowerCase() as keyof cookie.CookieSerializeOptions;

        acc[cookieKey] = val as never;
        return acc;
      }, {} as CookieOptions);

      cookies.set(SESSION_COOKIE_NAME, value, {
        ...cookieOpts,
        secure: false,
        maxAge: cookieOpts["max-age"],
      });
    } catch (e) {
      let message = t.error_unknown();

      if (isResponseCode(e, ErrorResponseCode.INVALID_CREDENTIALS)) {
        message = t.login.error_invalid_credentials();
      }

      return setError(form, message);
    }

    return redirectWithLocale(locals.locale, 301, "/");
  },
};
