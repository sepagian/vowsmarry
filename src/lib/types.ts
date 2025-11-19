// Form data types inferred from validation schemas
import type {
	LoginData,
	RegisterData,
	ForgotPasswordData,
	ResetPasswordData,
	WeddingData,
	UserData,
	TaskData,
	DocumentData,
	ExpenseData,
	SavingData,
	VendorData,
	ScheduleData,
	DowryData,
	SouvenirData,
	DresscodeData,
} from '$lib/validation';

// Re-export form data types with better naming
export type TaskFormData = TaskData;
export type { LoginData, RegisterData, ForgotPasswordData, ResetPasswordData };
export type { WeddingData, UserData, DocumentData, ExpenseData };
export type { SavingData, VendorData, ScheduleData, DowryData };
export type { SouvenirData, DresscodeData };

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

// TASKS

export type Task = {
	id?: string;
	taskDescription: string;
	taskCategory: Category;
	taskPriority: TaskPriority;
	taskStatus: TaskStatus;
	taskDueDate: string;
	completedAt?: Date | null;
};

export type TaskStatus = 'pending' | 'on_progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';
export type Filter = 'all' | 'active' | 'completed';

// DOCUMENT

export type Document = {
	id?: string;
	documentName: string;
	documentCategory: DocumentCategory;
	documentDate: string;
	documentStatus: DocumentStatus;
	documentDueDate?: string | null;
	fileUrl: string;
	fileName: string;
	fileSize: number;
	mimeType: string;
};

export type DocumentCategory =
	| 'legal_formal'
	| 'vendor_finance'
	| 'guest_ceremony'
	| 'personal_keepsake';

export type DocumentStatus = 'pending' | 'approved' | 'rejected';

// EXPENSES

export type Expense = {
	id?: string;
	expenseDescription: string;
	expenseCategory: Category;
	expenseAmount: string;
	expensePaymentStatus: ExpenseStatus;
	expenseDueDate: string;
};

export type ExpenseStatus = 'unpaid' | 'paid';

// VENDOR

export type Vendor = {
	id?: string;
	vendorName: string;
	vendorCategory: Category;
	vendorInstagram?: string | null;
	vendorEmail?: string | null;
	vendorPhone?: string | null;
	vendorWebsite?: string | null;
	vendorStatus: VendorStatus;
	vendorRating: VendorRating;
};

export type VendorStatus = 'researching' | 'contacted' | 'quoted' | 'booked';
export type VendorRating = '1' | '2' | '3' | '4' | '5';

// SCHEDULE

export type Schedule = {
	id?: string;
	scheduleName: string;
	scheduleCategory: ScheduleCategory;
	scheduleDate: string;
	scheduleStartTime: string;
	scheduleEndTime: string;
	scheduleLocation: string;
	scheduleVenue: string;
	scheduleAttendees: string;
};

export type ScheduleCategory =
	| 'preparation'
	| 'ceremony'
	| 'reception'
	| 'entertainment'
	| 'logistics'
	| 'photo-video'
	| 'paperwork'
	| 'closing'
	| 'miscellaneous';

// CALENDAR

import type { Temporal } from 'temporal-polyfill';

export type CalendarEventSource = 'schedule' | 'task' | 'expense';

export interface UnifiedCalendarEvent {
	id: string;
	title: string;
	description?: string;
	start: Temporal.ZonedDateTime | Temporal.PlainDate;
	end: Temporal.ZonedDateTime | Temporal.PlainDate;
	calendarId: string;
	source: CalendarEventSource;
	sourceData: Schedule | Task | Expense;
	isOverdue?: boolean;
}

// DOWRY

export type Dowry = {
	id?: string;
	dowryDescription: string;
	dowryCategory: DowryCategory;
	dowryPrice: string;
	dowryQuantity: number;
	dowryStatus: DowryStatus;
	dowryDateReceived: string;
	dowryRecipient: DowryRecipient;
};

export type DowryCategory =
	| 'cash'
	| 'gold'
	| 'jewelry'
	| 'fashion'
	| 'beauty'
	| 'furniture'
	| 'property'
	| 'other';

export type DowryStatus = 'pending' | 'delivered' | 'received';

export type DowryRecipient = 'groom' | 'bride';

// DRESSCODE

export type Dresscode = {
	id?: string;
	dresscodeDescription: string;
	dresscodeRole: DresscodeRole;
	dresscodeImageUrl?: string;
};

export type DresscodeRole =
	| 'groom'
	| 'bride'
	| 'groom_family'
	| 'bride_family'
	| 'bridesmaids'
	| 'groomsmen'
	| 'others';

// SOUVENIR

export type Souvenir = {
	id?: string;
	souvenirName: string;
	souvenirQuantity: number;
	souvenirPrice: string;
	souvenirTotalCost: string;
	souvenirStatus: SouvenirStatus;
	souvenirOrderDate?: Date;
};

export type SouvenirStatus = 'planned' | 'ordered' | 'delivered' | 'received';

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
