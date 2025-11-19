import { writable } from 'svelte/store';
import type { Expense } from '$lib/types';

export const expensesStore = writable<Expense[]>([]);
