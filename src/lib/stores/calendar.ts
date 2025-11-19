import { writable, derived } from 'svelte/store';
import type { Schedule, Task, Expense } from '$lib/types';
import {
	transformSchedules,
	transformTasks,
	transformExpenses,
	type UnifiedCalendarEvent,
} from '$lib/utils/calendar-transform';

/**
 * Event filter configuration
 */
export interface EventFilters {
	showSchedules: boolean;
	showTasks: boolean;
	showExpenses: boolean;
	showOverdueOnly: boolean;
}

/**
 * Calendar statistics
 */
export interface CalendarStats {
	totalSchedules: number;
	upcomingSchedules: number;
	totalTasks: number;
	pendingTasks: number;
	overdueTasks: number;
	totalExpenses: number;
	unpaidExpenses: number;
	overdueExpenses: number;
}

/**
 * Source data stores
 */
export const schedulesStore = writable<Schedule[]>([]);
export const tasksStore = writable<Task[]>([]);
export const expensesStore = writable<Expense[]>([]);

/**
 * Filter state store
 */
export const eventFilters = writable<EventFilters>({
	showSchedules: true,
	showTasks: true,
	showExpenses: true,
	showOverdueOnly: false,
});

/**
 * Derived store that combines and filters all event types
 */
export const unifiedEvents = derived(
	[schedulesStore, tasksStore, expensesStore, eventFilters],
	([$schedules, $tasks, $expenses, $filters]) => {
		try {
			const events: UnifiedCalendarEvent[] = [];

			// Transform and add schedules if filter is enabled
			if ($filters.showSchedules) {
				try {
					const scheduleEvents = transformSchedules($schedules);
					events.push(...scheduleEvents);
				} catch (error) {
					console.error('Error transforming schedules in store:', error);
				}
			}

			// Transform and add tasks if filter is enabled
			if ($filters.showTasks) {
				try {
					const taskEvents = transformTasks($tasks);
					events.push(...taskEvents);
				} catch (error) {
					console.error('Error transforming tasks in store:', error);
				}
			}

			// Transform and add expenses if filter is enabled
			if ($filters.showExpenses) {
				try {
					const expenseEvents = transformExpenses($expenses);
					events.push(...expenseEvents);
				} catch (error) {
					console.error('Error transforming expenses in store:', error);
				}
			}

			// Apply overdue-only filter if enabled
			if ($filters.showOverdueOnly) {
				return events.filter((event) => event.isOverdue === true);
			}

			return events;
		} catch (error) {
			console.error('Critical error in unifiedEvents store:', error);
			return [];
		}
	},
);

/**
 * Derived store with calendar statistics
 */
export const calendarStats = derived(
	[schedulesStore, tasksStore, expensesStore],
	([$schedules, $tasks, $expenses]): CalendarStats => {
		try {
			// Transform all events to check overdue status with error handling
			let scheduleEvents: UnifiedCalendarEvent[] = [];
			let taskEvents: UnifiedCalendarEvent[] = [];
			let expenseEvents: UnifiedCalendarEvent[] = [];

			try {
				scheduleEvents = transformSchedules($schedules);
			} catch (error) {
				console.error('Error transforming schedules for stats:', error);
			}

			try {
				taskEvents = transformTasks($tasks);
			} catch (error) {
				console.error('Error transforming tasks for stats:', error);
			}

			try {
				expenseEvents = transformExpenses($expenses);
			} catch (error) {
				console.error('Error transforming expenses for stats:', error);
			}

			// Calculate schedule stats
			const totalSchedules = Array.isArray($schedules) ? $schedules.length : 0;
			const upcomingSchedules = scheduleEvents.filter((event) => {
				// Check if schedule is in the future
				try {
					const now = new Date();
					const scheduleDate = new Date((event.sourceData as Schedule).scheduleDate);
					return scheduleDate >= now;
				} catch {
					return false;
				}
			}).length;

			// Calculate task stats
			const totalTasks = Array.isArray($tasks) ? $tasks.length : 0;
			const pendingTasks = Array.isArray($tasks)
				? $tasks.filter((task) => task?.taskStatus !== 'completed').length
				: 0;
			const overdueTasks = taskEvents.filter((event) => event.isOverdue === true).length;

			// Calculate expense stats
			const totalExpenses = Array.isArray($expenses) ? $expenses.length : 0;
			const unpaidExpenses = Array.isArray($expenses)
				? $expenses.filter((expense) => expense?.expensePaymentStatus === 'unpaid').length
				: 0;
			const overdueExpenses = expenseEvents.filter((event) => event.isOverdue === true).length;

			return {
				totalSchedules,
				upcomingSchedules,
				totalTasks,
				pendingTasks,
				overdueTasks,
				totalExpenses,
				unpaidExpenses,
				overdueExpenses,
			};
		} catch (error) {
			console.error('Critical error in calendarStats store:', error);
			// Return safe defaults
			return {
				totalSchedules: 0,
				upcomingSchedules: 0,
				totalTasks: 0,
				pendingTasks: 0,
				overdueTasks: 0,
				totalExpenses: 0,
				unpaidExpenses: 0,
				overdueExpenses: 0,
			};
		}
	},
);
