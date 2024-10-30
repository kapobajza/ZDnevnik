import { inviteRespondClientBodySchema } from "@zdnevnik/toolkit";
import { fail, setError, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { get } from "svelte/store";

import type { Actions, PageServerLoad } from "./$types";

import LL from "$src/i18n/i18n-svelte";
import { redirectWithLocale } from "$lib/util/http";
import { serverApi } from "$lib/api/instance.server";

export const load: PageServerLoad = async ({ url, locals }) => {
  const token = url.searchParams.get("token");

  if (!token) {
    return redirectWithLocale(locals.locale, 301, "/");
  }

  const form = await superValidate(zod(inviteRespondClientBodySchema));

  return { form };
};

export const actions: Actions = {
  default: async ({ request, fetch, url, locals }) => {
    const form = await superValidate(
      request,
      zod(inviteRespondClientBodySchema),
    );
    const t = get(LL);

    if (!form.valid) {
      return fail(422, { form });
    }

    try {
      await serverApi({
        fetch,
      }).invite.respond(url.searchParams.get("token") ?? "", {
        ...form.data,
        email: url.searchParams.get("email") ?? "",
      });
    } catch (error) {
      return setError(form, t.error_unknown());
    }

    return redirectWithLocale(locals.locale, 301, "/login");
  },
};
