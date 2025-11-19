<script lang="ts">
	import { eventFilters, calendarStats } from '$lib/stores/calendar';
	import { Label } from '$lib/components/ui/label';
	import { Switch } from '$lib/components/ui/switch';
	import { Card } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';

	// Subscribe to stores with error handling
	let filters = $state($eventFilters);
	let stats = $state($calendarStats);

	// Check if all filters are disabled
	let allFiltersDisabled = $derived(
		!filters.showSchedules && !filters.showTasks && !filters.showExpenses,
	);

	// Function to re-enable all filters
	function enableAllFilters() {
		try {
			filters = {
				...filters,
				showSchedules: true,
				showTasks: true,
				showExpenses: true,
			};
		} catch (error) {
			console.error('Error enabling all filters:', error);
		}
	}

	// Update store when filters change
	$effect(() => {
		try {
			eventFilters.set(filters);
		} catch (error) {
			console.error('Error updating event filters:', error);
		}
	});

	// Sync store updates back to local state
	$effect(() => {
		try {
			filters = $eventFilters;
		} catch (error) {
			console.error('Error syncing filters from store:', error);
		}
	});

	$effect(() => {
		try {
			stats = $calendarStats;
		} catch (error) {
			console.error('Error syncing stats from store:', error);
		}
	});
</script>

<div class="px-4">
	<Card class="p-4 shadow-none">
		<div class="space-y-4">
			<h3 class="text-lg font-semibold">Calendar Filters</h3>

			<!-- Schedules Filter -->
			<div class="flex items-center justify-between">
				<Label
					for="filter-schedules"
					class="flex items-center gap-2 cursor-pointer"
				>
					<span class="i-lucide:calendar w-4 h-4"></span>
					<span>Schedules ({stats.totalSchedules})</span>
				</Label>
				<Switch
					id="filter-schedules"
					bind:checked={filters.showSchedules}
				/>
			</div>

			<!-- Tasks Filter -->
			<div class="flex items-center justify-between">
				<Label
					for="filter-tasks"
					class="flex items-center gap-2 cursor-pointer"
				>
					<span class="i-lucide:check-square w-4 h-4"></span>
					<span>
						Tasks ({stats.totalTasks})
						{#if stats.overdueTasks > 0}
							<span class="text-red-500 font-semibold">- {stats.overdueTasks} overdue</span>
						{/if}
					</span>
				</Label>
				<Switch
					id="filter-tasks"
					bind:checked={filters.showTasks}
				/>
			</div>

			<!-- Expenses Filter -->
			<div class="flex items-center justify-between">
				<Label
					for="filter-expenses"
					class="flex items-center gap-2 cursor-pointer"
				>
					<span class="i-lucide:dollar-sign w-4 h-4"></span>
					<span>
						Expenses ({stats.totalExpenses})
						{#if stats.overdueExpenses > 0}
							<span class="text-red-500 font-semibold">- {stats.overdueExpenses} overdue</span>
						{/if}
					</span>
				</Label>
				<Switch
					id="filter-expenses"
					bind:checked={filters.showExpenses}
				/>
			</div>

			<!-- Separator -->
			<div class="border-t pt-4">
				<!-- Show Overdue Only Filter -->
				<div class="flex items-center justify-between">
					<Label
						for="filter-overdue"
						class="flex items-center gap-2 cursor-pointer"
					>
						<span class="i-lucide:alert-circle w-4 h-4 text-red-500"></span>
						<span>Show Overdue Only</span>
					</Label>
					<Switch
						id="filter-overdue"
						bind:checked={filters.showOverdueOnly}
					/>
				</div>
			</div>

			<!-- Empty State Warning -->
			{#if allFiltersDisabled}
				<div class="border-t pt-4">
					<div
						class="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4"
					>
						<div class="flex items-start gap-3">
							<span
								class="i-lucide:alert-triangle w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5"
							></span>
							<div class="flex-1 space-y-2">
								<p class="text-sm text-amber-800 dark:text-amber-200 font-medium">
									All filters are disabled
								</p>
								<p class="text-sm text-amber-700 dark:text-amber-300">
									No events will be displayed in the calendar. Enable at least one filter to view
									events.
								</p>
								<Button
									size="sm"
									variant="outline"
									class="mt-2 border-amber-300 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900"
									onclick={enableAllFilters}
								>
									<span class="i-lucide:eye w-4 h-4 mr-2"></span>
									Enable All Filters
								</Button>
							</div>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</Card>
</div>
