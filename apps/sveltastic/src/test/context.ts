import type { ComponentProps, ComponentType, SvelteComponent } from "svelte";
import {
  render,
  type RenderOptions,
  type SvelteComponentOptions,
} from "@testing-library/svelte";

import { MockLL } from "./i18n";

import { type Context } from "$lib/util";
import { baseLocale } from "$src/i18n/i18n-util";

export const testContext = (): Map<keyof Context, Context[keyof Context]> => {
  const map = new Map<keyof Context, Context[keyof Context]>();

  map.set("LL", MockLL);

  return map;
};

export const renderWithContext = <TComponent extends SvelteComponent>(
  component: ComponentType<TComponent>,
  options?: Omit<SvelteComponentOptions<TComponent>, "props"> & {
    props?: Omit<ComponentProps<TComponent>, "data"> & {
      data?: Omit<ComponentProps<TComponent>["data"], "locale">;
    };
  },
  renderOptions?: RenderOptions,
) => {
  return render(
    component,
    {
      ...options,
      context: testContext(),
      props: {
        ...options?.props,
        data: {
          ...(options?.props?.data as object),
          locale: baseLocale,
        },
      } as ComponentProps<TComponent>,
    },
    renderOptions,
  );
};
