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

	import { calendarState } from "$lib/stores/calendar.svelte";
	import { expensesState } from "$lib/stores/expenses.svelte";
	import { tasksState } from "$lib/stores/tasks.svelte";
	import toastService from "$lib/utils/toasts";

	import type {
		Expense,
		Schedule,
		Task,
		UnifiedCalendarEvent,
	} from "$lib/types";

	import { calendars } from "./calendar";
	import CalendarEventDetail from "./calendar-event-detail.svelte";
	import CalendarFilters from "./calendar-filters.svelte";

	// Props from parent component
	let {
		schedules = [],
		tasks = [],
		expenses = [],
		workspaceId = null,
	}: {
		schedules: Schedule[];
		tasks: Task[];
		expenses: Expense[];
		workspaceId?: string | null;
	} = $props();

	// State for selected event and modal
	let selectedEvent = $state<UnifiedCalendarEvent | null>(null);
	let modalOpen = $state(false);

	// Loading and error states
	let isLoading = $state(true);
	let hasError = $state(false);
	let errorMessage = $state<string | null>(null);

	// Create calendar instance - initialized in onMount to avoid SSR issues
	let calendarApp = $state<ReturnType<typeof createCalendar>>();

	// Transform unified events to @schedule-x CalendarEvent format
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

						// Add description if available
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

	// Update calendar events when unified events change
	$effect(() => {
		if (!calendarApp) {
			return; // Guard against SSR
		}

		try {
			const events = transformToCalendarEvents(calendarState.unifiedEvents);
			calendarApp.events.set(events);
			hasError = false;
			errorMessage = null;
		} catch (error) {
			console.error("Error updating calendar events:", error);
			hasError = true;
			errorMessage = "Failed to update calendar events";
			toastService.error("Failed to update calendar events");
		}
	});

	// Initialize calendar and stores on mount (client-side only)
	onMount(() => {
		try {
			// Create calendar instance
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
						// Find the unified event by ID
						const event = calendarState.unifiedEvents.find(
							(e) => e.id === calendarEvent.id,
						);
						if (event) {
							selectedEvent = event;
							modalOpen = true;
						}
					},
				},
				events: [],
			});

			// Initialize stores with workspace context
			// Clear stores if workspace changed to prevent stale data
			if (!calendarState.isWorkspace(workspaceId)) {
				calendarState.clearWorkspace();
			}
			if (!tasksState.isWorkspace(workspaceId)) {
				tasksState.clearWorkspace();
			}
			if (!expensesState.isWorkspace(workspaceId)) {
				expensesState.clearWorkspace();
			}

			calendarState.setSchedules(schedules || [], workspaceId);
			tasksState.set(tasks || [], workspaceId);
			expensesState.set(expenses || [], workspaceId);

			setTimeout(() => {
				isLoading = false;
			}, 500);
		} catch (error) {
			console.error("Error initializing calendar:", error);
			hasError = true;
			errorMessage = "Failed to initialize calendar";
			isLoading = false;
			toastService.error("Failed to initialize calendar");
		}
	});

	// Update stores when props change
	// Pass workspace ID to ensure data consistency when workspace changes
	$effect(() => {
		try {
			// Clear store if workspace changed to prevent stale data
			if (!calendarState.isWorkspace(workspaceId)) {
				calendarState.clearWorkspace();
			}
			if (!tasksState.isWorkspace(workspaceId)) {
				tasksState.clearWorkspace();
			}
			if (!expensesState.isWorkspace(workspaceId)) {
				expensesState.clearWorkspace();
			}
			calendarState.setSchedules(schedules || [], workspaceId);
			tasksState.set(tasks || [], workspaceId);
			expensesState.set(expenses || [], workspaceId);
		} catch (error) {
			console.error("Error updating schedules store:", error);
		}
	});

	// Handle modal close
	function handleModalClose() {
		modalOpen = false;
		selectedEvent = null;
	}

	// Check if there are any events to display
	let hasEvents = $derived(calendarState.unifiedEvents.length > 0);
</script>

<!-- Calendar Filters -->
{#if !isLoading}
	<CalendarFilters />
{/if}

<!-- Loading State -->
{#if isLoading}
	<div class="px-4 space-y-4">
		<!-- Filter skeleton -->
		<Card class="p-4">
			<Skeleton class="h-6 w-48 mb-4" />
			<div class="space-y-3">
				<Skeleton class="h-10 w-full" />
				<Skeleton class="h-10 w-full" />
				<Skeleton class="h-10 w-full" />
				<Skeleton class="h-10 w-full" />
			</div>
		</Card>

		<!-- Calendar skeleton -->
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
						{errorMessage || "An error occurred while loading the calendar"}
					</p>
				</div>
				<button
					class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
					onclick={() => window.location.reload()}
				>
					<span class="i-lucide:refresh-cw w-4 h-4 inline-block mr-2"></span>
					Reload Page
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
