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

  const studentsQuery = createInfiniteQuery(studentsQueryOptions());
  const meQuery = createMeQueryCached();

  const LL = useContext("LL");
</script>

<NavBar title={$LL.home_title()} />
<Container
  isEmpty={$studentsQuery.isEmpty}
  isPending={$studentsQuery.isPending}
>
  {#snippet empty()}
    <div
      class="zd-h-screen-w-nav-bar zd-m-auto zd-flex zd-flex-col zd-justify-center zd-items-center zd-max-w-[400px]"
    >
      {#if $meQuery.data?.role === UserRole.Teacher}
        <LottiePlayer
          src={"/lottie/empty_results.json"}
          class="zd-w-full zd-max-h-9"
          autoplay
          loop
        />
        <Typography variant="h4" class="zd-text-center zd-mb-8">
          {$LL.home_no_students_found()}
        </Typography>
        <Button class="zd-w-full">
          {$LL.home_add_student()}
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
      <div
        class="zd-border zd-border-primary-foreground zd-w-full zd-rounded-sm zd-mb-4 zd-p-4 first:zd-mt-6"
      >
        <Typography variant="h3" class="zd-mb-3">
          {item.firstName}
          {item.lastName}
        </Typography>
        <div
          class="zd-size-14 zd-border zd-rounded-full zd-border-foreground zd-flex zd-items-center zd-justify-center"
        >
          <Typography variant="h2">
            {item.averageGrade}
          </Typography>
        </div>
      </div>
    {/snippet}
  </List>
</Container>
