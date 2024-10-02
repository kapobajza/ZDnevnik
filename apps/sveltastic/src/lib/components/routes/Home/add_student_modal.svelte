<script lang="ts">
  import { Button } from "$lib/components/ui/Button";
  import { Dialog } from "$lib/components/ui/Dialog";
  import { Icon } from "$lib/components/ui/Icon";
  import { InputError, SuperFormInput } from "$lib/components/ui/Input";
  import { useContext } from "$lib/util";
  import type { AddStudentWithFileBody } from "@zdnevnik/toolkit";
  import type { SuperForm } from "sveltekit-superforms";
  import { fileProxy } from "sveltekit-superforms";
  import DefaultAvatar from "$lib/assets/default_avatar.png?enhanced";
  import { createClassroomSelectInfiniteQuery } from "$lib/query";
  import { SelectListInfinite } from "$lib/components/ui/Select";

  const LL = useContext("LL");

  const {
    form,
  }: {
    form: SuperForm<AddStudentWithFileBody>;
  } = $props();
  const { submitting, reset, errors, form: sf } = form;
  const file = fileProxy(form, "avatar");

  let imagePreview = $derived.by(() => {
    const selectedFile = $file.item?.(0);

    if (selectedFile) {
      return URL.createObjectURL(selectedFile);
    }

    return undefined;
  });

  const classroomsQuery = createClassroomSelectInfiniteQuery();
</script>

<Dialog
  title={$LL.home.add_student_title()}
  contentClass="zd-flex zd-flex-col"
  onDismiss={() => {
    reset();
  }}
>
  {#snippet trigger(openModal)}
    <Button class="zd-w-full" onclick={openModal}>
      {$LL.home.add_student()}
    </Button>
  {/snippet}

  {#snippet content()}
    <form
      method="post"
      class="zd-flex zd-flex-1 zd-flex-col max-md:zd-justify-between"
      action="?/add-student"
      enctype="multipart/form-data"
      use:form.enhance
    >
      <div class="zd-flex zd-w-full zd-flex-col zd-items-center">
        <div class="zd-mb-3 zd-flex zd-flex-col zd-items-center zd-gap-1">
          <label
            class="zd-relative zd-flex zd-size-[120px] zd-cursor-pointer zd-items-center zd-justify-center zd-rounded-full zd-opacity-95 zd-transition-opacity hover:zd-opacity-100"
          >
            <SuperFormInput
              {form}
              name="avatar"
              class="zd-hidden"
              asChild
              let:props
            >
              <input
                type="file"
                bind:files={$file}
                accept="image/jpg, image/jpeg, image/png"
                {...props}
              />
            </SuperFormInput>
            <enhanced:img
              src={imagePreview ?? DefaultAvatar}
              class="zd-size-full zd-rounded-full"
              alt="Avatar"
            />
            <div
              class="zd-absolute zd-size-full zd-rounded-full zd-bg-foreground/35"
            ></div>
            <div
              class="zd-absolute zd-flex zd-size-10 zd-items-center zd-justify-center zd-rounded-full zd-bg-primary-foreground"
            >
              <Icon name="Pencil" class="zd-text-foreground" />
            </div>
          </label>
          <InputError error={$errors.avatar?.[0]} />
        </div>
        <div class="zd-mb-8 zd-flex zd-w-full zd-flex-col zd-gap-2">
          <SuperFormInput
            {form}
            name="firstName"
            placeholder={$LL.home.add_student_first_name_placeholder()}
          />
          <SuperFormInput
            {form}
            name="lastName"
            placeholder={$LL.home.add_student_last_name_placeholder()}
          />
          <SuperFormInput
            {form}
            name="ordinalNumber"
            placeholder={$LL.home.add_student_ordinal_number_placeholder()}
            type="number"
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
