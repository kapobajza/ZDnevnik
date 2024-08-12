<script lang="ts">
  import { IconButton } from "$lib/components/ui/Button";
  import { Typography } from "$lib/components/ui/Typography";
  import { ProgressBar } from "$lib/components/ui/Progress";
  import { UserAvatar } from "$lib/components/ui/Avatar";
  import { Card } from "$lib/components/ui/Card";
  import type { TeacherStudentsDTO } from "@zdnevnik/toolkit";
  import { useContext } from "$lib/util";

  const { item }: { item: TeacherStudentsDTO } = $props();
  const LL = useContext("LL");
</script>

<Card class="zd-mb-4 zd-flex zd-items-start zd-h-[140px]">
  <div
    class="zd-flex zd-justify-between zd-flex-col zd-items-center zd-mr-4 zd-h-full"
  >
    <UserAvatar src={item.avatar} size="sm" />
    <Typography variant="h2" class="zd-underline">
      {item.ordinalNumber}
    </Typography>
  </div>
  <div class="zd-w-full zd-flex zd-flex-col zd-justify-between zd-h-full">
    <div
      class="zd-border-b zd-border-primary zd-flex zd-justify-between zd-w-full"
    >
      <div>
        <Typography variant="h5">
          {item.firstName}
          {item.lastName}
        </Typography>
        <Typography variant="small" class="zd-text-foreground-150">
          {$LL.home_student_grade_title({
            grade: Math.round(item.averageGrade),
          })}
        </Typography>
      </div>
      <IconButton icon="Edit" size="sm" class="zd-bg-primary-300" />
    </div>
    <div class="zd-flex zd-w-full zd-items-end">
      <div class="zd-w-full zd-mr-4">
        <Typography variant="body_medium" class="zd-text-center">
          {$LL.home_student_average()}
        </Typography>
        <ProgressBar value={item.averageGrade} max={5} />
      </div>
      <div
        class="zd-size-8 zd-rounded-md zd-bg-background-600 zd-flex zd-justify-center zd-items-center"
      >
        <Typography variant="small">
          {item.averageGrade.toFixed(1)}
        </Typography>
      </div>
    </div>
  </div>
</Card>
