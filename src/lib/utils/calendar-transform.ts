import { Temporal } from 'temporal-polyfill';
import type { Schedule, Task, Expense, ScheduleCategory, TaskPriority, ExpenseStatus } from '$lib/types';

/**
 * Calendar event source types
 */
export type CalendarEventSource = 'schedule' | 'task' | 'expense';

/**
 * Unified calendar event interface compatible with @schedule-x
 */
export interface UnifiedCalendarEvent {
	id: string;
	title: string;
	description?: string;
	start: Temporal.ZonedDateTime | Temporal.PlainDate;
	end: Temporal.ZonedDateTime | Temporal.PlainDate;
	calendarId: string;
	source: CalendarEventSource;
	sourceData: Schedule | Task | Expense;
	isOverdue?: boolean;
}

/**
 * Timezone constant for Asia/Makassar
 */
const TIMEZONE = 'Asia/Makassar';

/**
 * Transform Schedule[] to UnifiedCalendarEvent[]
 * Schedules have specific times, so we use ZonedDateTime
 */
export function transformSchedules(schedules: Schedule[]): UnifiedCalendarEvent[] {
	if (!Array.isArray(schedules)) {
		console.error('transformSchedules: Expected array, received:', typeof schedules);
		return [];
	}

	return schedules
		.filter((schedule) => {
			// Validate required fields
			if (!schedule) {
				console.warn('transformSchedules: Null or undefined schedule encountered');
				return false;
			}
			if (!schedule.scheduleDate || !schedule.scheduleStartTime || !schedule.scheduleEndTime) {
				console.warn('transformSchedules: Missing required date/time fields:', schedule.id);
				return false;
			}
			return true;
		})
		.map((schedule) => {
			try {
				// Provide defaults for optional fields
				const scheduleName = schedule.scheduleName || 'Untitled Schedule';
				const scheduleLocation = schedule.scheduleLocation || 'TBD';
				const scheduleVenue = schedule.scheduleVenue || 'TBD';
				const scheduleCategory = schedule.scheduleCategory || 'miscellaneous';

				// Create ZonedDateTime for start and end times with error handling
				const start = Temporal.ZonedDateTime.from(
					`${schedule.scheduleDate}T${schedule.scheduleStartTime}+08:00[${TIMEZONE}]`
				);
				const end = Temporal.ZonedDateTime.from(
					`${schedule.scheduleDate}T${schedule.scheduleEndTime}+08:00[${TIMEZONE}]`
				);

				const event: UnifiedCalendarEvent = {
					id: `schedule-${schedule.id}`,
					title: scheduleName,
					description: `${scheduleLocation} - ${scheduleVenue}`,
					start,
					end,
					calendarId: `schedule-${scheduleCategory}`,
					source: 'schedule',
					sourceData: schedule,
					isOverdue: false // Schedules don't have overdue concept
				};

				return event;
			} catch (error) {
				console.error('Error transforming schedule:', {
					id: schedule.id,
					date: schedule.scheduleDate,
					startTime: schedule.scheduleStartTime,
					endTime: schedule.scheduleEndTime,
					error: error instanceof Error ? error.message : String(error)
				});
				return null;
			}
		})
		.filter((event): event is UnifiedCalendarEvent => event !== null);
}

/**
 * Transform Task[] to UnifiedCalendarEvent[]
 * Tasks have only due dates, so we use PlainDate (all-day events)
 */
export function transformTasks(tasks: Task[]): UnifiedCalendarEvent[] {
	if (!Array.isArray(tasks)) {
		console.error('transformTasks: Expected array, received:', typeof tasks);
		return [];
	}

	return tasks
		.filter((task) => {
			// Validate required fields
			if (!task) {
				console.warn('transformTasks: Null or undefined task encountered');
				return false;
			}
			if (!task.taskDueDate) {
				console.warn('transformTasks: Missing due date for task:', task.id);
				return false;
			}
			return true;
		})
		.map((task) => {
			try {
				// Provide defaults for optional fields
				const taskDescription = task.taskDescription || 'Untitled Task';
				const taskPriority = task.taskPriority || 'medium';
				const taskStatus = task.taskStatus || 'not_started';

				// Create PlainDate for all-day event with error handling
				const dueDate = Temporal.PlainDate.from(task.taskDueDate);

				const event: UnifiedCalendarEvent = {
					id: `task-${task.id}`,
					title: taskDescription,
					description: `Priority: ${taskPriority} | Status: ${taskStatus}`,
					start: dueDate,
					end: dueDate,
					calendarId: `task-${taskPriority}`,
					source: 'task',
					sourceData: task,
					isOverdue: isOverdue({ start: dueDate, source: 'task', sourceData: task } as UnifiedCalendarEvent)
				};

				return event;
			} catch (error) {
				console.error('Error transforming task:', {
					id: task.id,
					dueDate: task.taskDueDate,
					error: error instanceof Error ? error.message : String(error)
				});
				return null;
			}
		})
		.filter((event): event is UnifiedCalendarEvent => event !== null);
}

/**
 * Transform Expense[] to UnifiedCalendarEvent[]
 * Expenses have only due dates, so we use PlainDate (all-day events)
 */
