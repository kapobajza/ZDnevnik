<script lang="ts">
  import { Dialog as DialogPrimitive } from "bits-ui";
  import { cn, flyAndScale } from "$lib/utils.js";
  import { Icon } from "$lib/components/ui/Icon";
  import { Typography } from "$lib/components/ui/Typography";
  import { type Snippet } from "svelte";
  import { fly, type TransitionConfig } from "svelte/transition";
  import { createMediaQuery } from "$lib/runes";
  import { TwScreenConfig } from "$src/tw/const";

  let {
    class: className,
    children,
    open = $bindable(false),
    fitContent = false,
    title,
    description,
    onDismiss,
    ...otherProps
  }: Omit<DialogPrimitive.ContentProps, "transition" | "transitionConfig"> & {
    children: Snippet;
    open: boolean;
    fitContent?: boolean;
    title?: string;
    description?: string;
    onDismiss?: () => void;
  } = $props();

  const mobileMedia = createMediaQuery(`(max-width: ${TwScreenConfig.md})`);

  const { transition, transitionConfig } = $derived.by(() => {
    if (mobileMedia.matches) {
      return {
        transition: (node: Element) => fly(node, { y: "50%" }),
        transitionConfig: {
          duration: 220,
        } satisfies TransitionConfig,
      };
    }

    return {
      transition: flyAndScale,
      transitionConfig: { duration: 150 } satisfies TransitionConfig,
    };
  });
</script>

{#if open}
  <div
    class={cn(
      "zd-fixed zd-z-[90] zd-w-full zd-bg-background zd-shadow-foreground zd-drop-shadow-lg max-md:zd-bottom-0 max-md:zd-left-0 max-md:zd-rounded-t-md md:zd-left-[50%] md:zd-top-[50%] md:zd-max-w-lg md:zd-translate-x-[-50%] md:zd-translate-y-[-50%] md:zd-rounded-lg",
      !fitContent && "max-md:zd-top-[50px]",
    )}
    transition:transition={transitionConfig}
    onoutroend={() => {
      if (onDismiss) {
        onDismiss();
      }

      open = false;
    }}
  >
    <DialogPrimitive.Content
      class={cn("zd-h-full zd-w-full max-md:zd-p-4 md:zd-p-6", className)}
      {...otherProps}
    >
      <DialogPrimitive.Close class="zd-absolute zd-right-4 zd-top-4">
        <Icon
          name="X"
          class="zd-h-5 zd-w-5 zd-rounded-sm zd-ring-offset-background zd-transition-opacity hover:zd-opacity-100 focus:zd-outline-none focus:zd-ring-2 focus:zd-ring-ring focus:zd-ring-offset-2 disabled:zd-pointer-events-none data-[state=open]:zd-bg-accent data-[state=open]:zd-text-muted-foreground md:zd-opacity-60"
        />
        <span class="zd-sr-only">Close</span>
      </DialogPrimitive.Close>
      {#if title}
        <DialogPrimitive.Title class="zd-mb-4 zd-text-h3">
          {title}
        </DialogPrimitive.Title>
      {/if}
      {#if description}
        <DialogPrimitive.Description asChild>
          <Typography
            class="zd-mb-4 zd-text-foreground/70"
            variant="body_medium"
          >
            {description}
          </Typography>
        </DialogPrimitive.Description>
      {/if}
      {@render children()}
    </DialogPrimitive.Content>
  </div>
{/if}
