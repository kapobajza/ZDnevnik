import React from "react";
import { cn } from "@ds/lib/utils";

export type ContainerProps = React.HTMLAttributes<HTMLDivElement>;

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, ...props }: ContainerProps) => {
    return (
      <div
        className={cn("zd-px-8 lg:zd-max-w-[1024px] lg:zd-m-auto", className)}
        {...props}
      />
    );
  },
);
