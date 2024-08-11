<script context="module" lang="ts">
  import UserAvatar from "./user_avatar.svelte";
  import { type AvatarSize } from "./avatar.types";

  import {
    defineMeta,
    type Args,
    setTemplate,
  } from "@storybook/addon-svelte-csf";

  const { Story } = defineMeta<{ avatarSize: AvatarSize }>({
    title: "Components/Avatar",
    component: UserAvatar,
    tags: ["autodocs"],
    argTypes: {
      avatarSize: {
        control: "select",
        options: ["xs", "sm", "md", "lg", "xl"] as AvatarSize[],
      },
    },
  });
</script>

<script>
  setTemplate(template);
</script>

{#snippet template(args: Args<typeof Story>)}
  <UserAvatar src={args.src} size={args.avatarSize} />
{/snippet}

<Story
  name="User avatar without src"
  args={{
    src: null,
    avatarSize: "md",
  }}
/>

<Story
  name="User avatar with src"
  args={{
    src: "https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg",
    avatarSize: "md",
  }}
/>
