import { describe, expect, test } from "vitest";
import { screen } from "@testing-library/svelte";
import { setError, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { ErrorResponseCode, loginBodySchema } from "@zdnevnik/toolkit";

import LoginPage from "./+page.svelte";

import { renderWithContext } from "$src/test";

const generateDummyRequest = (username: string, password: string) => {
  const formData = new FormData();
  formData.set("username", username);
  formData.set("password", password);
  return new Request("https://example.com", {
    method: "POST",
    body: formData,
  });
};

describe("Login page", () => {
  test("should render error if form is invalid", async () => {
    const request = generateDummyRequest("", "");
    const form = await superValidate(request, zod(loginBodySchema));

    renderWithContext(LoginPage, {
      props: {
        data: {
          form,
        },
      },
    });

    const usernameError = screen.getByText(/korisničko ime je obavezno/i);
    const passwordError = screen.getByText(/lozinka je obavezna/i);

    expect(usernameError).toBeInTheDocument();
    expect(passwordError).toBeInTheDocument();
  });

  test("should render error if password is too short", async () => {
    const request = generateDummyRequest("test", "test");
    const form = await superValidate(request, zod(loginBodySchema));

    renderWithContext(LoginPage, {
      props: {
        data: {
          form,
        },
      },
    });

    const passwordError = screen.getByText(/lozinka je prekratka/i);

    expect(passwordError).toBeInTheDocument();
  });

  test("should render error if username or password are incorrect", async () => {
    const request = generateDummyRequest("test", "Testingtesttest");
    const form = await superValidate(request, zod(loginBodySchema));
    const formError = setError(form, ErrorResponseCode.INVALID_CREDENTIALS);

    renderWithContext(LoginPage, {
      props: {
        data: {
          form: {
            ...form,
            errors: formError.data.form.errors,
          },
        },
      },
    });

    const error = screen.getByText(/pogrešno korisničko ime ili lozinka/i);
    expect(error).toBeInTheDocument();
  });

  test("should redirect to home if login is successful", async () => {
    const request = generateDummyRequest("test", "Testingtesttest");
    const form = await superValidate(request, zod(loginBodySchema));
    const formError = setError(form, ErrorResponseCode.INVALID_CREDENTIALS);

    renderWithContext(LoginPage, {
      props: {
        data: {
          form: {
            ...form,
            errors: formError.data.form.errors,
          },
        },
      },
    });

    const error = screen.queryByText(/pogrešno korisničko ime ili lozinka/i);
    expect(error).not.toBeInTheDocument();
  });
});
