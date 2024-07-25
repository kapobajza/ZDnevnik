import * as React from "react";

import { cn } from "@/lib/utils";
import { Span } from "@/components/ui/Typography";

export type InputProps = {
  error?: string;
  containerClassName?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, containerClassName, ...props }, ref) => {
    return (
      <div className={containerClassName}>
        <input
          className={cn(
            error && "zd-border-destructive zd-border focus-visible:zd-ring-0",
            "zd-flex zd-h-10 zd-w-full zd-rounded-md zd-border zd-border-input zd-bg-primary-foreground zd-px-3 zd-py-2 zd-text-p_ui zd-ring-offset-background file:zd-border-0 file:zd-bg-transparent file:zd-text-p_ui file:zd-font-medium placeholder:zd-text-muted-foreground focus-visible:zd-outline-none disabled:zd-cursor-not-allowed disabled:zd-opacity-50",
            !error &&
              "focus-visible:zd-ring-2 focus-visible:zd-ring-ring focus-visible:zd-ring-offset-2",
            className,
          )}
          ref={ref}
          {...props}
        />
        {error ? (
          <Span className="zd-text-destructive" variant="small">
            {error}
          </Span>
        ) : null}
      </div>
    );
  },
);

Input.displayName = "Input";
