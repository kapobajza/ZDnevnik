import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "zd-inline-flex zd-items-center zd-justify-center zd-whitespace-nowrap zd-rounded-md zd-text-sm zd-font-medium zd-ring-offset-background zd-transition-colors focus-visible:zd-outline-none focus-visible:zd-ring-2 focus-visible:zd-ring-ring focus-visible:zd-ring-offset-2 disabled:zd-opacity-50 disabled:zd-cursor-not-allowed",
  {
    variants: {
      variant: {
        default:
          "zd-bg-primary zd-text-primary-foreground hover:enabled:zd-bg-primary-foreground hover:enabled:zd-text-primary hover:enabled:zd-border-primary hover:enabled:zd-border",
      },
      size: {
        default: "zd-h-10 zd-px-4 zd-py-2",
        icon: "zd-h-10 zd-w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);
