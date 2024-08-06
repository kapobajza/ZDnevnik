<script lang="ts">
  import { api } from "$lib/api";
  import { Button } from "$lib/components/ui/Button";
  import { Container } from "$lib/components/ui/Container";
  import { LottiePlayer } from "$lib/components/ui/LottiePlayer";
  import { Typography } from "$lib/components/ui/Typography";
  import { NavBar } from "$lib/components/ui/Nav";
  import { clasroomQuery, createQuery } from "$lib/query";
  import { useContext } from "$lib/util";

  const studentsQuery = createQuery({
    queryKey: clasroomQuery.teacherStudents,
    queryFn: () =>
      api().clasroom.students({
        limit: 10,
        page: 1,
      }),
  });

  const LL = useContext("LL");
</script>

<NavBar title={$LL.home_title()} />
<Container
  isEmpty={$studentsQuery.isEmpty}
  isPending={$studentsQuery.isFetching}
>
  <div
    slot="empty"
    class="zd-h-screen-w-nav-bar zd-m-auto zd-flex zd-flex-col zd-justify-center zd-items-center zd-max-w-[400px]"
  >
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
  </div>
  <pre>{JSON.stringify($studentsQuery.data, null, 2)}</pre>
</Container>
