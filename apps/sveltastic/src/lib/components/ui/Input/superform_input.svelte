<script lang="ts" generics="TForm extends Record<string, unknown>">
  import type { SuperForm } from "sveltekit-superforms";
  import Input from "./input.svelte";
  import type { InputEvents, InputProps } from "./input.types";

  type $$Props = Omit<InputProps, "value" | "error" | "form"> & {
    form: SuperForm<TForm, any>;
    name: keyof TForm;
    asChild?: boolean;
  };
  type $$Events = InputEvents;

  let className: $$Props["class"] = undefined;
  export { className as class };

  // Workaround for https://github.com/sveltejs/svelte/issues/9305
  // Fixed in Svelte 5, but not backported to 4.x.
  export let readonly: $$Props["readonly"] = undefined;
  export let containerClass: $$Props["containerClass"] = undefined;

  export let form: SuperForm<TForm>;
  export let name: keyof TForm;
  export let asChild: $$Props["asChild"] = false;

  const { errors, form: sf } = form;

  $: props = {
    class: className,
    name: name as string,
    readonly,
    ...$$restProps,
  };
</script>

{#if asChild}
  <slot {props} />
{:else}
  <Input
    error={($errors[name] as string[] | undefined)?.[0]}
    bind:value={$sf[name]}
    {containerClass}
    {...props}
  />
{/if}
