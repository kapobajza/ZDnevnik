<script lang="ts">
  import { Button as ButtonPrimitive } from "bits-ui";
  import { buttonVariants } from "./button.variants.js";
  import { cn } from "$lib/utils.js";
  import type { ButtonSize, ButtonVariant } from "./button.types.js";
  import type { Snippet } from "svelte";

  type Events = ButtonPrimitive.Events;

  type $$Events = Events;

  const {
    variant = "primary",
    size = "primary",
    class: className,
    builders = [],
    children,
    ...otherProps
  }: ButtonPrimitive.Props & {
    variant?: ButtonVariant;
    size?: ButtonSize;
    children: Snippet;
  } = $props();
</script>

<ButtonPrimitive.Root
  {builders}
  class={cn(buttonVariants({ variant, size, className }))}
  type="button"
  {...otherProps as object}
  on:click
  on:keydown
>
  {@render children()}
</ButtonPrimitive.Root>
