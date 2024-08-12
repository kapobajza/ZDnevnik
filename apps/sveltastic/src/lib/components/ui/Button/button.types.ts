import type { VariantProps } from "tailwind-variants";

import type { buttonVariants } from "./button.variants";

export type ButtonVariant = VariantProps<typeof buttonVariants>["variant"];

export type ButtonSize = VariantProps<typeof buttonVariants>["size"];

export type IconButtonSize = "sm" | "md";

export type IconButtonSizeMap = Record<IconButtonSize, string>;
