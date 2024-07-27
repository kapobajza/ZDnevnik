import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { loginBodySchema } from "@zdnevnik/toolkit";
import { fail, type Actions } from "@sveltejs/kit";

export const load = async () => {
  const form = await superValidate(zod(loginBodySchema));

  return { form };
};

export const actions: Actions = {
  default: async ({ request }) => {
    const form = await superValidate(request, zod(loginBodySchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    return { form };
  },
};
