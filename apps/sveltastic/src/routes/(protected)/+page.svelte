<script lang="ts">
  import { Button } from "$lib/components/ui/Button";
  import { Container } from "$lib/components/ui/Container";
  import { LottiePlayer } from "$lib/components/ui/LottiePlayer";
  import { Typography } from "$lib/components/ui/Typography";
  import { NavBar } from "$lib/components/ui/Nav";
  import {
    studentsQueryOptions,
    createInfiniteQuery,
    createMeQueryCached,
  } from "$lib/query";
  import { useContext } from "$lib/util";
  import { UserRole } from "@zdnevnik/toolkit";
  import { List } from "$lib/components/ui/List";
  import { StudentCard } from "$lib/components/routes/Home";
  import { Dialog } from "$lib/components/ui/Dialog";

  const studentsQuery = createInfiniteQuery(studentsQueryOptions());
  const meQuery = createMeQueryCached();

  const LL = useContext("LL");
</script>

<NavBar title={$LL.home_title()} />
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
          {$LL.home_no_students_found()}
        </Typography>
        <Dialog>
          {#snippet trigger(openModal)}
            <Button class="zd-w-full" onclick={openModal}>
              {$LL.home_add_student()}
            </Button>
          {/snippet}

          {#snippet content()}
            <p>Content</p>
          {/snippet}
        </Dialog>
      {/if}
    </div>
  {/snippet}
  {#if $studentsQuery.extraData?.name}
    <Typography variant="h3" class="zd-mb-6">
      {$studentsQuery.extraData.name}
    </Typography>
  {/if}
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
