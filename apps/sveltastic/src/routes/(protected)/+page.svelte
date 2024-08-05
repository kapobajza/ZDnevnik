<script lang="ts">
  import { createQuery } from "@tanstack/svelte-query";
  import { api } from "$lib/api";
  import { clasroomQuery } from "$lib/query";

  const studentsRes = createQuery({
    queryKey: clasroomQuery.teacherStudents,
    queryFn: () =>
      api().clasroom.students({
        limit: 10,
        page: 1,
      }),
  });
</script>

{#if $studentsRes.isPending}
  Loading...
{:else if $studentsRes.error}
  Error
{:else if $studentsRes.data}
  {JSON.stringify($studentsRes.data)}
{/if}
