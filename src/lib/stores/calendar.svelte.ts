import type { Schedule } from "$lib/types";
import {
	transformSchedules,
	transformTasks,
	transformExpenses,
	type UnifiedCalendarEvent,
} from "$lib/utils/calendar-transform";
import { tasksState } from "./tasks.svelte";
import { expensesState } from "./expenses.svelte";

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
	// Cache for transformed calendar events
	calendarEventCache = $state(new Map<string, UnifiedCalendarEvent[]>());

	schedules = $state<Schedule[]>([]);
	filters = $state<EventFilters>({
		showSchedules: true,
		showTasks: true,
		showExpenses: true,
		showOverdueOnly: false,
	});

	/**
	 * Current workspace ID that this store's data belongs to
	 * Used to ensure data consistency when workspace changes
	 */
	private currentWorkspaceId = $state<string | null>(null);

	/**
	 * Get unified calendar events with applied filters
	 */
	get unifiedEvents(): UnifiedCalendarEvent[] {
		try {
			// Create cache key based on data and filters
			const cacheKey = JSON.stringify({
				schedules: this.schedules.length,
				tasks: tasksState.tasks.length,
				expenses: expensesState.expenses.length,
				filters: this.filters,
			});

			// Check cache first
			if (this.calendarEventCache.has(cacheKey)) {
				return this.calendarEventCache.get(cacheKey)!;
			}

			const events: UnifiedCalendarEvent[] = [];

			// Transform and add schedules if filter is enabled
			if (this.filters.showSchedules) {
				try {
					const scheduleEvents = transformSchedules(this.schedules);
					events.push(...scheduleEvents);
				} catch (error) {
					console.error("Error transforming schedules:", error);
				}
			}

			// Transform and add tasks if filter is enabled
			if (this.filters.showTasks) {
				try {
					const taskEvents = transformTasks(tasksState.tasks);
					events.push(...taskEvents);
				} catch (error) {
					console.error("Error transforming tasks:", error);
				}
			}

			// Transform and add expenses if filter is enabled
			if (this.filters.showExpenses) {
				try {
					const expenseEvents = transformExpenses(expensesState.expenses);
					events.push(...expenseEvents);
				} catch (error) {
					console.error("Error transforming expenses:", error);
				}
			}

			let filteredEvents = events;

			// Apply overdue-only filter if enabled
			if (this.filters.showOverdueOnly) {
				filteredEvents = events.filter((event) => event.isOverdue === true);
			}

			// Cache the result
			this.calendarEventCache.set(cacheKey, filteredEvents);

			return filteredEvents;
		} catch (error) {
			console.error("Critical error in unifiedEvents:", error);
			return [];
		}
	}

	/**
	 * Clear the calendar event cache
	 */
	clearCache() {
		this.calendarEventCache.clear();
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
				console.error("Error transforming schedules for stats:", error);
			}

			try {
				taskEvents = transformTasks(tasksState.tasks);
			} catch (error) {
				console.error("Error transforming tasks for stats:", error);
			}

			try {
				expenseEvents = transformExpenses(expensesState.expenses);
			} catch (error) {
				console.error("Error transforming expenses for stats:", error);
			}

			// Calculate schedule stats
			const totalSchedules = this.schedules.length;
			const upcomingSchedules = scheduleEvents.filter((event) => {
				try {
					const now = new Date();
					const scheduleDate = new Date(
						(event.sourceData as Schedule).scheduleDate
					);
					return scheduleDate >= now;
				} catch {
					return false;
				}
			}).length;

			// Calculate task stats using tasksState
			const totalTasks = tasksState.stats.total;
			const pendingTasks =
				tasksState.stats.pending + tasksState.stats.inProgress;
			const overdueTasks = taskEvents.filter(
				(event) => event.isOverdue === true
			).length;

			// Calculate expense stats using expensesState
			const totalExpenses = expensesState.stats.total;
			const unpaidExpenses = expensesState.stats.unpaid;
			const overdueExpenses = expenseEvents.filter(
				(event) => event.isOverdue === true
			).length;

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
			console.error("Critical error in calendar stats:", error);
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
	 * Get the current workspace ID
	 */
	get workspaceId(): string | null {
		return this.currentWorkspaceId;
	}

	/**
	 * Set schedules and optionally workspace context
	 *
	 * @param schedules - Schedules to set
	 * @param workspaceId - Optional workspace ID to associate with this data
	 */
	setSchedules(schedules: Schedule[], workspaceId?: string | null): void {
		this.schedules = schedules;
		this.clearCache();
		if (workspaceId !== undefined) {
			this.currentWorkspaceId = workspaceId;
		}
	}

	/**
	 * Set the workspace context without changing schedules
	 *
	 * @param workspaceId - Workspace ID to set
	 */
	setWorkspace(workspaceId: string | null): void {
		this.currentWorkspaceId = workspaceId;
	}

	/**
	 * Check if the store's data belongs to the given workspace
	 *
	 * @param workspaceId - Workspace ID to check
	 * @returns true if data belongs to the workspace, false otherwise
	 */
	isWorkspace(workspaceId: string | null): boolean {
		return this.currentWorkspaceId === workspaceId;
	}

	/**
	 * Clear all schedules and workspace context
	 * Should be called when switching workspaces to prevent stale data
	 */
	clearWorkspace(): void {
		this.schedules = [];
		this.currentWorkspaceId = null;
		this.resetFilters();
	}

	/**
	 * Update filters
	 */
	updateFilters(updates: Partial<EventFilters>): void {
		this.filters = { ...this.filters, ...updates };
		this.clearCache();
	}

	/**
	 * Toggle a specific filter
	 */
	toggleFilter(key: keyof EventFilters): void {
		this.filters[key] = !this.filters[key];
		this.clearCache();
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
