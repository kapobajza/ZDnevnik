<script lang="ts">
  import { Button } from "$lib/components/ui/Button";
  import { Dialog } from "$lib/components/ui/Dialog";
  import { InputError, SuperFormInput } from "$lib/components/ui/Input";
  import { useContext } from "$lib/util";
  import type { InviteStudentClientBody } from "@zdnevnik/toolkit";
  import type { SuperForm } from "sveltekit-superforms";
  import {
    clasroomQueryKey,
    createClassroomSelectInfiniteQuery,
  } from "$lib/query";
  import { SelectListInfinite } from "$lib/components/ui/Select";
  import { page } from "$app/stores";
  import { useQueryClient } from "@tanstack/svelte-query";
  import { pushState } from "$app/navigation";
  import { AlertFormError } from "$lib/components/ui/Alert";

  const LL = useContext("LL");

  const {
    form,
    open = $bindable(false),
  }: {
    form: SuperForm<InviteStudentClientBody>;
    open: boolean;
  } = $props();
  const { submitting, reset, errors, form: sf, posted } = form;

  const classroomsQuery = createClassroomSelectInfiniteQuery();
  const queryClient = useQueryClient();

  $effect(() => {
    if ($posted && Object.keys($errors ?? {}).length === 0) {
      const classroomId = $page.form.form.data.classroomId;
      queryClient.invalidateQueries({
        queryKey: clasroomQueryKey.teacherStudents(classroomId),
      });
      pushState("", {
        showModal: false,
      });
    }
  });
</script>

<Dialog
  title={$LL.home.add_student_title()}
  contentClass="zd-flex zd-flex-col"
  onDismiss={() => {
    reset();
    pushState("", {
      showModal: false,
    });
  }}
  {open}
>
  {#snippet content()}
    <AlertFormError {form} class="zd-mb-5" />
    <form
      method="post"
      class="zd-flex zd-flex-1 zd-flex-col max-md:zd-justify-between"
      action="?/add-student"
      enctype="multipart/form-data"
      use:form.enhance
    >
      <div class="zd-flex zd-w-full zd-flex-col zd-items-center">
        <div class="zd-mb-8 zd-flex zd-w-full zd-flex-col zd-gap-2">
          <SuperFormInput
            {form}
            name="email"
            placeholder={$LL.home.add_student_email_placeholder()}
          />
          <SuperFormInput name="classroomId" {form} let:props asChild>
            <SelectListInfinite
              selected={{
                value: $sf.classroomId,
              }}
              items={$classroomsQuery.data}
              placeholder={$LL.home.add_student_classroom_placeholder()}
              onSelectedChange={(selected) => {
                if (selected) {
                  $sf.classroomId = selected.value as string;
                }
              }}
            >
              {#snippet renderItem(item)}
                <div>{item.label}</div>
              {/snippet}
            </SelectListInfinite>
            <InputError error={$errors.classroomId?.[0]} />
            <input type="hidden" name={props.name} value={$sf.classroomId} />
          </SuperFormInput>
        </div>
      </div>
      <Button type="submit" disabled={$submitting} class="zd-w-full">
        {$LL.save()}
      </Button>
    </form>
  {/snippet}
</Dialog>
