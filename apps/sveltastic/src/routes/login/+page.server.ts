import { superValidate, setError } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { loginBodySchema, ErrorResponseCode } from "@zdnevnik/toolkit";
import { fail, type Actions, redirect } from "@sveltejs/kit";
import cookie from "cookie";

import type { PageServerLoad } from "./$types";

import { SESSION_COOKIE_NAME } from "$env/static/private";
import { isResponseCode } from "$lib/util";

export const load: PageServerLoad = async () => {
  const form = await superValidate(zod(loginBodySchema));

  return { form };
};

export const actions: Actions = {
  default: async ({ request, locals, cookies }) => {
    const form = await superValidate(request, zod(loginBodySchema));

    if (!form.valid) {
      return fail(422, { form });
    }

    try {
      const { response } = await locals.api.auth.login(
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

      cookies.set(SESSION_COOKIE_NAME, value, {
        path: parsedCookie.Path ?? "/",
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
