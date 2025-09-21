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
		id: string;
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

	type VendorStatus = 'researching' | 'contacted' | 'quoted' | 'booked';

	type Vendor = {
		vendorName: string;
		vendorCategory: Category;
		vendorEmail?: string;
		vendorPhone?: string;
		vendorWebsite?: string;
		vendorPrice?: string;
		vendorDesc?: string;
		vendorRating?: 1 | 2 | 3 | 4 | 5;
		vendorStatus: VendorStatus;
	};

	type RundownCategory =
		| 'preparation'
		| 'ceremony'
		| 'reception'
		| 'entertainment'
		| 'logistics'
		| 'photo-video'
		| 'paperwork'
		| 'closing'
		| 'miscellaneous';

	type Rundown = {
		id: string;
		event: string;
		time: string;
		category: RundownCategory;
		description?: string;
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
