<script lang="ts">
  import { Container } from "$lib/components/ui/Container";
  import ZDnevnikLogo from "$lib/assets/login/zdnevnik_logo.png?enhanced";
  import { Typography } from "$lib/components/ui/Typography";
  import { Input } from "$lib/components/ui/Input";
  import { Button } from "$lib/components/ui/Button";
  import { superForm } from "sveltekit-superforms";
  import type { PageData } from "./$types";
  import { Alert } from "$lib/components/ui/Alert";
  import { slide } from "svelte/transition";
  import { useContext } from "$lib/util";

  export let data: PageData;
  const LL = useContext("LL");
  const { errors, enhance, form } = superForm(data.form);
</script>

<Container
  class="zd-h-screen zd-w-full zd-flex zd-justify-center zd-items-center zd-flex-col"
>
  <enhanced:img
    src={ZDnevnikLogo}
    class="zd-w-full zd-h-[256px] zd-mb-16 zd-object-contain"
    alt="ZDnevnik Logo"
  />
  <Typography variant="h4" class="zd-mb-8 zd-text-center">
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html $LL.login_title()}
  </Typography>
  <form method="post" class="zd-w-full zd-max-w-[500px]" use:enhance>
    {#if $errors._errors?.[0]}
      <div in:slide out:slide>
        <Alert
          variant="destructive"
          class="zd-mb-8"
          title={$LL.error_title()}
          description={$errors._errors?.[0]}
        />
      </div>
    {/if}
    <Input
      name="username"
      placeholder={$LL.login_username_placeholder()}
      containerClass="zd-mb-4"
      error={$errors.username?.[0]}
      bind:value={$form.username}
    />
    <Input
      name="password"
      placeholder={$LL.login_password_placeholder()}
      type="password"
      containerClass="zd-mb-14"
      error={$errors.password?.[0]}
      bind:value={$form.password}
    />
    <Button type="submit" class="zd-w-full">
      {$LL.login_submit_button()}
    </Button>
  </form>
</Container>
