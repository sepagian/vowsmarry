import * as v from 'valibot';
import { safeString, safeEmail, safePhone, safeInstagram } from './sanitization';
import type {
	Option,
	Category,
	Task,
	Document,
	Expense,
	Vendor,
	Schedule,
	Dowry,
	Souvenir,
	Dresscode,
} from '$lib/types';

//
// ENUMS
//

export const userRole = [
	{ value: 'partner', label: 'Partner' },
	{ value: 'planner', label: 'Planner' },
	{ value: 'collaborator', label: 'Collaborator' },
] as const;

export const categoryEnum: Option<Category>[] = [
	{
		value: 'accommodation',
		label: 'Accommodation',
		color: 'bg-blue-100 text-blue-800',
		icon: 'i-lucide:bed',
	},
	{
		value: 'catering',
		label: 'Catering',
		color: 'bg-red-100 text-red-800',
		icon: 'i-lucide:utensils',
	},
	{
		value: 'decoration',
		label: 'Decoration',
		color: 'bg-pink-100 text-pink-800',
		icon: 'i-lucide:sparkles',
	},
	{
		value: 'entertainment',
		label: 'Entertainment',
		color: 'bg-purple-100 text-purple-800',
		icon: 'i-lucide:music',
	},
	{
		value: 'makeup-attire',
		label: 'Makeup & Attire',
		color: 'bg-rose-100 text-rose-800',
		icon: 'i-lucide:palette',
	},
	{
		value: 'paperwork',
		label: 'Paperwork',
		color: 'bg-amber-100 text-amber-800',
		icon: 'i-lucide:file-text',
	},
	{
		value: 'photo-video',
		label: 'Photo & Video',
		color: 'bg-green-100 text-green-800',
		icon: 'i-lucide:camera',
	},
	{
		value: 'venue',
		label: 'Venue',
		color: 'bg-indigo-100 text-indigo-800',
		icon: 'i-lucide:map-pin',
	},
	{
		value: 'miscellaneous',
		label: 'Miscellaneous',
		icon: 'i-lucide:more-horizontal',
	},
] as const;

export const taskStatusEnum: Option<NonNullable<Task['taskStatus']>>[] = [
	{
		value: 'pending',
		label: 'Pending',
		icon: 'i-lucide:alarm-clock-minus',
		color: 'bg-gray-200 text-gray-800',
	},
	{
		value: 'on_progress',
		label: 'On Progress',
		icon: 'i-lucide:alarm-clock',
		color: 'bg-yellow-100 text-yellow-800',
	},
	{
		value: 'completed',
		label: 'Completed',
		icon: 'i-lucide:alarm-clock-check',
		color: 'bg-green-100 text-green-800',
	},
] as const;

export const taskPriorityEnum: Option<NonNullable<Task['taskPriority']>>[] = [
	{
		value: 'low',
		label: 'Low',
		icon: 'i-lucide:arrow-down',
		color: 'bg-green-100 text-green-800',
	},
	{
		value: 'medium',
		label: 'Medium',
		icon: 'i-lucide:arrow-right',
		color: 'bg-yellow-100 text-yellow-800',
	},
	{
		value: 'high',
		label: 'High',
		icon: 'i-lucide:arrow-up',
		color: 'bg-red-100 text-red-800',
	},
] as const;

export const documentCategoryEnum: Option<NonNullable<Document['documentCategory']>>[] = [
	{
		value: 'legal_formal',
		label: 'Legal & Formal',
		icon: 'i-lucide:scale',
	},
	{
		value: 'vendor_finance',
		label: 'Vendor & Finance',
		icon: 'i-lucide:scroll-text',
	},
	{
		value: 'guest_ceremony',
		label: 'Guest & Ceremony',
		icon: 'i-lucide:book-open-check',
	},
	{
		value: 'personal_keepsake',
		label: 'Personal & Keepsake',
		icon: 'i-lucide:heart',
	},
] as const;

export const expenseStatusEnum: Option<NonNullable<Expense['expensePaymentStatus']>>[] = [
	{
		value: 'unpaid',
		label: 'Unpaid',
	},
	{
		value: 'paid',
		label: 'Paid',
	},
] as const;

