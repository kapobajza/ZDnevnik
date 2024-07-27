import React from "react";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@ds/lib/utils";

import { paragraphVariants } from "./Typography.variants";

export type ParagraphProps = React.HTMLAttributes<HTMLParagraphElement> &
  VariantProps<typeof paragraphVariants>;

export const Paragraph = React.forwardRef<HTMLParagraphElement, ParagraphProps>(
  ({ className, variant = "body_medium", ...props }, ref) => {
    return (
      <p
        className={cn(paragraphVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);

Paragraph.displayName = "Paragraph";
