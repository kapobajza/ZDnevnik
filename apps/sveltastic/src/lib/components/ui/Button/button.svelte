<script lang="ts">
  import { Button as ButtonPrimitive } from "bits-ui";
  import { buttonVariants } from "./button.variants.js";
  import { cn } from "$lib/utils.js";
  import type { ButtonSize, ButtonVariant } from "./button.types.js";

  type Props = ButtonPrimitive.Props & {
    variant?: ButtonVariant;
    size?: ButtonSize;
  };

  type Events = ButtonPrimitive.Events;

  type $$Props = Props;
  type $$Events = Events;

  let className: $$Props["class"] = undefined;
  export let variant: $$Props["variant"] = "primary";
  export let size: $$Props["size"] = "primary";
  export let builders: $$Props["builders"] = [];
  export { className as class };
</script>

<ButtonPrimitive.Root
  {builders}
  class={cn(buttonVariants({ variant, size, className }))}
  type="button"
  {...$$restProps}
  on:click
  on:keydown
>
  <slot />
</ButtonPrimitive.Root>
