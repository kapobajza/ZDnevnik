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
  import { List } from "$lib/components/ui/List";
  import { AddStudentModal, StudentCard } from "$lib/components/routes/Home";
  import { superForm } from "sveltekit-superforms";
  import type { PageData } from "./$types";
  import SelectListInfinite from "$lib/components/ui/Select/select_list_infinite.svelte";
  import { api } from "$lib/api";
  import { Icon } from "$lib/components/ui/Icon";
  import { page } from "$app/stores";
  import { goto, pushState } from "$app/navigation";
  import { browser } from "$app/environment";
  import { onMount } from "svelte";
  import { Button, IconButton } from "$lib/components/ui/Button";

  type $$Props = PageData;
  export let data: $$Props;

  function gotoClassroom(id: string) {
    const query = new URLSearchParams($page.url.searchParams.toString());
    query.set("classroomId", id);
    goto(`?${query.toString()}`);
  }

  let classroomId: string | undefined;
  $: classroomId = $page.url.searchParams.get("classroomId") ?? undefined;

  $: studentsQuery = createInfiniteQuery({
    queryKey: clasroomQueryKey.teacherStudents(classroomId),
    queryFn: ({ limit, page }) =>
      api().clasroom.students({
        classroomId: classroomId,
        page,
        limit,
      }),
    ...defaultInfiniteQueryOptions,
  });

  onMount(() => {
    if (browser && $studentsQuery?.extraData?.id) {
      gotoClassroom($studentsQuery?.extraData?.id);
    }
  });

  const meQuery = createMeQueryCached();
  const classroomsQuery = createClassroomSelectInfiniteQuery();

  const LL = useContext("LL");
  const form = superForm(data.form);

  function openModal() {
    pushState("", {
      showModal: true,
    });
  }
</script>

<NavBar>
  {#snippet content()}
    {#if $studentsQuery.extraData?.name}
      <SelectListInfinite
        items={$classroomsQuery.data}
        selected={{
          value: $studentsQuery.extraData?.id ?? "",
          label: $studentsQuery.extraData?.name ?? "",
        }}
        onSelectedChange={(selected) => {
          if (selected) {
            const id = `${selected.value}`;
            gotoClassroom(id);
          }
        }}
        contentProps={{
          sameWidth: false,
        }}
      >
        {#snippet trigger()}
          <SelectPrimitive.Trigger class="zd-flex zd-items-center zd-gap-1">
            <Typography variant="h3" class="zd-text-primary-foreground">
              {$studentsQuery.extraData?.name}
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
  isError={$studentsQuery.isError}
  error={$studentsQuery.error}
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

        <Button class="zd-w-full" onclick={openModal}>
          {$LL.home.add_student()}
        </Button>
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
  <IconButton
    icon="Plus"
    class="zd-fixed zd-bottom-4 zd-right-2"
    onclick={openModal}
  />
  <AddStudentModal {form} open={$page.state.showModal} />
</Container>
