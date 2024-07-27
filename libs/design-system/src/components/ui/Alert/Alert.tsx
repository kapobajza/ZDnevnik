import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@ds/lib/utils";

const alertVariants = cva(
  "zd-relative zd-w-full zd-rounded-lg zd-border zd-px-4 zd-py-3 text-sm [&>svg+div]:zd-translate-y-[-3px] [&>svg]:zd-absolute [&>svg]:zd-left-4 [&>svg]:zd-top-4 [&>svg]:zd-text-foreground [&>svg~*]:zd-pl-7",
  {
    variants: {
      variant: {
        default: "zd-bg-background zd-text-foreground",
        destructive:
          "zd-border-destructive-primary/50 zd-text-destructive-primary zd-dark:border-destructive-primary [&>svg]:zd-text-destructive-primary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
));

Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn(
      "zd-mb-1 zd-font-medium zd-leading-none zd-tracking-tight",
      className,
    )}
    {...props}
  >
    {children}
  </h5>
));

AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("zd-text-subtle [&_p]:zd-leading-relaxed", className)}
    {...props}
  />
));

AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
