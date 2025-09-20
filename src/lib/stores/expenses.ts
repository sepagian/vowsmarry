import { writable } from 'svelte/store';

export type ExpenseStatus = 'Paid' | 'Pending';

export interface Expense {
	id: string;
	date: string;
	category: string;
	description: string;
	amount: number;
	status: ExpenseStatus;
}

const initialExpenses: Expense[] = [
	{
		id: '1',
		date: '2025-08-01',
		category: 'Venue',
		description: 'Down payment for venue booking',
		amount: 5_000_000,
		status: 'Paid',
	},
	{
		id: '2',
		date: '2025-08-03',
		category: 'Venue',
		description: 'Final payment for venue',
		amount: 3_000_000,
		status: 'Pending',
	},
	{
		id: '3',
		date: '2025-08-05',
		category: 'Catering',
		description: 'Initial catering deposit',
		amount: 3_000_000,
		status: 'Paid',
	},
	{
		id: '4',
		date: '2025-08-08',
		category: 'Catering',
		description: 'Second catering installment',
		amount: 2_000_000,
		status: 'Paid',
	},
	{
		id: '5',
		date: '2025-08-10',
		category: 'Decoration',
		description: 'Stage setup & flowers',
		amount: 3_500_000,
		status: 'Paid',
	},
	{
		id: '6',
		date: '2025-08-12',
		category: 'Photography',
		description: 'Pre-wedding photoshoot',
		amount: 2_000_000,
		status: 'Paid',
	},
	{
		id: '7',
		date: '2025-08-15',
		category: 'Photography',
		description: 'Wedding day coverage',
		amount: 2_000_000,
		status: 'Pending',
	},
	{
		id: '8',
		date: '2025-08-18',
		category: 'Makeup & Attire',
		description: 'Bride and groom outfits',
		amount: 4_000_000,
		status: 'Paid',
	},
	{
		id: '9',
		date: '2025-08-20',
		category: 'Entertainment',
		description: 'Live band booking',
		amount: 2_500_000,
		status: 'Paid',
	},
	{
		id: '10',
		date: '2025-08-22',
		category: 'Makeup & Attire',
		description: 'Bridal makeup package',
		amount: 3_000_000,
		status: 'Pending',
	},
];

export const expensesStore = writable<Expense[]>(initialExpenses);