export const vendorStatusEnum: Option<NonNullable<Vendor['vendorStatus']>>[] = [
	{
		value: 'researching',
		label: 'Researching',
	},
	{
		value: 'contacted',
		label: 'Contacted',
	},
	{
		value: 'quoted',
		label: 'Quoted',
	},
	{
		value: 'booked',
		label: 'Booked',
	},
] as const;

export const vendorRatingEnum: Option<NonNullable<Vendor['vendorRating']>>[] = [
	{ value: '1', label: '1' },
	{ value: '2', label: '2' },
	{ value: '3', label: '3' },
	{ value: '4', label: '4' },
	{ value: '5', label: '5' },
] as const;

export const scheduleCategoryEnum: Option<NonNullable<Schedule['scheduleCategory']>>[] = [
	{
		value: 'preparation',
		label: 'Preparation',
		icon: 'i-lucide:sparkles',
		color: 'bg-blue-100 text-blue-800',
	},
	{
		value: 'ceremony',
		label: 'Ceremony',
		icon: 'i-lucide:heart',
		color: 'bg-pink-100 text-pink-800',
	},
	{
		value: 'reception',
		label: 'Reception',
		icon: 'i-lucide:utensils',
		color: 'bg-yellow-100 text-yellow-800',
	},
	{
		value: 'entertainment',
		label: 'Entertainment',
		icon: 'i-lucide:music',
		color: 'bg-purple-100 text-purple-800',
	},
	{
		value: 'logistics',
		label: 'Logistics',
		icon: 'i-lucide:truck',
		color: 'bg-orange-100 text-orange-800',
	},
	{
		value: 'photo-video',
		label: 'Photo & Video',
		icon: 'i-lucide:camera',
		color: 'bg-green-100 text-green-800',
	},
	{
		value: 'paperwork',
		label: 'Paperwork',
		icon: 'i-lucide:scroll',
		color: 'bg-red-100 text-red-800',
	},
	{
		value: 'closing',
		label: 'Closing & Afterparty',
		icon: 'i-lucide:party-popper',
		color: 'bg-indigo-100 text-indigo-800',
	},
	{
		value: 'miscellaneous',
		label: 'Miscellaneous',
		icon: 'i-lucide:more-horizontal',
		color: 'bg-gray-100 text-gray-800',
	},
] as const;

export const dowryCategoryEnum: Option<NonNullable<Dowry['dowryCategory']>>[] = [
	{ value: 'cash', label: 'Cash' },
	{ value: 'gold', label: 'Gold' },
	{ value: 'jewelry', label: 'Jewelry' },
	{ value: 'fashion', label: 'Fashion' },
	{ value: 'beauty', label: 'Beauty' },
	{ value: 'furniture', label: 'Furniture' },
	{ value: 'property', label: 'Property' },
	{ value: 'other', label: 'Other' },
] as const;

export const dowryStatusEnum: Option<NonNullable<Dowry['dowryStatus']>>[] = [
	{ value: 'pending', label: 'Pending' },
	{ value: 'delivered', label: 'Delivered' },
	{ value: 'received', label: 'Received' },
] as const;

export const dowryRecipientEnum: Option<NonNullable<Dowry['dowryRecipient']>>[] = [
	{ value: 'groom', label: 'Groom' },
	{ value: 'bride', label: 'Bride' },
] as const;

export const dresscodeRoleEnum: Option<NonNullable<Dresscode['dresscodeRole']>>[] = [
	{ value: 'bride', label: 'Bride' },
	{ value: 'groom', label: 'Groom' },
	{ value: 'bride_family', label: 'Bride Family' },
	{ value: 'groom_family', label: 'Groom Family' },
	{ value: 'bridesmaids', label: 'Bridesmaids' },
	{ value: 'groomsmen', label: 'Groomsmen' },
	{ value: 'others', label: 'Others' },
] as const;

const souvenirStatusEnum: Option<NonNullable<Souvenir['souvenirStatus']>>[] = [
	{ value: 'planned', label: 'Planned' },
	{ value: 'ordered', label: 'Ordered' },
	{ value: 'delivered', label: 'Delivered' },
	{ value: 'received', label: 'Received' },
] as const;

