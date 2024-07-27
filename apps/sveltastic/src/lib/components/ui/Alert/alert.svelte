<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import AlertContainer from "./alert_container.svelte";
  import AlertDescription from "./alert_description.svelte";
  import AlertTitle from "./alert_title.svelte";
  import type { AlertVariant } from "./alert.types";
  import type { IconName } from "$lib/components/ui/Icon";
  import { Icon } from "$lib/components/ui/Icon";
  import type { OmitUndefined } from "tailwind-variants";

  type $$Props = HTMLAttributes<HTMLDivElement> & {
    variant?: AlertVariant;
    title: string;
    description: string;
  };

  export let title: string;
  export let description: string;
  export let variant: $$Props["variant"] = "default";

  const variantIconsMap = {
    default: undefined,
    destructive: "Alert",
  } satisfies Record<OmitUndefined<AlertVariant>, IconName | undefined>;

  $: icon = variantIconsMap[variant ?? "default"];
</script>

<AlertContainer {variant} {...$$restProps}>
  {#if icon}
    <Icon name={icon} class="zd-size-5" />
  {/if}
  <AlertTitle>{title}</AlertTitle>
  <AlertDescription>{description}</AlertDescription>
</AlertContainer>
