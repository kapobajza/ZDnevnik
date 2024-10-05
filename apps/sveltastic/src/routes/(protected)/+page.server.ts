import { Readable } from "stream";

import { fail, setError, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { addStudentWithFileBodySchema } from "@zdnevnik/toolkit";
import { get } from "svelte/store";
import { FormData } from "formdata-node";
import { FormDataEncoder } from "form-data-encoder";

import type { Actions, PageServerLoad } from "./$types";

import { SESSION_COOKIE_NAME } from "$env/static/private";
import { serverApi } from "$lib/api/instance.server";
import LL from "$src/i18n/i18n-svelte";

export const load: PageServerLoad = async () => {
  const form = await superValidate(zod(addStudentWithFileBodySchema));

  return {
    form,
  };
};

export const actions: Actions = {
  ["add-student"]: async ({ request, cookies }) => {
    const form = await superValidate(
      request,
      zod(addStudentWithFileBodySchema),
    );
    const t = get(LL);

    if (!form.valid) {
      return fail(422, { form });
    }

    let avatarUrl: string | undefined;

    try {
      const sessionCookie = cookies.get(SESSION_COOKIE_NAME);

      if (form.data.avatar) {
        const formData = new FormData();
        formData.append("file", form.data.avatar);

        const encoder = new FormDataEncoder(formData);
        const readable = Readable.from(encoder);

        const { url } = await serverApi({
          fetch,
          sessionCookie,
        }).image.upload(readable, {
          headers: encoder.headers,
          duplex: "half",
        });
        avatarUrl = url;
        delete form.data.avatar;
      }

      await serverApi({
        fetch,
        sessionCookie,
      }).clasroom.addStudent(form.data.classroomId, {
        ...form.data,
        avatarUrl,
      });
    } catch (error) {
      return setError(form, t.error_unknown());
    }

    return { form };
  },
};
