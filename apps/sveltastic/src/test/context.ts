import type { ComponentType, SvelteComponent } from "svelte";
import {
  render,
  type RenderOptions,
  type SvelteComponentOptions,
} from "@testing-library/svelte";

import { MockLL } from "./i18n";

import { type Context } from "$lib/util";

export const testContext = (): Map<keyof Context, Context[keyof Context]> => {
  const map = new Map<keyof Context, Context[keyof Context]>();

  map.set("LL", MockLL);

  return map;
};

export const renderWithContext = <TComponent extends SvelteComponent>(
  component: ComponentType<TComponent>,
  options?: SvelteComponentOptions<TComponent>,
  renderOptions?: RenderOptions,
) => {
  return render(
    component,
    {
      ...options,
      context: testContext(),
    },
    renderOptions,
  );
};
