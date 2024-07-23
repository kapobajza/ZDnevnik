import { cva } from "class-variance-authority";

import type { TypographyVariant } from "@/components/types";

export const headingVariants = cva("text-foreground", {
  variants: {
    variant: {
      h1: "text-h1",
      h2: "text-h2",
      h3: "text-h3",
      h4: "text-h4",
    } satisfies Record<
      Extract<TypographyVariant, "h1" | "h2" | "h3" | "h4">,
      string
    >,
  },
});

export const paragraphVariants = cva("text-foreground", {
  variants: {
    variant: {
      p: "text-p",
      p_ui: "text-p_ui",
      body_medium: "text-body_medium",
      blockquote: "text-blockquote",
      table_head: "text-table_head",
      lead: "text-lead",
      large: "text-large",
      subtle: "text-subtle",
      emphasize: "text-emphasize",
    } satisfies Record<
      Extract<
        TypographyVariant,
        | "p"
        | "p_ui"
        | "body_medium"
        | "blockquote"
        | "table_head"
        | "lead"
        | "large"
        | "subtle"
        | "emphasize"
      >,
      string
    >,
  },
  defaultVariants: {
    variant: "body_medium",
  },
});

export const spanVariants = cva("text-foreground", {
  variants: {
    variant: {
      small: "text-small",
      inline_code: "text-inline_code",
      table_item: "text-table_item",
    } satisfies Record<
      Extract<TypographyVariant, "small" | "inline_code" | "table_item">,
      string
    >,
  },
  defaultVariants: {
    variant: "small",
  },
});
