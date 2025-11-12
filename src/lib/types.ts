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
	| 'miscellaneous'
	| 'other';

// Tasks
export type Task = {
	id: string;
	weddingId: string;
	description: string;
	category: Category;
	priority: TaskPriority;
	status: TaskStatus;
	dueDate: string;
	completedAt?: Date | null;
	assignedTo?: string | null;
	createdBy: string;
	createdAt: Date;
	updatedAt: Date;
};

export type TaskStatus = 'pending' | 'on_progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';
export type Filter = 'all' | 'active' | 'completed';

// Docs
export type Document = {
	id: string;
	weddingId: string;
	name: string;
	documentCategory: DocumentCategory;
	documentDate: string;
	status: DocumentStatus;
	dueDate?: Date | null;
	notes?: string;
	fileName: string;
	fileSize: number;
	fileUrl: string;
	mimeType: string;
	reminderSent: boolean;
	createdAt: Date;
	updatedAt: Date;
};

export type DocumentCategory =
	| 'legal_formal'
	| 'vendor_finance'
	| 'guest_ceremony'
	| 'personal_keepsake';

export type DocumentStatus = 'pending' | 'approved' | 'rejected';

// Expenses
export type Expense = {
	id: string;
	weddingId: string;
	description: string;
	expenseCategoryId: string;
	category: Category;
	amount: string;
	vendorId?: string | null;
	paymentStatus: ExpenseStatus;
	dueDate: string;
	createdAt: Date;
	updatedAt: Date;
};

export type ExpenseCategory = {
	id: string;
	weddingId: string;
	category: Category;
	allocatedAmount: string;
	spentAmount: string;
	createdAt: Date;
	updatedAt: Date;
};

export type ExpenseStatus = 'unpaid' | 'paid';

// Vendors
export type Vendor = {
	id: string;
	weddingId: string;
	name: string;
	category: Category;
	instagram?: string | null;
	email?: string | null;
	phone?: string | null;
	website?: string | null;
	status: VendorStatus;
	rating: VendorRating;
	totalCost: string | null;
	createdAt: Date;
	updatedAt: Date;
};

export type VendorStatus = 'researching' | 'contacted' | 'quoted' | 'booked';
export type VendorRating = '1' | '2' | '3' | '4' | '5';

//Rundowns
export type Rundown = {
	id: string;
	weddingId: string;
	rundownName: string;
	rundownType: RundownCategory;
	startTime: string;
	endTime: string;
	location: string;
	venue: string;
	attendees: string;
	isPublic: boolean;
	createdAt: Date;
	updatedAt: Date;
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

// Toast System Types
export type CrudOperation = 'create' | 'update' | 'delete' | 'fetch';

export type ToastType =
	| 'message'
	| 'success'
	| 'error'
	| 'warning'
	| 'info'
	| 'loading'
	| 'promise';

export interface ToastOptions {
	duration?: number;
	dismissible?: boolean;
	action?: {
		label: string;
		onClick: (event: MouseEvent) => void;
	};
	description?: string;
	id?: string;
	cancel?: {
		label: string;
		onClick?: (event: MouseEvent) => void;
	};
	onAutoClose?: (toast: ToastMessage) => void;
	onDismiss?: (toast: ToastMessage) => void;
}

export interface ToastMessage {
	type: ToastType;
	message: string;
	options?: ToastOptions;
}

export interface PromiseToastMessages<T = unknown> {
	loading: string;
	success: string | ((data: T) => string);
	error: string;
}

export interface EntityConfig {
	name: string;
	displayName: string;
	operations: {
		create: string;
		update: string;
		delete: string;
		fetch: string;
	};
}

export enum ErrorType {
	VALIDATION = 'validation',
	NETWORK = 'network',
	SERVER = 'server',
	AUTHENTICATION = 'authentication',
	BUSINESS_LOGIC = 'business_logic',
	UNKNOWN = 'unknown',
}

export interface CrudToastMethods {
	success: (operation: CrudOperation, entity?: string) => void;
	error: (operation: CrudOperation, error: string, entity?: string) => void;
	promise: <T>(
		promise: Promise<T>,
		operation: CrudOperation,
		entity?: string,
		messages?: PromiseToastMessages<T>,
	) => void;
}

export interface FormToastMethods {
	success: (message?: string) => void;
	validationError: (
		errors: string[] | { field: string; message: string; displayName?: string }[],
	) => void;
	submitError: (error: string) => void;
	emptyFormError: (options?: {
		formName?: string;
		requiredFields?: string[];
		scrollToFirstField?: () => void;
	}) => void;
	promise: <T>(promise: Promise<T>, messages?: PromiseToastMessages<T>) => void;
}

export interface ToastService {
	// Auth methods (delegate to existing auth-toasts)
	auth: Record<string, unknown>; // Will be typed properly when integrating auth-toasts

	// CRUD operations with promise support
	crud: CrudToastMethods;

	// Form operations with promise support
	form: FormToastMethods;

	// Core svelte-sonner methods
	message: (message: string) => void;
	success: (message: string) => void;
	error: (message: string) => void;
	warning: (message: string) => void;
	info: (message: string) => void;
	promise: <T>(promise: Promise<T>, messages: PromiseToastMessages<T>) => void;

	// Utility methods
	dismiss: (toastId?: string) => void;
	dismissAll: () => void;
}
