<script lang="ts">
  import { Container } from "$lib/components/ui/Container";
  import ZDnevnikLogo from "$lib/assets/login/zdnevnik_logo.png?enhanced";
  import { Typography } from "$lib/components/ui/Typography";
  import { SuperFormInput } from "$lib/components/ui/Input";
  import { Button } from "$lib/components/ui/Button";
  import { superForm } from "sveltekit-superforms";
  import type { PageData } from "./$types";
  import { AlertFormError } from "$lib/components/ui/Alert";
  import { useContext } from "$lib/util";

  const {
    data,
  }: {
    data: PageData;
  } = $props();

  const form = superForm(data.form);
  const { enhance, submitting } = form;
  const LL = useContext("LL");
</script>

<Container
  class="zd-flex zd-h-screen zd-w-full zd-flex-col zd-items-center zd-justify-center"
>
  <enhanced:img
    src={ZDnevnikLogo}
    class="zd-mb-16 zd-h-[256px] zd-w-full zd-object-contain"
    alt="ZDnevnik Logo"
  />
  <Typography variant="h4" class="zd-mb-8 zd-text-center">
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html $LL.login.title()}
  </Typography>
  <form method="post" class="zd-w-full zd-max-w-[500px]" use:enhance>
    <AlertFormError {form} />
    <SuperFormInput
      {form}
      name="username"
      placeholder={$LL.login.username_placeholder()}
      containerClass="zd-mb-4"
    />
    <SuperFormInput
      {form}
      name="password"
      placeholder={$LL.login.password_placeholder()}
      type="password"
      containerClass="zd-mb-14"
    />
    <Button type="submit" class="zd-w-full" disabled={$submitting}>
      {$LL.login.submit_button()}
    </Button>
  </form>
</Container>
