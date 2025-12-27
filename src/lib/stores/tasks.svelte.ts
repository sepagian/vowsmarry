import type { Task, TaskStatus, TaskPriority } from '$lib/types';
import { BaseStore } from './base-store.svelte';

/**
 * Svelte 5 runes-based task state management
 * 
 * Provides reactive task state with computed properties and type-safe methods.
 * Uses Svelte 5 runes for better performance and TypeScript inference.
 * 
 * @example
 * ```svelte
 * <script>
 *   import { tasksState } from '$lib/stores/tasks.svelte';
 *   
 *   // Access reactive state
 *   const tasks = tasksState.items;
 *   const pending = tasksState.pending;
 *   
 *   // Update state
 *   tasksState.set(newTasks);
 *   tasksState.add(newTask);
 * </script>
 * ```
 */
class TasksState extends BaseStore<Task> {
	/**
	 * Cache for parsed due dates to avoid repeated Date object creation
	 * Key: task ID, Value: parsed Date object
	 */
	private dueDateCache = new Map<string, Date>();

	/**
	 * Alias for items to maintain backward compatibility
	 */
	get tasks(): Task[] {
		return this.items;
	}

	/**
	 * Get cached due date for a task
	 * Creates and caches the Date object if not already cached
	 * 
	 * @param task - Task to get due date for
	 * @returns Parsed Date object
	 */
	private getDueDate(task: Task): Date {
		if (!task.id) {
			return new Date(task.taskDueDate);
		}

		let cached = this.dueDateCache.get(task.id);
		if (!cached) {
			cached = new Date(task.taskDueDate);
			this.dueDateCache.set(task.id, cached);
		}
		return cached;
	}

	/**
	 * Clear date cache for a specific task
	 * 
	 * @param id - Task ID to clear cache for
	 */
	private clearDateCache(id: string | undefined): void {
		if (id) {
			this.dueDateCache.delete(id);
		}
	}

	/**
	 * Clear all date caches
	 */
	private clearAllDateCaches(): void {
		this.dueDateCache.clear();
	}
	
	/**
	 * Get all pending tasks
	 */
	get pending(): Task[] {
		return this.tasks.filter(t => t.taskStatus === 'pending');
	}
	
	/**
	 * Get all in-progress tasks
	 */
	get inProgress(): Task[] {
		return this.tasks.filter(t => t.taskStatus === 'on_progress');
	}
	
	/**
	 * Get all completed tasks
	 */
	get completed(): Task[] {
		return this.tasks.filter(t => t.taskStatus === 'completed');
	}
	
	/**
	 * Get tasks by priority
	 */
	getByPriority(priority: TaskPriority): Task[] {
		return this.tasks.filter(t => t.taskPriority === priority);
	}
	
	/**
	 * Get tasks by status
	 */
	getByStatus(status: TaskStatus): Task[] {
		return this.tasks.filter(t => t.taskStatus === status);
	}
	
	/**
	 * Get high priority tasks
	 */
	get highPriority(): Task[] {
		return this.getByPriority('high');
	}
	
	/**
	 * Get overdue tasks (due date in the past and not completed)
	 * Uses cached dates for better performance
	 */
	get overdue(): Task[] {
		const now = new Date();
		return this.tasks.filter(t => {
			if (t.taskStatus === 'completed') return false;
			const dueDate = this.getDueDate(t);
			return dueDate < now;
		});
	}
	
	/**
	 * Get tasks due soon (within next 7 days)
	 * Uses cached dates for better performance
	 */
	get dueSoon(): Task[] {
		const now = new Date();
		const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
		
		return this.tasks.filter(t => {
			if (t.taskStatus === 'completed') return false;
			const dueDate = this.getDueDate(t);
			return dueDate >= now && dueDate <= weekFromNow;
		});
	}
	
	/**
	 * Get task statistics
	 */
	override get stats() {
		return {
			...super.stats,
			pending: this.pending.length,
			inProgress: this.inProgress.length,
			completed: this.completed.length,
			overdue: this.overdue.length,
			dueSoon: this.dueSoon.length,
			highPriority: this.highPriority.length,
		};
	}
	
	/**
	 * Get completion percentage
	 */
	get completionPercentage(): number {
		if (this.tasks.length === 0) return 0;
		return Math.round((this.completed.length / this.tasks.length) * 100);
	}
	
	/**
	 * Sort tasks by due date (ascending)
	 * Uses cached dates for better performance
	 */
	sortByDueDate(): void {
		this.items = [...this.items].sort((a, b) => {
			const dateA = this.getDueDate(a).getTime();
			const dateB = this.getDueDate(b).getTime();
			return dateA - dateB;
		});
	}

	/**
	 * Override set method to clear date cache and handle workspace context
	 * 
	 * @param items - Tasks to set
	 * @param workspaceId - Optional workspace ID to associate with this data
	 */
	override set(items: Task[], workspaceId?: string | null): void {
		super.set(items, workspaceId);
		this.clearAllDateCaches();
	}

	/**
	 * Override clearWorkspace to also clear date cache
	 */
	override clearWorkspace(): void {
		super.clearWorkspace();
		this.clearAllDateCaches();
	}

	/**
	 * Override update method to clear cache for updated task
	 */
	override update(id: string | undefined, updates: Partial<Task>): void {
		super.update(id, updates);
		// Clear cache if due date was updated
		if (updates.taskDueDate !== undefined) {
			this.clearDateCache(id);
		}
	}

	/**
	 * Override remove method to clear cache for removed task
	 */
	override remove(id: string | undefined): void {
		super.remove(id);
		this.clearDateCache(id);
	}
	
	/**
	 * Sort tasks by priority (high to low)
	 */
	sortByPriority(): void {
		const priorityOrder = { high: 0, medium: 1, low: 2 };
		this.items = [...this.items].sort((a, b) => {
			return priorityOrder[a.taskPriority] - priorityOrder[b.taskPriority];
		});
	}
}

/**
 * Global task state instance
 * Use this in your components to access and modify task state
 */
export const tasksState = new TasksState();
