import { describe, expect, test } from "vitest";
import { screen } from "@testing-library/svelte";

import HomePage from "./+page.svelte";

import { renderWithContext } from "$src/test";

describe("Home page", () => {
  test("Should return empty if there are no students", () => {
    renderWithContext(HomePage);

    expect(
      screen.getByRole("img", {
        name: /no students/i,
      }),
    ).toBeInTheDocument();
  });
});
