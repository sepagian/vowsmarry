<script lang="ts">
  import {
    type CalendarEvent,
    createCalendar,
    createViewDay,
    createViewList,
    createViewMonthAgenda,
    createViewMonthGrid,
    createViewWeek,
  } from "@schedule-x/calendar";
  import { createCurrentTimePlugin } from "@schedule-x/current-time";
  import { createResizePlugin } from "@schedule-x/resize";
  import { ScheduleXCalendar } from "@schedule-x/svelte";
  import "@schedule-x/theme-shadcn/dist/index.css";
  import "temporal-polyfill/global";
  import { onMount } from "svelte";

  import { Card } from "$lib/components/ui/card";
  import { Skeleton } from "$lib/components/ui/skeleton";

  import { calendarFiltersState } from "$lib/stores/calendar.svelte";
  import {
    transformExpenses,
    transformSchedules,
    transformTasks,
    type UnifiedCalendarEvent,
  } from "$lib/utils/calendar-transform";
  import toastService from "$lib/utils/toasts";

  import { useExpenses } from "$lib/query/expense";
  import { useSchedules } from "$lib/query/schedule";
  import { useTasks } from "$lib/query/task";

  import { calendars } from "./calendar";
  import CalendarEventDetail from "./calendar-event-detail.svelte";
  import CalendarFilters from "./calendar-filters.svelte";

  const schedulesQuery = useSchedules();
  const tasksQuery = useTasks();
  const expensesQuery = useExpenses();

  let selectedEvent = $state<UnifiedCalendarEvent | null>(null);
  let modalOpen = $state(false);

  let calendarApp = $state<ReturnType<typeof createCalendar>>();

  let isLoading = $derived(
    schedulesQuery.isPending || tasksQuery.isPending || expensesQuery.isPending,
  );

  let hasError = $derived(
    schedulesQuery.isError || tasksQuery.isError || expensesQuery.isError,
  );

  let schedules = $derived(schedulesQuery.data?.schedules ?? []);
  let tasks = $derived(tasksQuery.data?.tasks ?? []);
  let expenses = $derived(expensesQuery.data?.expenses ?? []);

  let unifiedEvents = $derived.by(() => {
    const events: UnifiedCalendarEvent[] = [];

    if (calendarFiltersState.filters.showSchedules) {
      try {
        const scheduleEvents = transformSchedules(schedules);
        events.push(...scheduleEvents);
      } catch (error) {
        console.error("Error transforming schedules:", error);
      }
    }

    if (calendarFiltersState.filters.showTasks) {
      try {
        const taskEvents = transformTasks(tasks);
        events.push(...taskEvents);
      } catch (error) {
        console.error("Error transforming tasks:", error);
      }
    }

    if (calendarFiltersState.filters.showExpenses) {
      try {
        const expenseEvents = transformExpenses(expenses);
        events.push(...expenseEvents);
      } catch (error) {
        console.error("Error transforming expenses:", error);
      }
    }

    if (calendarFiltersState.filters.showOverdueOnly) {
      return events.filter((event) => event.isOverdue === true);
    }

    return events;
  });

  let hasEvents = $derived(unifiedEvents.length > 0);

  function transformToCalendarEvents(
    events: UnifiedCalendarEvent[],
  ): CalendarEvent[] {
    try {
      if (!Array.isArray(events)) {
        console.error(
          "transformToCalendarEvents: Expected array, received:",
          typeof events,
        );
        return [];
      }

      return events
        .map((event) => {
          try {
            const calendarEvent: CalendarEvent = {
              id: event.id,
              title: event.title,
              start: event.start,
              end: event.end,
              calendarId: event.calendarId,
            };

            if (event.description) {
              calendarEvent.description = event.description;
            }

            return calendarEvent;
          } catch (error) {
            console.error(
              "Error transforming individual event:",
              event.id,
              error,
            );
            return null;
          }
        })
        .filter((event): event is CalendarEvent => event !== null);
    } catch (error) {
      console.error("Critical error in transformToCalendarEvents:", error);
      toastService.error("Failed to display calendar events");
      return [];
    }
  }

  $effect(() => {
    if (!calendarApp) {
      return;
    }

    try {
      const events = transformToCalendarEvents(unifiedEvents);
      calendarApp.events.set(events);
    } catch (error) {
      console.error("Error updating calendar events:", error);
      toastService.error("Failed to update calendar events");
    }
  });

  onMount(() => {
    try {
      calendarApp = createCalendar({
        calendars,
        views: [
          createViewDay(),
          createViewMonthGrid(),
          createViewMonthAgenda(),
          createViewWeek(),
          createViewList(),
        ],
        weekOptions: {
          timeAxisFormatOptions: { hour: "2-digit", minute: "2-digit" },
          eventOverlap: true,
        },
        locale: "id-ID",
        timezone: "Asia/Makassar",
        defaultView: "viewList",
        theme: "shadcn",
        plugins: [
          createCurrentTimePlugin({ fullWeekWidth: true }),
          createResizePlugin(30),
        ],
        callbacks: {
          onEventClick(calendarEvent) {
            const event = unifiedEvents.find((e) => e.id === calendarEvent.id);
            if (event) {
              selectedEvent = event;
              modalOpen = true;
            }
          },
        },
        events: [],
      });
    } catch (error) {
      console.error("Error initializing calendar:", error);
      toastService.error("Failed to initialize calendar");
    }
  });

  function handleModalClose() {
    modalOpen = false;
    selectedEvent = null;
  }
