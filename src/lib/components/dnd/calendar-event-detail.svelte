<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index';
	import { Badge } from '$lib/components/ui/badge/index';
	import { Button } from '$lib/components/ui/button/index';
	import { Separator } from '$lib/components/ui/separator/index';
	import type { UnifiedCalendarEvent } from '$lib/types';
	import type { Schedule, Task, Expense } from '$lib/types';
	import { getEventIcon } from '$lib/utils/calendar-transform';

	let {
		event = $bindable(null),
		open = $bindable(false),
		onClose,
	}: {
		event: UnifiedCalendarEvent | null;
		open: boolean;
		onClose: () => void;
	} = $props();

	// Format date for display
	function formatDate(date: any): string {
		if (!date) {
			return 'No date';
		}

		try {
			if (date.toPlainDate) {
				// ZonedDateTime
				return date.toPlainDate().toString();
			}
			// PlainDate
			if (date.toString) {
				return date.toString();
			}
			// Fallback to string conversion
			return String(date);
		} catch (error) {
			console.error('Error formatting date:', {
				date,
				error: error instanceof Error ? error.message : String(error),
			});
			return 'Invalid date';
		}
	}

	// Format time for display
	function formatTime(dateTime: any): string {
		if (!dateTime) {
			return '';
		}

		try {
			if (dateTime.toPlainTime) {
				return dateTime.toPlainTime().toString().slice(0, 5); // HH:MM
			}
			return '';
		} catch (error) {
			console.error('Error formatting time:', {
				dateTime,
				error: error instanceof Error ? error.message : String(error),
			});
			return '';
		}
	}

	// Get event source display name
	function getSourceDisplayName(source: string): string {
		switch (source) {
			case 'schedule':
				return 'Schedule';
			case 'task':
				return 'Task';
			case 'expense':
				return 'Expense';
			default:
				return source;
		}
	}

	// Get navigation URL based on event source
	function getNavigationUrl(event: UnifiedCalendarEvent): string {
		try {
			if (!event || !event.sourceData || !event.sourceData.id) {
				console.warn('Invalid event data for navigation:', event);
				return '/dashboard';
			}

			const id = event.sourceData.id;
			switch (event.source) {
				case 'schedule':
					return `/dashboard/schedules?id=${id}`;
				case 'task':
					return `/dashboard/task?id=${id}`;
				case 'expense':
					return `/dashboard/finance?id=${id}`;
				default:
					console.warn('Unknown event source:', event.source);
					return '/dashboard';
			}
		} catch (error) {
			console.error('Error generating navigation URL:', {
				event,
				error: error instanceof Error ? error.message : String(error),
			});
			return '/dashboard';
		}
	}

	// Get badge variant based on event source
	function getBadgeVariant(source: string): 'default' | 'secondary' | 'destructive' | 'outline' {
		switch (source) {
			case 'schedule':
				return 'default';
			case 'task':
				return 'secondary';
			case 'expense':
				return 'secondary';
			default:
				return 'default';
		}
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="w-full sm:max-w-[500px]">
		{#if event}
			<Dialog.Header>
				<div class="flex items-center gap-2">
					<div class="{getEventIcon(event.source)} h-5 w-5"></div>
					<Dialog.Title>{event.title}</Dialog.Title>
				</div>
				<div class="flex items-center gap-2 pt-2">
					<Badge variant={getBadgeVariant(event.source)}>
						{getSourceDisplayName(event.source)}
					</Badge>
					{#if event.isOverdue}
						<Badge variant="destructive">Overdue</Badge>
					{/if}
				</div>
			</Dialog.Header>

			<div class="flex flex-col gap-4 py-2">
				<Separator />

				<!-- Schedule-specific fields -->
				{#if event.source === 'schedule'}
					{@const schedule = event.sourceData as Schedule}
					<div class="grid grid-cols-2 gap-4">
						<div class="flex flex-col gap-1">
							<span class="text-sm font-medium">Category</span>
							<span class="text-sm text-muted-foreground capitalize"
								>{schedule.scheduleCategory.replace('-', ' ')}</span
							>
						</div>
						<div class="flex flex-col gap-1">
							<span class="text-sm font-medium">Date</span>
							<span class="text-sm text-muted-foreground">{schedule.scheduleDate}</span>
						</div>
						<div class="flex flex-col gap-1">
							<span class="text-sm font-medium">Start Time</span>
							<span class="text-sm text-muted-foreground">{schedule.scheduleStartTime}</span>
						</div>
						<div class="flex flex-col gap-1">
							<span class="text-sm font-medium">End Time</span>
							<span class="text-sm text-muted-foreground">{schedule.scheduleEndTime}</span>
						</div>
						<div class="flex flex-col gap-1">
							<span class="text-sm font-medium">Location</span>
							<span class="text-sm text-muted-foreground">{schedule.scheduleLocation}</span>
						</div>
						<div class="flex flex-col gap-1">
							<span class="text-sm font-medium">Venue</span>
							<span class="text-sm text-muted-foreground">{schedule.scheduleVenue}</span>
						</div>
						<div class="flex flex-col gap-1 col-span-2">
							<span class="text-sm font-medium">Attendees</span>
							<span class="text-sm text-muted-foreground">{schedule.scheduleAttendees}</span>
						</div>
					</div>
				{/if}

				<!-- Task-specific fields -->
				{#if event.source === 'task'}
					{@const task = event.sourceData as Task}
					<div class="grid grid-cols-2 gap-4">
						<div class="flex flex-col gap-1">
							<span class="text-sm font-medium">Category</span>
							<span class="text-sm text-muted-foreground capitalize"
								>{task.taskCategory.replace('-', ' ')}</span
							>
						</div>
						<div class="flex flex-col gap-1">
							<span class="text-sm font-medium">Priority</span>
							<span class="text-sm text-muted-foreground capitalize">{task.taskPriority}</span>
						</div>
						<div class="flex flex-col gap-1">
							<span class="text-sm font-medium">Status</span>
							<span class="text-sm text-muted-foreground capitalize"
								>{task.taskStatus.replace('_', ' ')}</span
							>
						</div>
						<div class="flex flex-col gap-1">
							<span class="text-sm font-medium">Due Date</span>
							<span class="text-sm text-muted-foreground">{task.taskDueDate}</span>
						</div>
						{#if task.completedAt}
							<div class="flex flex-col gap-1 col-span-2">
								<span class="text-sm font-medium">Completed At</span>
								<span class="text-sm text-muted-foreground"
									>{new Date(task.completedAt).toLocaleDateString()}</span
								>
							</div>
						{/if}
					</div>
				{/if}

				<!-- Expense-specific fields -->
				{#if event.source === 'expense'}
					{@const expense = event.sourceData as Expense}
					<div class="grid grid-cols-2 gap-4">
						<div class="flex flex-col gap-1">
							<span class="text-sm font-medium">Category</span>
							<span class="text-sm text-muted-foreground capitalize"
								>{expense.expenseCategory.replace('-', ' ')}</span
							>
						</div>
						<div class="flex flex-col gap-1">
							<span class="text-sm font-medium">Amount</span>
							<span class="text-sm text-muted-foreground">Rp {expense.expenseAmount}</span>
						</div>
						<div class="flex flex-col gap-1">
							<span class="text-sm font-medium">Payment Status</span>
							<span class="text-sm text-muted-foreground capitalize"
								>{expense.expensePaymentStatus}</span
							>
						</div>
						<div class="flex flex-col gap-1">
							<span class="text-sm font-medium">Due Date</span>
							<span class="text-sm text-muted-foreground">{expense.expenseDueDate}</span>
						</div>
					</div>
				{/if}
			</div>

			<Dialog.Footer class="flex flex-row gap-2 justify-end">
				<Button
					variant="outline"
					onclick={onClose}
				>
					Close
				</Button>
				<Button
					variant="default"
					href={getNavigationUrl(event)}
				>
					<div class="i-lucide:external-link h-4 w-4"></div>
					Edit
				</Button>
			</Dialog.Footer>
		{/if}
	</Dialog.Content>
</Dialog.Root>
