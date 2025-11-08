import { writable } from 'svelte/store';
import type { Rundown } from '$lib/types';

export const rundownsStore = writable<Rundown[]>([]);
