<script lang="ts">
  import { cn } from "$lib/utils";

  type LoaderSize = "small" | "medium" | "large";

  const {
    class: className,
    content = "Koji si ti broj?",
    size = "medium",
  }: {
    class?: string;
    content?: string;
    size?: LoaderSize;
  } = $props();

  const loaderSizeMap = {
    small: 14,
    medium: 20,
    large: 30,
  } as const satisfies Record<LoaderSize, number>;
</script>

<div
  class={cn(
    `zd-animate-loader zd-text-center zd-text-[${loaderSizeMap[size]}px] zd-text-primary zd-font-bold zd-my-4`,
    className,
  )}
>
  {content}
</div>
