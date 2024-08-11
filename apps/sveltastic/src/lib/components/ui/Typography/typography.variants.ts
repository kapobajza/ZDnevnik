import { tv } from "tailwind-variants";

import type { TypographyVariant } from "$lib/components/types";

export const typographyVariants = tv({
  variants: {
    variant: {
      h1: "zd-text-h1",
      h2: "zd-text-h2",
      h3: "zd-text-h3",
      h4: "zd-text-h4",
      h5: "zd-text-h5",
      p: "zd-text-p",
      p_ui: "zd-text-p_ui",
      body_medium: "zd-text-body_medium",
      blockquote: "zd-text-blockquote",
      table_head: "zd-text-table_head",
      lead: "zd-text-lead",
      large: "zd-text-large",
      subtle: "zd-text-subtle",
      emphasize: "zd-text-emphasize",
      small: "zd-text-small",
      inline_code: "zd-text-inline_code",
      table_item: "zd-text-table_item",
      list: "zd-text-list",
    } satisfies Record<TypographyVariant, string>,
  },
});
