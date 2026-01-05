<script lang="ts">
  import ScheduleCalendar from "$lib/components/dnd/schedule-calendar.svelte";
  import ScheduleDeleteDialog from "$lib/components/schedule/schedule-delete-dialog.svelte";
  import ScheduleDialog from "$lib/components/schedule/schedule-dialog.svelte";
  import SectionCards from "$lib/components/section/section-cards.svelte";

  import { useSchedules } from "$lib/query/schedule";
  import type { Schedule } from "$lib/types";

  let { data } = $props();

  let showCreateDialog = $state(false);
  let showEditDialog = $state(false);
  let showDeleteDialog = $state(false);
  let selectedSchedule = $state<Schedule | null>(null);

  const schedulesQuery = useSchedules();

  const weddingDate = data.workspace?.weddingDate
    ? new Date(data.workspace.weddingDate)
    : null;
  const daysUntilWedding = weddingDate
    ? Math.ceil((weddingDate.getTime() - Date.now()) / 86_400_000)
    : 0;

  let stats = $derived(
    schedulesQuery.data?.stats ?? {
      totalEvents: 0,
      completedEvents: 0,
      remainingEvents: 0,
      nextEvent: null,
    },
  );

  let overviewCards = $derived.by(() => {
    const nextEventTitle = stats.nextEvent
      ? stats.nextEvent.startTime
      : "No events";
    const nextEventFooter = stats.nextEvent
      ? stats.nextEvent.name
      : "All events completed";

    return [
      {
        title: `${daysUntilWedding === 0 ? "Today" : daysUntilWedding} days to go`,
        description: "Days Until Wedding",
        actionClass: "i-lucide:calendar",
        actionColor: "bg-blue-500 text-white",
        footer: "Until your big day",
      },
      {
        title: stats.completedEvents.toString(),
        description: "Completed Events",
        actionClass: "i-lucide:sparkles",
        actionColor: "bg-purple-500 text-white",
        footer: "Events finished",
      },
      {
        title: nextEventTitle,
        description: "Upcoming Events",
        actionClass: "i-lucide:clock",
        actionColor: "bg-pink-500 text-white",
        footer: nextEventFooter,
      },
      {
        title: stats.remainingEvents.toString(),
        description: "Remaining Events",
        actionClass: "i-lucide:list-checks",
        actionColor: "bg-green-500 text-white",
        footer: "Still to complete",
      },
    ];
  });

  const overviewTitle = "Schedule Overview";

  function handleDialogClose() {
    selectedSchedule = null;
  }

  function handleSuccess() {
    selectedSchedule = null;
    showCreateDialog = false;
    showEditDialog = false;
    schedulesQuery.refetch();
  }

  function handleDeleteSuccess() {
    selectedSchedule = null;
    showDeleteDialog = false;
    schedulesQuery.refetch();
  }
</script>

<div
  class="flex flex-1 flex-col gap-4 py-4 max-w-screen-xl mx-auto w-full px-4"
>
  <SectionCards {overviewCards} {overviewTitle} />
  <ScheduleCalendar />
</div>

<!-- Create Schedule Dialog -->
<ScheduleDialog
  data={selectedSchedule}
  bind:open={showCreateDialog}
  schedule={null}
  onOpenChange={(open) => {
    showCreateDialog = open;
    if (!open) {
      handleDialogClose();
    }
  }}
  onSuccess={handleSuccess}
/>

<!-- Edit Schedule Dialog -->
<ScheduleDialog
  data={selectedSchedule}
  bind:open={showEditDialog}
  schedule={selectedSchedule}
  onOpenChange={(open) => {
    showEditDialog = open;
    if (!open) {
      handleDialogClose();
    }
  }}
  onSuccess={handleSuccess}
/>

<!-- Delete Schedule Dialog -->
<ScheduleDeleteDialog
  bind:open={showDeleteDialog}
  schedule={selectedSchedule}
  onOpenChange={(open) => {
    showDeleteDialog = open;
    if (!open) {
      handleDialogClose();
    }
  }}
  onConfirm={handleDeleteSuccess}
/>
