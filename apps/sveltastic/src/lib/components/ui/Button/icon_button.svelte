<script lang="ts">
  import { type IconName, Icon } from "$lib/components/ui/Icon";
  import { cn } from "$lib/utils";
  import type { HTMLButtonAttributes } from "svelte/elements";
  import type { IconButtonSize, IconButtonSizeMap } from "./button.types";
  import { tv } from "tailwind-variants";

  const buttonVariants = tv({
    base: "zd-flex zd-items-center zd-justify-center zd-rounded-full zd-bg-primary zd-transition-colors hover:zd-border hover:zd-border-primary hover:zd-bg-[transparent] [&>svg]:hover:zd-text-primary",
    variants: {
      size: {
        sm: "zd-size-9 zd-h-9 zd-w-9",
        md: "zd-size-16 zd-h-16 zd-w-16",
      } satisfies IconButtonSizeMap,
    },
  });

  const iconVariants = tv({
    base: "zd-text-primary-foreground",
    variants: {
      size: {
        sm: "zd-size-4 zd-h-4 zd-w-4",
        md: "zd-size-7 zd-h-7 zd-w-7",
      } satisfies IconButtonSizeMap,
    },
  });

  const {
    icon,
    class: className,
    size = "md",
    ...props
  }: HTMLButtonAttributes & {
    icon: IconName;
    size?: IconButtonSize;
  } = $props();
</script>

<button class={cn(buttonVariants({ size, className }))} {...props}>
  <Icon name={icon} class={cn(iconVariants({ size }))} />
</button>