export function transformExpenses(expenses: Expense[]): UnifiedCalendarEvent[] {
	if (!Array.isArray(expenses)) {
		console.error('transformExpenses: Expected array, received:', typeof expenses);
		return [];
	}

	return expenses
		.filter((expense) => {
			// Validate required fields
			if (!expense) {
				console.warn('transformExpenses: Null or undefined expense encountered');
				return false;
			}
			if (!expense.expenseDueDate) {
				console.warn('transformExpenses: Missing due date for expense:', expense.id);
				return false;
			}
			return true;
		})
		.map((expense) => {
			try {
				// Provide defaults for optional fields
				const expenseDescription = expense.expenseDescription || 'Untitled Expense';
				const expenseAmount = expense.expenseAmount || 0;
				const expensePaymentStatus = expense.expensePaymentStatus || 'unpaid';

				// Create PlainDate for all-day event with error handling
				const dueDate = Temporal.PlainDate.from(expense.expenseDueDate);

				const event: UnifiedCalendarEvent = {
					id: `expense-${expense.id}`,
					title: expenseDescription,
					description: `Amount: ${expenseAmount} | Status: ${expensePaymentStatus}`,
					start: dueDate,
					end: dueDate,
					calendarId: `expense-${expensePaymentStatus}`,
					source: 'expense',
					sourceData: expense,
					isOverdue: isOverdue({ start: dueDate, source: 'expense', sourceData: expense } as UnifiedCalendarEvent)
				};

				return event;
			} catch (error) {
				console.error('Error transforming expense:', {
					id: expense.id,
					dueDate: expense.expenseDueDate,
					error: error instanceof Error ? error.message : String(error)
				});
				return null;
			}
		})
		.filter((event): event is UnifiedCalendarEvent => event !== null);
}

/**
 * Check if an event is overdue
 * Only applies to tasks (not completed) and expenses (unpaid)
 */
export function isOverdue(event: UnifiedCalendarEvent): boolean {
	if (!event || !event.start || !event.source || !event.sourceData) {
		console.warn('isOverdue: Invalid event data provided');
		return false;
	}

	try {
		// Get current date with fallback
		let today: Temporal.PlainDate;
		try {
			const now = Temporal.Now.zonedDateTimeISO(TIMEZONE);
			today = now.toPlainDate();
		} catch (temporalError) {
			// Fallback to JavaScript Date if Temporal fails
			console.warn('Temporal API error, falling back to Date:', temporalError);
			const jsDate = new Date();
			today = Temporal.PlainDate.from({
				year: jsDate.getFullYear(),
				month: jsDate.getMonth() + 1,
				day: jsDate.getDate()
			});
		}

		// Get the event date as PlainDate
		let eventDate: Temporal.PlainDate;
		try {
			if (event.start instanceof Temporal.ZonedDateTime) {
				eventDate = event.start.toPlainDate();
			} else if (event.start instanceof Temporal.PlainDate) {
				eventDate = event.start;
			} else {
				// Try to parse as PlainDate
				eventDate = Temporal.PlainDate.from(event.start);
			}
		} catch (dateError) {
			console.error('Error parsing event date:', {
				eventId: event.id,
				start: event.start,
				error: dateError instanceof Error ? dateError.message : String(dateError)
			});
			return false;
		}

		// Check if event date is in the past
		const isPast = Temporal.PlainDate.compare(eventDate, today) < 0;

		if (!isPast) {
			return false;
		}

		// For tasks, check if not completed
		if (event.source === 'task') {
			const task = event.sourceData as Task;
			return task.taskStatus !== 'completed';
		}

		// For expenses, check if unpaid
		if (event.source === 'expense') {
			const expense = event.sourceData as Expense;
			return expense.expensePaymentStatus === 'unpaid';
		}

		// Schedules are never overdue
		return false;
	} catch (error) {
		console.error('Error checking overdue status:', {
			eventId: event.id,
			source: event.source,
			error: error instanceof Error ? error.message : String(error)
		});
		return false;
	}
}

/**
 * Color mapping for schedule categories
 */
const scheduleColors: Record<ScheduleCategory, string> = {
	preparation: '#3b82f6',    // blue
	ceremony: '#ec4899',       // pink
	reception: '#8b5cf6',      // purple
	entertainment: '#f59e0b',  // amber
	logistics: '#10b981',      // green
	'photo-video': '#06b6d4',  // cyan
	paperwork: '#6366f1',      // indigo
	closing: '#84cc16',        // lime
	miscellaneous: '#64748b'   // slate
};

/**
 * Color mapping for task priorities
 */
const taskColors: Record<TaskPriority, string> = {
	low: '#10b981',      // green
	medium: '#f59e0b',   // amber
	high: '#ef4444'      // red
};

/**
 * Color mapping for expense payment status
 */
const expenseColors: Record<ExpenseStatus, string> = {
	paid: '#10b981',     // green
	unpaid: '#ef4444'    // red
};

/**
 * Get color for an event based on its source and category/priority/status
 */
export function getEventColor(event: UnifiedCalendarEvent): string {
	try {
		switch (event.source) {
			case 'schedule': {
				const schedule = event.sourceData as Schedule;
				return scheduleColors[schedule.scheduleCategory] || '#64748b';
			}
			case 'task': {
				const task = event.sourceData as Task;
				return taskColors[task.taskPriority] || '#64748b';
			}
			case 'expense': {
				const expense = event.sourceData as Expense;
				return expenseColors[expense.expensePaymentStatus] || '#64748b';
			}
			default:
				return '#64748b'; // slate as fallback
		}
	} catch (error) {
		console.error('Error getting event color:', event, error);
		return '#64748b';
	}
}

/**
 * Icon mapping for event sources
 */
const sourceIcons: Record<CalendarEventSource, string> = {
	schedule: 'i-lucide:calendar',
	task: 'i-lucide:check-square',
	expense: 'i-lucide:dollar-sign'
};

/**
 * Get icon class for an event based on its source
 */
export function getEventIcon(source: CalendarEventSource): string {
	return sourceIcons[source] || 'i-lucide:calendar';
}
