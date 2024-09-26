<script lang="ts">
  import { Dialog as DialogPrimitive } from "bits-ui";
  import type { Snippet } from "svelte";
  import DialogContent from "./dialog_content.svelte";
  import DialogOverlay from "./dialog_overlay.svelte";

  let {
    content,
    title,
    description,
    onDismiss,
    trigger,
    open = $bindable(false),
    contentClass,
    ...otherProps
  }: DialogPrimitive.Props & {
    content: Snippet;
    trigger: Snippet<[() => void]>;
    title?: string;
    description?: string;
    onDismiss?: () => void;
    open?: boolean;
    contentClass?: string;
  } = $props();
</script>

<DialogPrimitive.Root
  {...otherProps}
  bind:open
  onOpenChange={(isOpen) => (open = isOpen)}
>
  <DialogPrimitive.Trigger asChild>
    {@render trigger(() => (open = true))}
  </DialogPrimitive.Trigger>
  <DialogPrimitive.Portal>
    <DialogOverlay />
    <DialogContent
      {title}
      {description}
      {onDismiss}
      class={contentClass}
      bind:open
    >
      {@render content()}
    </DialogContent>
  </DialogPrimitive.Portal>
</DialogPrimitive.Root>
