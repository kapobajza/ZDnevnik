<script lang="ts">
  import { Typography } from "$lib/components/ui/Typography";
  export let error: string | undefined;
</script>

{#if error}
  <Typography variant="small" class="zd-text-destructive">{error}</Typography>
{/if}
