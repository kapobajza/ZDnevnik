<script lang="ts">
  import { typographyVariants } from "./typography.variants.js";
  import { cn } from "$lib/utils.js";
  import type { TypographyVariant } from "$lib/components/types/typography.js";
  import type { SvelteHTMLElements } from "svelte/elements";
  import type { Snippet } from "svelte";

  const variantElements = {
    h1: "h1",
    h2: "h2",
    h3: "h3",
    h4: "h4",
    h5: "h5",
    blockquote: "p",
    body_medium: "p",
    large: "p",
    lead: "p",
    list: "p",
    p: "p",
    p_ui: "p",
    table_head: "p",
    emphasize: "span",
    inline_code: "span",
    small: "span",
    table_item: "span",
    subtle: "span",
  } satisfies Record<
    TypographyVariant,
    "p" | "span" | "h1" | "h2" | "h3" | "h4" | "h5"
  >;

  const {
    class: className,
    children,
    variant,
    ...otherProps
  }: SvelteHTMLElements["span"] & {
    variant: TypographyVariant;
    children: Snippet;
  } = $props();
</script>

<svelte:element
  this={variantElements[variant] ?? variantElements.body_medium}
  class={cn(typographyVariants({ variant, className }))}
  {...otherProps}
>
  {@render children()}
</svelte:element>
