import React from "react";

import { headingVariants } from "./Typography.variants";

import { cn } from "@/lib/utils";
import type { RequiredVariantProps } from "@/components/types/util";

export type HeadingProps = React.HTMLAttributes<HTMLHeadingElement> &
  RequiredVariantProps<typeof headingVariants>;

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, variant: Variant, ...props }, ref) => {
    return (
      <Variant
        className={cn(headingVariants({ variant: Variant, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);

Heading.displayName = "Heading";
