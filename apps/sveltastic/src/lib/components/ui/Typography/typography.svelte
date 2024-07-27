<script lang="ts">
  import { typographyVariants } from "./typography.variants.js";
  import { cn } from "$lib/utils.js";
  import type { TypographyVariant } from "$lib/components/types/typography.js";
  import type { SvelteHTMLElements } from "svelte/elements";

  type Props = SvelteHTMLElements["span"] & {
    variant: TypographyVariant;
  };

  type $$Props = Props;
  let variant: $$Props["variant"];

  const variantElements = {
    h1: "h1",
    h2: "h2",
    h3: "h3",
    h4: "h4",
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
    "p" | "span" | "h1" | "h2" | "h3" | "h4"
  >;

  $: element = variantElements[variant] ?? variantElements.body_medium;

  let className: $$Props["class"] = undefined;
  export { className as class, variant };
</script>

<svelte:element
  this={element}
  class={cn(typographyVariants({ variant, className }))}
  {...$$restProps}
>
  <slot />
</svelte:element>
