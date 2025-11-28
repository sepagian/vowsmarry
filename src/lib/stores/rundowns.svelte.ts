import type { Schedule, ScheduleCategory } from '$lib/types';
import { SvelteDate, SvelteMap } from 'svelte/reactivity';

/**
 * Svelte 5 runes-based rundowns (schedules) state management
 */
class RundownsState {
	schedules = $state<Schedule[]>([]);

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
	 * Set schedules
	 */
	set(schedules: Schedule[]): void {
		this.schedules = schedules;
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
}

/**
 * Global rundowns state instance
 */
export const rundownsState = new RundownsState();
