<script lang="ts">
  import { Container } from "$lib/components/ui/Container";
  import ZDnevnikLogo from "$lib/assets/login/zdnevnik_logo.png?enhanced";
  import { Typography } from "$lib/components/ui/Typography";
  import { Input } from "$lib/components/ui/Input";
  import { Button } from "$lib/components/ui/Button";
  import { superForm } from "sveltekit-superforms";
  import type { PageData } from "./$types";
  import { ErrorResponseCode } from "@zdnevnik/toolkit";
  import { Alert } from "$lib/components/ui/Alert";
  import { slide } from "svelte/transition";

  export let data: PageData;
  const { errors, enhance, form } = superForm(data.form);
</script>

<Container
  class="zd-h-screen zd-w-full zd-flex zd-justify-center zd-items-center zd-flex-col"
>
  <enhanced:img
    src={ZDnevnikLogo}
    class="zd-w-full zd-h-[256px] zd-mb-16 zd-object-contain"
  />
  <Typography variant="h4" class="zd-mb-8 zd-text-center">
    Prijavi se i odgovori na pitanje{" "}
    <span class="zd-text-primary">"Koji si ti broj"</span>?
  </Typography>
  <form method="post" class="zd-w-full zd-max-w-[500px]" use:enhance>
    {#if $errors._errors?.[0] === ErrorResponseCode.INVALID_CREDENTIALS}
      <div in:slide out:slide>
        <Alert
          variant="destructive"
          class="zd-mb-8"
          title="Greška"
          description="Pogrešno korisničko ime ili lozinka"
        />
      </div>
    {/if}
    <Input
      name="username"
      placeholder="Korisničko ime"
      containerClass="zd-mb-4"
      error={$errors.username?.[0]}
      bind:value={$form.username}
    />
    <Input
      name="password"
      placeholder="Lozinka"
      type="password"
      containerClass="zd-mb-14"
      error={$errors.password?.[0]}
      bind:value={$form.password}
    />
    <Button type="submit" class="zd-w-full">Prijava</Button>
  </form>
</Container>
