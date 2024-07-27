import React from "react";
import { cn } from "@ds/lib/utils";
import type { RequiredVariantProps } from "@ds/components/types/util";

import { headingVariants } from "./Typography.variants";

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
