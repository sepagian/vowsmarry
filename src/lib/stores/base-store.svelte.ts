/**
 * Base store class for entity state management with Svelte 5 runes
 * 
 * Provides common CRUD operations and reactive state management.
 * Extend this class to create entity-specific stores with custom getters and methods.
 * 
 * @template T - The entity type (must have an 'id' property)
 * 
 * @example
 * ```typescript
 * class TasksState extends BaseStore<Task> {
 *   get pending(): Task[] {
 *     return this.items.filter(t => t.status === 'pending');
 *   }
 * }
 * 
 * export const tasksState = new TasksState();
 * ```
 */
export class BaseStore<T extends { id?: string }> {
	/**
	 * Reactive array of items
	 */
	items = $state<T[]>([]);

	/**
	 * Get basic statistics
	 */
	get stats() {
		return {
			total: this.items.length,
		};
	}

	/**
	 * Replace all items
	 * 
	 * @param items - New array of items to set
	 */
	set(items: T[]): void {
		this.items = items;
	}

	/**
	 * Add a new item to the store
	 * 
	 * Uses direct array mutation for better performance with Svelte 5's fine-grained reactivity.
	 * Svelte 5 tracks mutations to $state arrays, so push() triggers reactivity automatically.
	 * 
	 * @param item - Item to add
	 */
	add(item: T): void {
		this.items.push(item);
	}

	/**
	 * Update an item by ID
	 * 
	 * @param id - ID of the item to update
	 * @param updates - Partial updates to apply
	 */
	update(id: string | undefined, updates: Partial<T>): void {
		this.items = this.items.map(item => 
			item.id === id ? { ...item, ...updates } : item
		);
	}

	/**
	 * Remove an item by ID
	 * 
	 * Uses direct array mutation (splice) for better performance with Svelte 5's fine-grained reactivity.
	 * Svelte 5 tracks mutations to $state arrays, so splice() triggers reactivity automatically.
	 * 
	 * @param id - ID of the item to remove
	 */
	remove(id: string | undefined): void {
		const index = this.items.findIndex(item => item.id === id);
		if (index !== -1) {
			this.items.splice(index, 1);
		}
	}

	/**
	 * Find an item by ID
	 * 
	 * @param id - ID of the item to find
	 * @returns The item if found, undefined otherwise
	 */
	findById(id: string | undefined): T | undefined {
		return this.items.find(item => item.id === id);
	}

	/**
	 * Clear all items from the store
	 */
	clear(): void {
		this.items = [];
	}
}
