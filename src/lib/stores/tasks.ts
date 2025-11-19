import { writable } from 'svelte/store';
import type { Task } from '$lib/types';

export const tasksStore = writable<Task[]>([]);
