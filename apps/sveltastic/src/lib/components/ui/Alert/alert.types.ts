import type { VariantProps } from "tailwind-variants";

import type { alertVariants } from "./alert.variants.js";

export type AlertVariant = VariantProps<typeof alertVariants>["variant"];
export type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
