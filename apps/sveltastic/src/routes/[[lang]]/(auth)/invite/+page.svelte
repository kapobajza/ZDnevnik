<script lang="ts">
  import { Container } from "$lib/components/ui/Container";
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
  class="zd-flex zd-h-screen zd-w-full zd-flex-col zd-items-center zd-justify-center max-sm:zd-mt-8 max-sm:zd-h-auto"
>
  <Typography variant="h4" class="zd-mb-8 zd-text-center">
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html $LL.invite.title()}
  </Typography>
  <form
    method="post"
    class="zd-flex zd-w-full zd-max-w-[500px] zd-flex-col zd-gap-4"
    enctype="multipart/form-data"
    use:enhance
  >
    <AlertFormError {form} />
    <SuperFormInput
      {form}
      name="firstName"
      placeholder={$LL.invite.first_name_placeholder()}
    />
    <SuperFormInput
      {form}
      name="lastName"
      placeholder={$LL.invite.last_name_placeholder()}
    />
    <SuperFormInput
      {form}
      name="password"
      placeholder={$LL.invite.password_placeholder()}
      type="password"
    />
    <SuperFormInput
      {form}
      name="confirmPassword"
      placeholder={$LL.invite.confirm_password_placeholder()}
      type="password"
      containerClass="zd-mb-10"
    />
    <Button type="submit" class="zd-w-full" disabled={$submitting}>
      {$LL.invite.submit_button()}
    </Button>
  </form>
</Container>
