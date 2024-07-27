import { cva } from "class-variance-authority";
import type { TypographyVariant } from "@ds/components/types";

export const headingVariants = cva("zd-text-foreground", {
  variants: {
    variant: {
      h1: "zd-text-h1",
      h2: "zd-text-h2",
      h3: "zd-text-h3",
      h4: "zd-text-h4",
    } satisfies Record<
      Extract<TypographyVariant, "h1" | "h2" | "h3" | "h4">,
      string
    >,
  },
});

export const paragraphVariants = cva("zd-text-foreground", {
  variants: {
    variant: {
      p: "zd-text-p",
      p_ui: "zd-text-p_ui",
      body_medium: "zd-text-body_medium",
      blockquote: "zd-text-blockquote",
      table_head: "zd-text-table_head",
      lead: "zd-text-lead",
      large: "zd-text-large",
      subtle: "zd-text-subtle",
      emphasize: "zd-text-emphasize",
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

export const spanVariants = cva("zd-text-foreground", {
  variants: {
    variant: {
      small: "zd-text-small",
      inline_code: "zd-text-inline_code",
      table_item: "zd-text-table_item",
    } satisfies Record<
      Extract<TypographyVariant, "small" | "inline_code" | "table_item">,
      string
    >,
  },
  defaultVariants: {
    variant: "small",
  },
});
