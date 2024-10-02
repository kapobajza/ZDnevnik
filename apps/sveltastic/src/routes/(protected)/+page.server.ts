import { fail, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { addStudentWithFileBodySchema } from "@zdnevnik/toolkit";
import { redirect } from "@sveltejs/kit";

import type { Actions, PageServerLoad } from "./$types";

import { SESSION_COOKIE_NAME } from "$env/static/private";
import { serverApi } from "$lib/api/instance.server";

export const load: PageServerLoad = async () => {
  const form = await superValidate(zod(addStudentWithFileBodySchema));

  return { form };
};

export const actions: Actions = {
  ["add-student"]: async ({ request, cookies }) => {
    const form = await superValidate(
      request,
      zod(addStudentWithFileBodySchema),
    );

    if (!form.valid) {
      return fail(422, { form });
    }

    let avatarUrl: string | undefined;

    try {
      const sessionCookie = cookies.get(SESSION_COOKIE_NAME);

      if (form.data.avatar) {
        const { url } = await serverApi({
          fetch,
          sessionCookie,
        }).image.upload(form.data.avatar);
        avatarUrl = url;
      }

      await serverApi({
        fetch,
        sessionCookie,
      }).clasroom.addStudent(form.data.classroomId, {
        ...form.data,
        avatarUrl,
      });
    } catch (error) {
      return { form };
    }

    return redirect(303, "/");
  },
};
