import type { TypographyVariant } from "$lib/components/types";

type TWFontSizeConfig = [
  fontSize: string,
  configuration: Partial<{
    lineHeight: string;
    fontWeight: "bold" | "normal" | number;
  }>,
];

export const TwFontSize = {
  h1: [
    "3rem",
    {
      fontWeight: "bold",
      lineHeight: "48px",
    },
  ],
  h2: [
    "1.88rem",
    {
      fontWeight: "bold",
      lineHeight: "36px",
    },
  ],
  h3: [
    "1.5rem",
    {
      fontWeight: "bold",
      lineHeight: "32px",
    },
  ],
  h4: [
    "1.25rem",
    {
      fontWeight: "bold",
      lineHeight: "28px",
    },
  ],
  h5: [
    "1.125rem",
    {
      fontWeight: "bold",
      lineHeight: "28px",
    },
  ],
  p: [
    "1rem",
    {
      lineHeight: "28px",
    },
  ],
  blockquote: [
    "1rem",
    {
      lineHeight: "24px",
    },
  ],
  table_head: [
    "1rem",
    {
      fontWeight: "bold",
      lineHeight: "24px",
    },
  ],
  table_item: [
    "1rem",
    {
      lineHeight: "24px",
    },
  ],
  list: [
    "1rem",
    {
      lineHeight: "24px",
    },
  ],
  inline_code: [
    "0.88rem",
    {
      lineHeight: "20px",
      fontWeight: "bold",
    },
  ],
  lead: [
    "1.25rem",
    {
      lineHeight: "28px",
    },
  ],
  large: [
    "1.12rem",
    {
      lineHeight: "28px",
      fontWeight: 300,
    },
  ],
  small: [
    "0.75rem",
    {
      lineHeight: "14px",
    },
  ],
  subtle: [
    "0.88rem",
    {
      lineHeight: "20px",
    },
  ],
  p_ui: [
    "1rem",
    {
      lineHeight: "24px",
    },
  ],
  body_medium: [
    "0.88rem",
    {
      lineHeight: "24px",
    },
  ],
  emphasize: [
    "1rem",
    {
      lineHeight: "24px",
    },
  ],
} as const satisfies Record<TypographyVariant, TWFontSizeConfig>;
