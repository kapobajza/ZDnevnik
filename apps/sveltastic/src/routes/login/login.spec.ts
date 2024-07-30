import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/svelte";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { loginBodySchema } from "@zdnevnik/toolkit";

import LoginPage from "./+page.svelte";

describe("Login page", () => {
  test("should render error if form is invalid", async () => {
    const form = await superValidate(zod(loginBodySchema));
    render(LoginPage, {
      data: {
        form,
        locale: "ba",
      },
    });

    const submitButton = screen.getByRole("button", {
      name: /prijava/i,
    });

    submitButton.click();

    const usernameError = screen.getByText(/korisničko ime je obavezno/i);
    const passwordError = screen.getByText(/lozinka je obavezna/i);

    expect(usernameError).toBeInTheDocument();
    expect(passwordError).toBeInTheDocument();
  });
});