//
// CORE VALIDATION
//

export const weddingSchema = v.object({
	groomName: v.pipe(
		v.string(),
		v.nonEmpty('Groom name is required'),
		v.minLength(2, 'Groom name must be at least 2 characters'),
	),
	brideName: v.pipe(
		v.string(),
		v.nonEmpty('Bride name is required'),
		v.minLength(2, 'Bride name must be at least 2 characters'),
	),
	weddingDate: v.pipe(v.string(), v.isoDate('Please enter a valid date')),
	weddingVenue: v.optional(v.string()),
	weddingBudget: v.number(),
});

export type WeddingData = v.InferInput<typeof weddingSchema>;

export const userSchema = v.object({
	userName: v.pipe(v.string(), v.nonEmpty('Name is required')),
	userEmail: v.pipe(v.string(), v.email()),
	userPhone: v.optional(v.string()),
	userRole: v.optional(v.picklist(userRole.map((r) => r.value))),
	userAvatarUrl: v.optional(v.pipe(v.string(), v.url())),
});

export type UserData = v.InferInput<typeof userSchema>;

//
// TASKS VALIDATION
//

export const taskSchema = v.object({
	taskDescription: v.pipe(
		v.string(),
		v.nonEmpty('Task description is required'),
		v.minLength(2, 'Task description must be at least 2 characters'),
	),
	taskCategory: v.picklist(categoryEnum.map((c) => c.value, 'Please select a category')),
	taskStatus: v.picklist(taskStatusEnum.map((s) => s.value, 'Please select a status')),
	taskPriority: v.picklist(taskPriorityEnum.map((p) => p.value, 'Please select a priority')),
	taskDueDate: v.pipe(v.string(), v.isoDate()),
	completedAt: v.optional(v.pipe(v.string(), v.isoDate())),
});

export type TaskData = v.InferInput<typeof taskSchema>;

//
// DOCUMENTS VALIDATION
//

export const documentSchema = v.object({
	documentName: v.pipe(
		safeString(),
		v.nonEmpty('Document name is required'),
		v.minLength(2, 'Document name must be at least 2 characters'),
	),
	documentCategory: v.picklist(
		documentCategoryEnum.map((c) => c.value, 'Please select a category'),
	),
	documentDate: v.pipe(v.string(), v.isoDate()),
	file: v.optional(v.array(v.any())), // File array from form data
	fileUrl: v.optional(v.pipe(v.string(), v.url())),
	fileName: v.optional(v.string()),
	fileSize: v.optional(v.pipe(v.number(), v.integer())),
	mimeType: v.optional(v.string()),
	createdAt: v.optional(v.date()),
	updatedAt: v.optional(v.date()),
});

export type DocumentData = v.InferInput<typeof documentSchema>;

//
// FINANCE VALIDATION
//

export const expenseSchema = v.object({
	expenseDescription: v.pipe(
		v.string(),
		v.nonEmpty('Expense description is required'),
		v.minLength(2, 'Expense description must be at least 2 characters'),
	),
	expenseCategory: v.picklist(categoryEnum.map((c) => c.value, 'Please select a category')),
	expenseAmount: v.pipe(v.number(), v.integer()),
	expensePaymentStatus: v.picklist(expenseStatusEnum.map((s) => s.value, 'Please select a status')),
	expenseDueDate: v.pipe(v.string(), v.isoDate()),
});

export type ExpenseData = v.InferInput<typeof expenseSchema>;

export const savingSchema = v.object({
	id: v.string(),
	weddingId: v.string(),
	savingId: v.string(),
	savingDescription: v.pipe(
		v.string(),
		v.nonEmpty('Saving description is required'),
		v.minLength(2, 'Saving description must be at least 2 characters'),
	),
	savingAmount: v.pipe(v.number(), v.integer()),
	savingDate: v.date(),
	createdAt: v.date(),
	updatedAt: v.date(),
});

export type SavingData = v.InferInput<typeof savingSchema>;

//
// VENDOR VALIDATION
//

