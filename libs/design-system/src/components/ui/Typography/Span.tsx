import React from "react";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@ds/lib/utils";

import { spanVariants } from "./Typography.variants";

export type SpanProps = React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof spanVariants>;

export const Span = React.forwardRef<HTMLSpanElement, SpanProps>(
  ({ className, variant = "small", ...props }, ref) => {
    return (
      <span
        className={cn(spanVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);

Span.displayName = "Span";
