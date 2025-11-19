import { writable } from 'svelte/store';

export interface ErrorState {
	type: string;
	message?: string;
	context?: string;
}

function createErrorStore() {
	const { subscribe, set, update } = writable<ErrorState | null>(null);

	return {
		subscribe,
		setError: (error: ErrorState) => set(error),
		clearError: () => set(null),
		updateError: (updater: (current: ErrorState | null) => ErrorState | null) => update(updater),
	};
}

export const errorStore = createErrorStore();