import { superValidate, setError } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import {
  loginBodySchema,
  type InvalidCredentialsSchema,
} from "@zdnevnik/toolkit";
import { fail, type Actions } from "@sveltejs/kit";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const form = await superValidate(zod(loginBodySchema));

  return { form };
};

export const actions: Actions = {
  default: async ({ request }) => {
    const form = await superValidate(request, zod(loginBodySchema));

    if (!form.valid) {
      return fail(422, { form });
    }

    const res = await fetch("http://localhost:5000/auth/login", {
      body: JSON.stringify(form.data),
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      const errRes = (await res.json()) as InvalidCredentialsSchema;
      return setError(form, errRes.error);
    }

    return { form };
  },
};
