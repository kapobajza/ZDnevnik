<script lang="ts">
  import { Dialog as DialogPrimitive } from "bits-ui";
  import { fade } from "svelte/transition";
  import { cn } from "$lib/utils.js";

  const {
    class: className,
    children,
    transition = fade,
    transitionConfig = {
      duration: 150,
    },
    ...otherProps
  }: DialogPrimitive.OverlayProps = $props();
</script>

<DialogPrimitive.Overlay
  {transition}
  {transitionConfig}
  class={cn(
    "zd-fixed zd-inset-0 zd-z-50 zd-bg-foreground/20 zd-backdrop-blur-sm",
    className,
  )}
  {...otherProps}
/>
