<script context="module" lang="ts">
  import Typography from "./typography.svelte";

  import { defineMeta } from "@storybook/addon-svelte-csf";

  const { Story } = defineMeta({
    title: "Components/Typography",
    component: Typography,
    tags: ["autodocs"],
  });
</script>

<Story name="Typography elements">
  <Typography variant="h1">H1 element</Typography>
  <Typography variant="h2">H2 element</Typography>
  <Typography variant="h3">H3 element</Typography>
  <Typography variant="h4">H4 element</Typography>
  <Typography variant="blockquote">blockquote element</Typography>
  <Typography variant="body_medium">body_medium element</Typography>
  <Typography variant="large">large element</Typography>
  <Typography variant="lead">lead element</Typography>
  <Typography variant="list">list element</Typography>
  <Typography variant="p">p element</Typography>
  <Typography variant="p_ui">p_ui element</Typography>
  <div>
    <Typography variant="emphasize">emphasize element</Typography>
  </div>
  <div>
    <Typography variant="inline_code">inline_code element</Typography>
  </div>
  <div>
    <Typography variant="small">small element</Typography>
  </div>
  <Typography variant="table_item">table_item element</Typography>
  <Typography variant="table_head">table_head element</Typography>
  <Typography variant="subtle">subtle element</Typography>
</Story>
