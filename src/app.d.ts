// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	// Card types for overview sections
	type OverviewCard = {
		title: string;
		description: string;
		action?: string;
		actionClass?: string;
		actionColor?: string;
		footer: string;
	};

	// Global category types
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

	// Tasks
	type Task = {
		id: string;
		title: string;
		description?: string;
		category: Category;
		priority?: TaskPriority;
		status: TaskStatus;
		date?: string;
	};

	type TaskStatus = 'pending' | 'on-progress' | 'completed';
	type TaskPriority = 'low' | 'medium' | 'high';
	type Filter = 'all' | 'active' | 'completed';

	// Docs
	type Document = {
		id: string;
		description: string;
		date: string;
		category: DocType;
	};

	type DocType = 'legal-formal' | 'vendor-finance' | 'guest-ceremony' | 'personal-keepsake';

	// Expenses
	type Expense = {
		id: string;
		date: string;
		category: string;
		description: string;
		amount: number;
		'payment-status': ExpenseStatus;
	};

	type ExpenseStatus = 'pending' | 'paid';

	// Vendors
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

	type VendorStatus = 'researching' | 'contacted' | 'quoted' | 'booked';

	//Rundowns
	type Rundown = {
		id: string;
		title: string;
		description?: string;
		category: RundownCategory;
		startTime: string;
		endTime: string;
		location?: string;
		attendees?: string;
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

	// DnD
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
