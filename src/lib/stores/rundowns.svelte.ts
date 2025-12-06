import type { Schedule, ScheduleCategory } from '$lib/types';
import { SvelteDate, SvelteMap } from 'svelte/reactivity';

/**
 * Svelte 5 runes-based rundowns (schedules) state management
 */
class RundownsState {
	schedules = $state<Schedule[]>([]);
	
	/**
	 * Current workspace ID that this store's data belongs to
	 * Used to ensure data consistency when workspace changes
	 */
	private currentWorkspaceId = $state<string | null>(null);

	/**
	 * Get upcoming schedules
	 */
	get upcoming(): Schedule[] {
		const now = new Date();
		return this.schedules.filter((s) => new Date(s.scheduleDate) >= now);
	}

	/**
	 * Get past schedules
	 */
	get past(): Schedule[] {
		const now = new Date();
		return this.schedules.filter((s) => new Date(s.scheduleDate) < now);
	}

	/**
	 * Get today's schedules
	 */
	get today(): Schedule[] {
		const today = new SvelteDate();
		today.setHours(0, 0, 0, 0);
		const tomorrow = new SvelteDate(today);
		tomorrow.setDate(tomorrow.getDate() + 1);

		return this.schedules.filter((s) => {
			const scheduleDate = new Date(s.scheduleDate);
			return scheduleDate >= today && scheduleDate < tomorrow;
		});
	}

	/**
	 * Get statistics
	 */
	get stats() {
		return {
			total: this.schedules.length,
			upcoming: this.upcoming.length,
			past: this.past.length,
			today: this.today.length,
		};
	}

	/**
	 * Group schedules by category
	 */
	get byCategory() {
		const grouped = new SvelteMap<ScheduleCategory, Schedule[]>();
		for (const schedule of this.schedules) {
			const category = schedule.scheduleCategory;
			if (!grouped.has(category)) {
				grouped.set(category, []);
			}
			grouped.get(category)!.push(schedule);
		}
		return grouped;
	}

	/**
	 * Get schedules sorted by date
	 */
	get sortedByDate(): Schedule[] {
		return [...this.schedules].sort(
			(a, b) => new Date(a.scheduleDate).getTime() - new Date(b.scheduleDate).getTime(),
		);
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
	set(schedules: Schedule[], workspaceId?: string | null): void {
		this.schedules = schedules;
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
	 * Add a schedule
	 */
	add(schedule: Schedule): void {
		this.schedules = [...this.schedules, schedule];
	}

	/**
	 * Update a schedule
	 */
	update(id: string, updates: Partial<Schedule>): void {
		this.schedules = this.schedules.map((s) => (s.id === id ? { ...s, ...updates } : s));
	}

	/**
	 * Remove a schedule
	 */
	remove(id: string): void {
		this.schedules = this.schedules.filter((s) => s.id !== id);
	}

	/**
	 * Find schedule by ID
	 */
	findById(id: string): Schedule | undefined {
		return this.schedules.find((s) => s.id === id);
	}

	/**
	 * Filter by category
	 */
	filterByCategory(category: ScheduleCategory): Schedule[] {
		return this.schedules.filter((s) => s.scheduleCategory === category);
	}

	/**
	 * Sort by date
	 */
	sortByDate(): Schedule[] {
		return this.sortedByDate;
	}

	/**
	 * Clear all schedules
	 */
	clear(): void {
		this.schedules = [];
	}

	/**
	 * Clear all schedules and workspace context
	 * Should be called when switching workspaces to prevent stale data
	 */
	clearWorkspace(): void {
		this.schedules = [];
		this.currentWorkspaceId = null;
	}
}

/**
 * Global rundowns state instance
 */
export const rundownsState = new RundownsState();
