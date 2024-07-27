import { tv } from "tailwind-variants";

export const alertVariants = tv({
  base: "zd-relative zd-w-full zd-rounded-lg zd-border zd-p-4 [&>svg+div]:zd-translate-y-[-3px] [&>svg]:zd-absolute [&>svg]:zd-left-4 [&>svg]:zd-top-4 [&>svg~*]:zd-pl-7",
  variants: {
    variant: {
      default: "zd-bg-background zd-text-foreground",
      destructive:
        "zd-border-destructive/50 zd-text-destructive dark:zd-border-destructive",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});
