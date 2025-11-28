import type { Schedule } from '$lib/types';
import {
	transformSchedules,
	transformTasks,
	transformExpenses,
	type UnifiedCalendarEvent,
} from '$lib/utils/calendar-transform';
import { tasksState } from './tasks.svelte';
import { expensesState } from './expenses.svelte';

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
 * Svelte 5 runes-based calendar state management
 * 
 * Provides unified calendar view combining schedules, tasks, and expenses
 * with filtering and statistics.
 */
class CalendarState {
	schedules = $state<Schedule[]>([]);
	filters = $state<EventFilters>({
		showSchedules: true,
		showTasks: true,
		showExpenses: true,
		showOverdueOnly: false,
	});
	
	/**
	 * Get unified calendar events with applied filters
	 */
	get unifiedEvents(): UnifiedCalendarEvent[] {
		try {
			const events: UnifiedCalendarEvent[] = [];

			// Transform and add schedules if filter is enabled
			if (this.filters.showSchedules) {
				try {
					const scheduleEvents = transformSchedules(this.schedules);
					events.push(...scheduleEvents);
				} catch (error) {
					console.error('Error transforming schedules:', error);
				}
			}

			// Transform and add tasks if filter is enabled
			if (this.filters.showTasks) {
				try {
					const taskEvents = transformTasks(tasksState.tasks);
					events.push(...taskEvents);
				} catch (error) {
					console.error('Error transforming tasks:', error);
				}
			}

			// Transform and add expenses if filter is enabled
			if (this.filters.showExpenses) {
				try {
					const expenseEvents = transformExpenses(expensesState.expenses);
					events.push(...expenseEvents);
				} catch (error) {
					console.error('Error transforming expenses:', error);
				}
			}

			// Apply overdue-only filter if enabled
			if (this.filters.showOverdueOnly) {
				return events.filter((event) => event.isOverdue === true);
			}

			return events;
		} catch (error) {
			console.error('Critical error in unifiedEvents:', error);
			return [];
		}
	}
	
	/**
	 * Get calendar statistics
	 */
	get stats(): CalendarStats {
		try {
			// Transform all events to check overdue status with error handling
			let scheduleEvents: UnifiedCalendarEvent[] = [];
			let taskEvents: UnifiedCalendarEvent[] = [];
			let expenseEvents: UnifiedCalendarEvent[] = [];

			try {
				scheduleEvents = transformSchedules(this.schedules);
			} catch (error) {
				console.error('Error transforming schedules for stats:', error);
			}

			try {
				taskEvents = transformTasks(tasksState.tasks);
			} catch (error) {
				console.error('Error transforming tasks for stats:', error);
			}

			try {
				expenseEvents = transformExpenses(expensesState.expenses);
			} catch (error) {
				console.error('Error transforming expenses for stats:', error);
			}

			// Calculate schedule stats
			const totalSchedules = this.schedules.length;
			const upcomingSchedules = scheduleEvents.filter((event) => {
				try {
					const now = new Date();
					const scheduleDate = new Date((event.sourceData as Schedule).scheduleDate);
					return scheduleDate >= now;
				} catch {
					return false;
				}
			}).length;

			// Calculate task stats using tasksState
			const totalTasks = tasksState.stats.total;
			const pendingTasks = tasksState.stats.pending + tasksState.stats.inProgress;
			const overdueTasks = taskEvents.filter((event) => event.isOverdue === true).length;

			// Calculate expense stats using expensesState
			const totalExpenses = expensesState.stats.total;
			const unpaidExpenses = expensesState.stats.unpaid;
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
			console.error('Critical error in calendar stats:', error);
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
	}
	
	/**
	 * Set schedules
	 */
	setSchedules(schedules: Schedule[]): void {
		this.schedules = schedules;
	}
	
	/**
	 * Update filters
	 */
	updateFilters(updates: Partial<EventFilters>): void {
		this.filters = { ...this.filters, ...updates };
	}
	
	/**
	 * Toggle a specific filter
	 */
	toggleFilter(key: keyof EventFilters): void {
		this.filters[key] = !this.filters[key];
	}
	
	/**
	 * Reset filters to default
	 */
	resetFilters(): void {
		this.filters = {
			showSchedules: true,
			showTasks: true,
			showExpenses: true,
			showOverdueOnly: false,
		};
	}
}

/**
 * Global calendar state instance
 */
export const calendarState = new CalendarState();
