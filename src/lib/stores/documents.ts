import { writable } from 'svelte/store';
import type { Document } from '$lib/types';

export const documentsStore = writable<Document[]>([]);