</script>

<!-- Calendar Filters -->
{#if !isLoading}
  <CalendarFilters />
{/if}

<!-- Loading State -->
{#if isLoading}
  <div class="px-4 space-y-4">
    <Card class="p-4">
      <Skeleton class="h-6 w-48 mb-4" />
      <div class="space-y-3">
        <Skeleton class="h-10 w-full" />
        <Skeleton class="h-10 w-full" />
        <Skeleton class="h-10 w-full" />
        <Skeleton class="h-10 w-full" />
      </div>
    </Card>

    <Card class="p-4">
      <Skeleton class="h-12 w-full mb-4" />
      <div class="space-y-2">
        <Skeleton class="h-20 w-full" />
        <Skeleton class="h-20 w-full" />
        <Skeleton class="h-20 w-full" />
        <Skeleton class="h-20 w-full" />
      </div>
    </Card>
  </div>
{/if}

<!-- Error State -->
{#if hasError && !isLoading}
  <div class="px-4 mt-4">
    <Card class="p-6">
      <div
        class="flex flex-col items-center justify-center text-center space-y-4"
      >
        <div class="i-lucide:alert-circle w-12 h-12 text-red-500"></div>
        <div>
          <h3 class="text-lg font-semibold text-red-700 dark:text-red-400">
            Calendar Error
          </h3>
          <p class="text-sm text-muted-foreground mt-2">
            Failed to load calendar data. Please try again.
          </p>
        </div>
        <button
          class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          onclick={() => {
            schedulesQuery.refetch();
            tasksQuery.refetch();
            expensesQuery.refetch();
          }}
        >
          <span class="i-lucide:refresh-cw w-4 h-4 inline-block mr-2"></span>
          Retry
        </button>
      </div>
    </Card>
  </div>
{/if}

<!-- Empty State -->
{#if !isLoading && !hasError && !hasEvents}
  <div class="px-4 mt-4">
    <Card class="p-6 shadow-none">
      <div
        class="flex flex-col items-center justify-center text-center space-y-4 py-8"
      >
        <div
          class="i-lucide:calendar-off w-16 h-16 text-muted-foreground"
        ></div>
        <div>
          <h3 class="text-lg font-semibold">No Events Found</h3>
          <p class="text-sm text-muted-foreground mt-2">
            There are no events to display in the calendar. Try adjusting your
            filters or add some schedules, tasks, or expenses.
          </p>
        </div>
        <div class="flex flex-col sm:flex-row gap-2 mt-4">
          <a
            href="/dashboard/schedules"
            class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 inline-flex items-center gap-2"
          >
            <span class="i-lucide:calendar-plus w-4 h-4"></span>
            Add Schedule
          </a>
          <a
            href="/dashboard/task"
            class="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 inline-flex items-center gap-2"
          >
            <span class="i-lucide:check-square w-4 h-4"></span>
            Add Task
          </a>
          <a
            href="/dashboard/finance"
            class="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 inline-flex items-center gap-2"
          >
            <span class="i-lucide:dollar-sign w-4 h-4"></span>
            Add Expense
          </a>
        </div>
      </div>
    </Card>
  </div>
{/if}

<!-- Calendar -->
{#if !isLoading && !hasError && hasEvents && calendarApp}
  <div class="px-4 mt-4">
    <ScheduleXCalendar {calendarApp} />
  </div>
{/if}

<!-- Event Detail Modal -->
<CalendarEventDetail
  bind:event={selectedEvent}
  bind:open={modalOpen}
  onClose={handleModalClose}
/>