export const vendorSchema = v.object({
	vendorName: v.pipe(
		safeString(),
		v.nonEmpty('Vendor name is required'),
		v.minLength(2, 'Vendor name must be at least 2 characters'),
	),
	vendorCategory: v.picklist(categoryEnum.map((c) => c.value, 'Please select a category')),
	vendorInstagram: v.optional(safeInstagram()),
	vendorEmail: v.optional(safeEmail()),
	vendorPhone: v.optional(safePhone()),
	vendorNotes: v.optional(safeString()),
	vendorStatus: v.picklist(vendorStatusEnum.map((s) => s.value, 'Please select a status')),
	vendorRating: v.picklist(vendorRatingEnum.map((r) => r.value, 'Please select a rating')),
});

export type VendorData = v.InferInput<typeof vendorSchema>;

//
// SCHEDULE VALIDATION
//

export const scheduleSchema = v.object({
	scheduleName: v.pipe(
		safeString(),
		v.nonEmpty('Schedule title is required'),
		v.minLength(2, 'Schedule title must be at least 2 characters'),
	),
	scheduleCategory: v.picklist(
		scheduleCategoryEnum.map((c) => c.value, 'Please select a category'),
	),
	scheduleDate: v.pipe(v.string(), v.isoDate()),
	scheduleStartTime: v.pipe(v.string(), v.isoTime()),
	scheduleEndTime: v.pipe(v.string(), v.isoTime()),
	scheduleLocation: v.string(),
	scheduleVenue: v.string(),
	scheduleAttendees: v.string(),
	scheduleNotes: v.optional(v.string()),
	isPublic: v.boolean(),
});

export type ScheduleData = v.InferInput<typeof scheduleSchema>;

//
// DOWRY VALIDATION
//

export const dowrySchema = v.object({
	id: v.string(),
	weddingId: v.string(),
	dowryDescription: v.pipe(
		safeString(),
		v.nonEmpty('Dowry description is required'),
		v.minLength(2, 'Dowry description must be at least 2 characters'),
	),
	dowryCategory: v.picklist(dowryCategoryEnum.map((t) => t.value, 'Please select a type')),
	dowryPrice: v.pipe(v.number(), v.integer()),
	dowryQuantity: v.pipe(v.number(), v.integer()),
	dowryStatus: v.picklist(dowryStatusEnum.map((s) => s.value, 'Please select a status')),
	dowryDateReceived: v.pipe(v.string(), v.isoDate()),
	dowryRecipient: v.picklist(dowryRecipientEnum.map((r) => r.value, 'Please select a recipient')),
	createdAt: v.date(),
	updatedAt: v.date(),
});

export type DowryData = v.InferInput<typeof dowrySchema>;

//
// SOUVENIR VALIDATION
//

export const souvenirSchema = v.object({
	id: v.string(),
	weddingId: v.string(),
	souvenirName: v.pipe(
		safeString(),
		v.nonEmpty('Souvenir name is required'),
		v.minLength(2, 'Souvenir name must be at least 2 characters'),
	),
	souvenirQuantity: v.pipe(v.number(), v.integer()),
	souvenirPrice: v.pipe(v.number(), v.integer()),
	souvenirStatus: v.picklist(souvenirStatusEnum.map((s) => s.value, 'Please select a status')),
	souvenirOrderDate: v.pipe(v.string(), v.isoDate()),
	createdAt: v.date(),
	updatedAt: v.date(),
});

export type SouvenirData = v.InferInput<typeof souvenirSchema>;

//
// DRESSCODE VALIDATION
//

export const dresscodeSchema = v.object({
	id: v.string(),
	weddingId: v.string(),
	scheduleId: v.string(),
	dresscodeDescription: v.pipe(safeString(), v.nonEmpty('Dresscode description is required')),
	dresscodeRole: v.picklist(dresscodeRoleEnum.map((r) => r.value, 'Please select a role')),
	dresscodeImageUrl: v.optional(v.pipe(v.string(), v.url())),
	createdAt: v.date(),
	updatedAt: v.date(),
});

export type DresscodeData = v.InferInput<typeof dresscodeSchema>;
