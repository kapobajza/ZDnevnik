import { superValidate, setError } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { loginBodySchema, ErrorResponseCode } from "@zdnevnik/toolkit";
import { fail, type Actions, redirect } from "@sveltejs/kit";
import cookie from "cookie";

import type { PageServerLoad } from "./$types";

import { isResponseCode } from "$lib/util";
import { api } from "$lib/api";
import { SESSION_COOKIE_NAME } from "$env/static/private";

export const load: PageServerLoad = async () => {
  const form = await superValidate(zod(loginBodySchema));

  return { form };
};

export const actions: Actions = {
  default: async ({ request, locals, fetch, cookies }) => {
    const form = await superValidate(request, zod(loginBodySchema));

    if (!form.valid) {
      return fail(422, { form });
    }

    try {
      const { response } = await api(fetch).auth.login(
        form.data.username,
        form.data.password,
      );

      const setCookie = response.headers?.getSetCookie?.()?.[0];

      if (!setCookie) {
        return setError(form, locals.LL.error_unknown());
      }

      const parsedCookie = cookie.parse(setCookie);
      const value = parsedCookie[SESSION_COOKIE_NAME];

      if (!value) {
        return setError(form, locals.LL.error_unknown());
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
      let message = locals.LL.error_unknown();

      if (isResponseCode(e, ErrorResponseCode.INVALID_CREDENTIALS)) {
        message = locals.LL.login_error_invalid_credentials();
      }

      return setError(form, message);
    }

    return redirect(301, "/");
  },
};
