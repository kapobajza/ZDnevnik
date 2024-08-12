<script context="module" lang="ts">
  import Button from "./button.svelte";

  import { defineMeta, type Args } from "@storybook/addon-svelte-csf";
  import IconButton from "./icon_button.svelte";
  import type { IconName } from "$lib/components/ui/Icon";
  import * as allIcons from "$lib/components/ui/Icon/svg";
  import type { IconButtonSize } from "./button.types";

  const { Story } = defineMeta<{
    iconName: IconName;
    iconButtonSize: IconButtonSize;
  }>({
    title: "Components/Button",
    component: Button,
    tags: ["autodocs"],
    argTypes: {
      iconName: {
        control: "select",
        options: Object.keys(allIcons),
      },
      iconButtonSize: {
        control: "select",
        options: ["sm", "md"] as IconButtonSize[],
      },
    },
  });
</script>

<Story name="Primary">
  <Button variant="primary">Primary</Button>
</Story>

<Story name="Primary Disabled">
  <Button disabled>Primary disabled</Button>
</Story>

<Story
  name="Button with icon"
  args={{
    iconName: "Alert",
    iconButtonSize: "md",
  }}
>
  {#snippet children(args: Args<typeof Story>)}
    <IconButton
      icon={args.iconName}
      size={args.iconButtonSize}
      class="zd-bg-primary-300"
    />
  {/snippet}
</Story>
