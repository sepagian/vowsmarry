export type Option<T> = {
	value: T;
	label: string;
	icon?: string;
	color?: string;
};

// Card types for overview sections
export type OverviewCard = {
	title: string;
	description: string;
	action?: string;
	actionClass?: string;
	actionColor?: string;
	footer: string;
};

// Global category export types
export type Category =
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
export type Task = {
	id: string;
	title: string;
	description?: string;
	category: Category;
	priority?: TaskPriority;
	status: TaskStatus;
	date?: string;
};

export type TaskStatus = 'pending' | 'on-progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';
export type Filter = 'all' | 'active' | 'completed';

// Docs
export type Document = {
	id: string;
	description: string;
	date: string;
	category: DocType;
};

export type DocType = 'legal-formal' | 'vendor-finance' | 'guest-ceremony' | 'personal-keepsake';

// Expenses
export type Expense = {
	id: string;
	date: string;
	category: string;
	description: string;
	amount: number;
	'payment-status': ExpenseStatus;
};

export type ExpenseStatus = 'pending' | 'paid';

// Vendors
export type Vendor = {
	vendorName: string;
	vendorCategory: Category;
	vendorEmail?: string;
	vendorPhone?: string;
	vendorWebsite?: string;
	vendorPrice?: string;
	vendorDesc?: string;
	vendorRating?: VendorRating;
	vendorStatus: VendorStatus;
};

export type VendorStatus = 'researching' | 'contacted' | 'quoted' | 'booked';
export type VendorRating = 1 | 2 | 3 | 4 | 5;

//Rundowns
export type Rundown = {
	id: string;
	title: string;
	description?: string;
	category: RundownCategory;
	startTime: string;
	endTime: string;
	location?: string;
	attendees?: string;
};

export type RundownCategory =
	| 'preparation'
	| 'ceremony'
	| 'reception'
	| 'entertainment'
	| 'logistics'
	| 'photo-video'
	| 'paperwork'
	| 'closing'
	| 'miscellaneous';

// Simple Task for overview
export type SimpleTask = {
	id: string;
	title: string;
	description?: string;
	done: boolean;
};

// DnD
export type Item = {
	id: string | number;
	name: string;
};

export type ColumnType = {
	id: string;
	name: string;
	items: Item[];
};
