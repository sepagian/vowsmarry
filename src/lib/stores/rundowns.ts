import { writable } from 'svelte/store';
import type { Schedule } from '$lib/types';

export const rundownsStore = writable<Schedule[]>([]);
