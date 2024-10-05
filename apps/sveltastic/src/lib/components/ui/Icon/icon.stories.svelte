<script context="module" lang="ts">
  import Icon from "./icon.svelte";
  import * as allIcons from "./svg";
  import { type IconName } from "./icon.types";
  import { defineMeta, type Args } from "@storybook/addon-svelte-csf";

  const { Story } = defineMeta<{ iconColor: string }>({
    title: "Components/Icon",
    component: Icon,

    argTypes: {
      iconName: {
        control: "select",
        options: Object.keys(allIcons),
      },
    },
  });
</script>

<Story
  name="All icons"
  args={{
    iconColor: "blue",
  }}
>
  {#snippet children(args: Args<typeof Story>)}
    <div
      class="zd-flex zd-flex-wrap zd-gap-2 [&>svg]:zd-size-[48px]"
      style={`color: ${args.iconColor}`}
    >
      {#each Object.keys(allIcons) as iconName (iconName)}
        <Icon name={iconName as IconName} />
      {/each}
    </div>
  {/snippet}
</Story>

<Story
  name="Single icon"
  args={{
    iconColor: "blue",
    iconName: "Alert",
    iconSize: 64,
  }}
>
  {#snippet children(args: Args<typeof Story>)}
    <Icon
      name={args.iconName}
      style={`color: ${args.iconColor}; width: ${args.iconSize}; height: ${args.iconSize};`}
    />
  {/snippet}
</Story>
