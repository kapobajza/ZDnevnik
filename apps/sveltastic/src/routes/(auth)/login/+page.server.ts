import { superValidate, setError } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { loginBodySchema, ErrorResponseCode } from "@zdnevnik/toolkit";
import { fail, type Actions, redirect } from "@sveltejs/kit";

import type { PageServerLoad } from "./$types";

import { isResponseCode } from "$lib/util";

export const load: PageServerLoad = async () => {
  const form = await superValidate(zod(loginBodySchema));

  return { form };
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const form = await superValidate(request, zod(loginBodySchema));

    if (!form.valid) {
      return fail(422, { form });
    }

    try {
      await locals.api.auth.login(form.data.username, form.data.password);
    } catch (e) {
      let message = locals.LL.error_unknown();

      if (isResponseCode(e, ErrorResponseCode.INVALID_CREDENTIALS)) {
        message = locals.LL.login_error_invalid_credentials();
      }

      return setError(form, message);
    }

    return redirect(303, "/");
  },
};
