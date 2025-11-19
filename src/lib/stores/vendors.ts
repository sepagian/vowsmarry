import { writable } from 'svelte/store';
import type { Vendor } from '$lib/types';

export const vendorsStore = writable<Vendor[]>([]);
