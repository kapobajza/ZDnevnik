<script lang="ts">
  import { Select as SelectPrimitive } from "bits-ui";
  import { cn } from "$lib/utils.js";

  const { class: className, ...restProps }: SelectPrimitive.SeparatorProps =
    $props();
</script>

<SelectPrimitive.Separator
  class={cn("-zd-mx-1 zd-my-1 zd-h-px zd-bg-muted", className)}
  {...restProps}
/>
