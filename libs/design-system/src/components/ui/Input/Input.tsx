import * as React from "react";

import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        className={cn(
          "zd-flex zd-h-10 zd-w-full zd-rounded-md zd-border zd-border-input zd-bg-background zd-px-3 zd-py-2 zd-text-p_ui zd-ring-offset-background file:zd-border-0 file:zd-bg-transparent file:zd-text-p_ui file:zd-font-medium placeholder:zd-text-muted-foreground focus-visible:zd-outline-none focus-visible:zd-ring-2 focus-visible:zd-ring-ring focus-visible:zd-ring-offset-2 disabled:zd-cursor-not-allowed disabled:zd-opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
