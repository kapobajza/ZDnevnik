import { fail, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { addStudentWithFileBodySchema } from "@zdnevnik/toolkit";

import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const form = await superValidate(zod(addStudentWithFileBodySchema));

  return { form };
};

export const actions: Actions = {
  ["add-student"]: async ({ request }) => {
    const form = await superValidate(
      request,
      zod(addStudentWithFileBodySchema),
    );

    if (!form.valid) {
      return fail(422, { form });
    }

    return { form };
  },
};
