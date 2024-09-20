<script lang="ts">
  import { Dialog as DialogPrimitive } from "bits-ui";
  import type { Snippet } from "svelte";
  import DialogContent from "./dialog_content.svelte";
  import DialogOverlay from "./dialog_overlay.svelte";

  const {
    content,
    trigger,
    title,
    description,
    ...otherProps
  }: DialogPrimitive.Props & {
    content: Snippet;
    trigger: Snippet<[() => void]>;
    title?: string;
    description?: string;
  } = $props();

  let open = $state(false);
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
    <DialogContent {title} {description} bind:open>
      {@render content()}
    </DialogContent>
  </DialogPrimitive.Portal>
</DialogPrimitive.Root>
