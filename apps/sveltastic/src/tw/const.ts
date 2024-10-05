import type { ScreensConfig } from "tailwindcss/types/config";

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
    "3rem", // 48px
    {
      fontWeight: "bold",
      lineHeight: "48px",
    },
  ],
  h2: [
    "1.88rem", // 30px
    {
      fontWeight: "bold",
      lineHeight: "36px",
    },
  ],
  h3: [
    "1.5rem", // 24px
    {
      fontWeight: "bold",
      lineHeight: "32px",
    },
  ],
  h4: [
    "1.25rem", // 20px
    {
      fontWeight: "bold",
      lineHeight: "28px",
    },
  ],
  h5: [
    "1.125rem", // 18px
    {
      fontWeight: "bold",
      lineHeight: "28px",
    },
  ],
  p: [
    "1rem", // 16px
    {
      lineHeight: "28px",
    },
  ],
  blockquote: [
    "1rem", // 16px
    {
      lineHeight: "24px",
    },
  ],
  table_head: [
    "1rem", // 16px
    {
      fontWeight: "bold",
      lineHeight: "24px",
    },
  ],
  table_item: [
    "1rem", // 16px
    {
      lineHeight: "24px",
    },
  ],
  list: [
    "1rem", // 16px
    {
      lineHeight: "24px",
    },
  ],
  inline_code: [
    "0.88rem", // 14px
    {
      lineHeight: "20px",
      fontWeight: "bold",
    },
  ],
  lead: [
    "1.25rem", // 20px
    {
      lineHeight: "28px",
    },
  ],
  large: [
    "1.12rem", // 18px
    {
      lineHeight: "28px",
      fontWeight: 300,
    },
  ],
  small: [
    "0.75rem", // 12px
    {
      lineHeight: "14px",
    },
  ],
  subtle: [
    "0.88rem", // 14px
    {
      lineHeight: "20px",
    },
  ],
  p_ui: [
    "1rem", // 16px
    {
      lineHeight: "24px",
    },
  ],
  body_medium: [
    "0.88rem", // 14px
    {
      lineHeight: "24px",
    },
  ],
  emphasize: [
    "1rem", // 16px
    {
      lineHeight: "24px",
    },
  ],
} as const satisfies Record<TypographyVariant, TWFontSizeConfig>;

export const TwScreenConfig = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const satisfies ScreensConfig;
