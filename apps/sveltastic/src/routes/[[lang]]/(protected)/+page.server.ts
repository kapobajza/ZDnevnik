import { fail, setError, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { inviteStudentClientBodySchema } from "@zdnevnik/toolkit";
import { get } from "svelte/store";

import type { Actions, PageServerLoad } from "./$types";

import { serverApi } from "$lib/api/instance.server";
import LL from "$src/i18n/i18n-svelte";
import { SESSION_COOKIE_NAME } from "$env/static/private";

export const load: PageServerLoad = async () => {
  const form = await superValidate(zod(inviteStudentClientBodySchema));

  return {
    form,
  };
};

export const actions: Actions = {
  ["add-student"]: async ({ request, cookies }) => {
    const form = await superValidate(
      request,
      zod(inviteStudentClientBodySchema),
    );
    const t = get(LL);

    if (!form.valid) {
      return fail(422, { form });
    }

    try {
      const sessionCookie = cookies.get(SESSION_COOKIE_NAME);

      await serverApi({
        fetch,
        sessionCookie,
      }).invite.student(form.data.classroomId, form.data);
    } catch (e) {
      return setError(form, t.error_unknown());
    }

    return { form };
  },
};
