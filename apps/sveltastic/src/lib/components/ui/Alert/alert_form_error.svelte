<script lang="ts" generics="TForm extends Record<string, unknown>">
  import { slide } from "svelte/transition";
  import Alert from "./alert.svelte";
  import { useContext } from "$lib/util";
  import type { SuperForm } from "sveltekit-superforms";
  import { cn } from "$lib/utils";

  const {
    form,
    class: className,
  }: {
    form: SuperForm<TForm>;
    class?: string;
  } = $props();

  const { errors } = form;
  const LL = useContext("LL");
</script>

{#if $errors._errors?.[0]}
  <div in:slide out:slide>
    <Alert
      variant="destructive"
      class={cn("zd-mb-8", className)}
      title={$LL.error_title()}
      description={$errors._errors?.[0]}
    />
  </div>
{/if}
