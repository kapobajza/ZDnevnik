import { tv } from "tailwind-variants";

export const buttonVariants = tv({
  base: "zd-text-sm zd-inline-flex zd-items-center zd-justify-center zd-whitespace-nowrap zd-rounded-md zd-font-medium zd-ring-offset-background zd-transition-colors focus-visible:zd-outline-none focus-visible:zd-ring-2 focus-visible:zd-ring-ring focus-visible:zd-ring-offset-2 disabled:zd-cursor-not-allowed disabled:zd-opacity-50",
  variants: {
    variant: {
      primary:
        "zd-bg-primary zd-text-primary-foreground hover:enabled:zd-border hover:enabled:zd-border-primary hover:enabled:zd-bg-primary-foreground hover:enabled:zd-text-primary",
    },
    size: {
      primary: "zd-h-10 zd-px-4 zd-py-2",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "primary",
  },
});
