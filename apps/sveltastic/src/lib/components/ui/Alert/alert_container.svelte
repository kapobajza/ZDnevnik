<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import type { AlertVariant } from "./index.js";
  import { alertVariants } from "./alert.variants.js";
  import { cn } from "$lib/utils.js";
  import type { Snippet } from "svelte";

  const {
    variant = "default",
    class: className,
    children,
    ...otherProps
  }: HTMLAttributes<HTMLDivElement> & {
    variant?: AlertVariant;
    children: Snippet;
  } = $props();
</script>

<div
  class={cn(alertVariants({ variant }), className)}
  {...otherProps}
  role="alert"
>
  {@render children()}
</div>
