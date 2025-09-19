// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	type Category =
		| 'accommodation'
		| 'catering'
		| 'decoration'
		| 'entertainment'
		| 'makeup-attire'
		| 'paperwork'
		| 'photo-video'
		| 'venue'
		| 'miscellaneous';

	type DocType = 'legal-formal' | 'vendor-finance' | 'guest-ceremony' | 'personal-keepsake';

	type Task = {
		id: string;
		title: string;
		description?: string;
		category: (typeof Category)[number];
		priority?: 'Low' | 'Medium' | 'High';
		status: 'Pending' | 'On Progress' | 'Completed';
		date?: string;
	};

	// Simple Task type for todo sections
	type SimpleTask = {
		title: string;
		description?: string;
		done?: boolean | false;
	};

	// Expense type for expense tracking
	type Expense = {
		id: string;
		date: string;
		category: string;
		description: string;
		amount: number;
		status: 'Paid' | 'Pending';
	};

	// Filter type for todo sections
	type Filter = 'all' | 'active' | 'completed';

	// Card types for overview sections
	type OverviewCard = {
		title: string;
		description: string;
		action?: string;
		actionClass?: string;
		actionColor?: string;
		footer: string;
	};

	type BudgetCard = {
		title: string;
		description: string;
		action?: string;
		footer: string;
	};

	type Item = {
		id: string | number;
		name: string;
	};

	type ColumnType = {
		id: string;
		name: string;
		items: Item[];
	};
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
