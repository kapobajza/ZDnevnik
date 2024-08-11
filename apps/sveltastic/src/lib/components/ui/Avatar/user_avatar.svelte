<script lang="ts">
  import type { HTMLImgAttributes } from "svelte/elements";
  import { cn } from "$lib/utils.js";
  import DefaultAvatar from "$lib/components/ui/Avatar/assets/default_avatar.png?enhanced";
  import type { AvatarSize } from "./avatar.types";
  import { tv } from "tailwind-variants";

  const avatarVariants = tv({
    base: "zd-rounded-full",
    variants: {
      size: {
        xs: "zd-size-[24px] zd-w-[24px] zd-h-[24px]",
        sm: "zd-size-[40px] zd-w-[40px] zd-h-[40px]",
        md: "zd-size-[80px] zd-w-[80px] zd-h-[80px]",
        lg: "zd-size-[150px] zd-w-[150px] zd-h-[150px]",
        xl: "zd-size-[250px] zd-w-[250px] zd-h-[250px]",
      },
    },
  });

  const {
    class: className,
    src,
    size = "md",
    ...otherProps
  }: Omit<HTMLImgAttributes, "src"> & {
    src: string | undefined | null;
    size?: AvatarSize;
  } = $props();
</script>

<enhanced:img
  src={src ?? DefaultAvatar}
  class={cn(avatarVariants({ size, className }))}
  alt="User avatar"
  {...otherProps}
/>
