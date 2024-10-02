<script lang="ts">
  import { Select as SelectPrimitive } from "bits-ui";
  import { Container } from "$lib/components/ui/Container";
  import { LottiePlayer } from "$lib/components/ui/LottiePlayer";
  import { Typography } from "$lib/components/ui/Typography";
  import { NavBar } from "$lib/components/ui/Nav";
  import {
    createInfiniteQuery,
    createMeQueryCached,
    defaultInfiniteQueryOptions,
    clasroomQueryKey,
    createClassroomSelectInfiniteQuery,
  } from "$lib/query";
  import { useContext } from "$lib/util";
  import { UserRole } from "@zdnevnik/toolkit";
  import type { ClasroomStudentsDTO } from "@zdnevnik/toolkit";
  import { List } from "$lib/components/ui/List";
  import { AddStudentModal, StudentCard } from "$lib/components/routes/Home";
  import { superForm } from "sveltekit-superforms";
  import type { PageData } from "./$types";
  import SelectListInfinite from "$lib/components/ui/Select/select_list_infinite.svelte";
  import { api } from "$lib/api";
  import { Icon } from "$lib/components/ui/Icon";

  type $$Props = PageData;
  export let data: $$Props;

  let selectedClassroom: ClasroomStudentsDTO["classroom"] | undefined;
  let classroom: ClasroomStudentsDTO["classroom"] | undefined;

  $: studentsQuery = createInfiniteQuery({
    queryKey: clasroomQueryKey.teacherStudents(selectedClassroom?.id),
    queryFn: ({ limit, page }) =>
      api().clasroom.students({
        classroomId: selectedClassroom?.id,
        page,
        limit,
      }),
    ...defaultInfiniteQueryOptions,
  });

  $: classroom = selectedClassroom ?? $studentsQuery.extraData;

  const meQuery = createMeQueryCached();
  const classroomsQuery = createClassroomSelectInfiniteQuery();

  const LL = useContext("LL");
  const form = superForm(data.form);
</script>

<NavBar>
  {#snippet content()}
    {#if classroom?.name}
      <SelectListInfinite
        items={$classroomsQuery.data}
        selected={{
          value: classroom?.id ?? "",
          label: classroom?.name ?? "",
        }}
        onSelectedChange={(selected) => {
          if (selected) {
            selectedClassroom = {
              id: selected.value as string,
              name: selected.label ?? "",
            };
          }
        }}
        contentProps={{
          sameWidth: false,
        }}
      >
        {#snippet trigger()}
          <SelectPrimitive.Trigger class="zd-flex zd-items-center zd-gap-1">
            <Typography variant="h3" class="zd-text-primary-foreground">
              {classroom?.name}
            </Typography>
            <Icon name="ChevronDown" class="zd-text-primary-foreground" />
          </SelectPrimitive.Trigger>
        {/snippet}
        {#snippet renderItem(item)}
          <div>{item.label}</div>
        {/snippet}
      </SelectListInfinite>
    {/if}
  {/snippet}
</NavBar>
<Container
  isEmpty={$studentsQuery.isEmpty}
  isPending={$studentsQuery.isPending}
  class="zd-pt-4"
>
  {#snippet empty()}
    <div
      class="zd-m-auto zd-flex zd-h-screen-w-nav-bar zd-max-w-[400px] zd-flex-col zd-items-center zd-justify-center"
    >
      {#if $meQuery.data?.role === UserRole.Teacher}
        <LottiePlayer
          src={"/lottie/empty_results.json"}
          class="zd-max-h-9 zd-w-full"
          autoplay
          loop
        />
        <Typography variant="h4" class="zd-mb-8 zd-text-center">
          {$LL.home.no_students_found()}
        </Typography>
        <AddStudentModal {form} />
      {/if}
    </div>
  {/snippet}
  <List
    data={$studentsQuery.data}
    onEndReached={$studentsQuery.fetchNextPage}
    hasNextPage={$studentsQuery.hasNextPage}
    isLoadingMore={$studentsQuery.isFetchingNextPage}
  >
    {#snippet renderItem(item)}
      <StudentCard {item} />
    {/snippet}
  </List>
</Container>
