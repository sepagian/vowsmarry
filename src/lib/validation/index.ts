import { z } from 'zod/v4';
import {
	emailValidator,
	phoneValidator,
	urlValidator,
	instagramValidator,
	currencyValidator,
	textLengthValidator,
	expenseDescriptionValidator,
	expenseDateValidator
} from './utils.js';
import { sanitizeText, sanitizeHtml } from './sanitization.js';

// =============================================================================
// SHARED ENUMS & CONSTANTS
// =============================================================================

/** Wedding planning categories used across documents, expenses, tasks, vendors, and schedule events */
export const categorySchema = {
	accommodation: 'Accommodation',
	catering: 'Catering',
	decoration: 'Decoration',
	entertainment: 'Entertainment',
	'makeup-attire': 'Makeup & Attire',
	paperwork: 'Paperwork',
	'photo-video': 'Photo & Video',
	venue: 'Venue',
	miscellaneous: 'Miscellaneous',
} as const;

/** Task completion status options */
export const taskStatusSchema = {
	pending: 'Pending',
	'on-progress': 'On Progress',
	completed: 'Completed',
} as const;

/** Task priority levels for organizing workflow */
export const taskPrioritySchema = { low: 'Low', medium: 'Medium', high: 'High' } as const;

/** Payment status for expenses and vendor payments */
export const paymentStatusSchema = {
	pending: 'Pending',
	paid: 'Paid',
} as const;

/** Vendor rating scale from 1-5 stars */
export const vendorRatingSchema = {
	1: '1',
	2: '2',
	3: '3',
	4: '4',
	5: '5',
} as const;

/** Vendor relationship status tracking */
export const vendorStatusSchema = {
	researching: 'Researching',
	contacted: 'Contacted',
	quoted: 'Quoted',
	booked: 'Booked',
} as const;

type Category = keyof typeof categorySchema;
type Priority = keyof typeof taskPrioritySchema;
type VendorStatus = keyof typeof vendorStatusSchema;
type PaymentStatus = keyof typeof paymentStatusSchema;
type TaskStatus = keyof typeof taskStatusSchema;

// =============================================================================
// DOCUMENT SCHEMAS
// =============================================================================

/** 
 * Document upload form validation schema
 * Handles wedding paperwork like contracts, licenses, permits with file upload validation
 */
export const documentFormSchema = z.object({
	name: textLengthValidator('Document name', 1, 200)
		.transform(sanitizeText),

	category: z.enum(Object.keys(categorySchema) as [Category, ...Category[]], {
		message: 'Please select a valid document category'
	}),

	file: z
		.array(
			z
				.instanceof(File)
				.refine(
					(f) => f.size <= 10_000_000, // 10MB limit
					{
						message: 'File size must be less than 10MB. Please compress your file or choose a smaller one.'
					}
				)
				.refine(
					(f) => ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'].includes(f.type),
					{
						message: 'Only PDF, JPEG, and PNG files are allowed. Please convert your file to one of these formats.'
					}
				)
				.refine(
					(f) => f.name.length <= 255,
					{
						message: 'File name is too long. Please rename your file to be shorter than 255 characters.'
					}
				)
		)
		.max(1, { message: 'Please upload only one file at a time.' })
		.min(1, { message: 'Please upload a file. Documents require an attached file.' }),

	date: z.coerce.date({
		message: 'Please select a valid date'
	})
		.refine(
			(date) => {
				const today = new Date();
				const oneYearAgo = new Date();
				oneYearAgo.setFullYear(today.getFullYear() - 1);
				const twoYearsFromNow = new Date();
				twoYearsFromNow.setFullYear(today.getFullYear() + 2);

				return date >= oneYearAgo && date <= twoYearsFromNow;
			},
			{
				message: 'Document date must be within the last year or up to 2 years in the future'
			}
		),

	expiryDate: z.coerce.date({
		message: 'Please select a valid expiry date'
	}).optional(),

	description: z.string()
		.max(500, { message: 'Description must be less than 500 characters' })
		.transform(sanitizeHtml)
		.optional()
		.or(z.literal(''))
}).refine(
	(data) => {
		if (data.expiryDate && data.date) {
			return data.expiryDate > data.date;
		}
		return true;
	},
	{
		message: 'Expiry date must be after the document date',
		path: ['expiryDate']
	}
);

/** Main document schema with action discrimination for form handling */
export const documentSchema = z.discriminatedUnion('action', [
	z.object({
		...documentFormSchema.shape,
		action: z.literal('default')
	}).refine(
		(data) => {
			if (data.expiryDate && data.date) {
				return data.expiryDate > data.date;
			}
			return true;
		},
		{
			message: 'Expiry date must be after the document date',
			path: ['expiryDate']
		}
	),
]);

export type DocumentSchema = typeof documentSchema;

// =============================================================================
// EXPENSE SCHEMAS
// =============================================================================

/**
 * Expense tracking form validation schema
 * Handles wedding budget expenses with category-specific amount validation and payment status
 */
export const expenseFormSchema = z.object({
	description: expenseDescriptionValidator
		.transform(sanitizeText),

	amount: currencyValidator(0.01, 1_000_000_000, 'Amount must be greater than 0'),

	category: z.enum(Object.keys(categorySchema) as [Category, ...Category[]], {
		message: 'Please select a valid expense category'
	}),

	status: z
		.enum(Object.keys(paymentStatusSchema) as [PaymentStatus, ...PaymentStatus[]], {
			message: 'Please select a valid payment status'
		})
		.default('pending'),

	date: expenseDateValidator(true, true),

	notes: z.string()
		.max(1000, { message: 'Notes must be less than 1000 characters' })
		.transform(sanitizeHtml)
		.optional()
		.or(z.literal(''))
})
	.superRefine((data, ctx) => {
		// Category-specific validation rules with detailed error messages
		const categoryLimits: Record<Category, { min: number; max: number; typical: string }> = {
			venue: {
				min: 100_000,
				max: 100_000_000,
				typical: 'Venue costs typically range from 100,000 to 100,000,000 (100K - 100M)'
			},
			catering: {
				min: 50_000,
				max: 50_000_000,
				typical: 'Catering costs typically range from 50,000 to 50,000,000 (50K - 50M)'
			},
			decoration: {
				min: 10_000,
				max: 20_000_000,
				typical: 'Decoration costs typically range from 10,000 to 20,000,000 (10K - 20M)'
			},
			entertainment: {
				min: 50_000,
				max: 10_000_000,
				typical: 'Entertainment costs typically range from 50,000 to 10,000,000 (50K - 10M)'
			},
			'makeup-attire': {
				min: 100_000,
				max: 15_000_000,
				typical: 'Makeup & attire costs typically range from 100,000 to 15,000,000 (100K - 15M)'
			},
			paperwork: {
				min: 10_000,
				max: 5_000_000,
				typical: 'Paperwork costs typically range from 10,000 to 5,000,000 (10K - 5M)'
			},
			'photo-video': {
				min: 500_000,
				max: 25_000_000,
				typical: 'Photo & video costs typically range from 500,000 to 25,000,000 (500K - 25M)'
			},
			accommodation: {
				min: 200_000,
				max: 50_000_000,
				typical: 'Accommodation costs typically range from 200,000 to 50,000,000 (200K - 50M)'
			},
			miscellaneous: {
				min: 1_000,
				max: 10_000_000,
				typical: 'Miscellaneous costs typically range from 1,000 to 10,000,000 (1K - 10M)'
			}
		};

		const categoryLimit = categoryLimits[data.category];
		if (categoryLimit) {
			if (data.amount < categoryLimit.min) {
				ctx.addIssue({
					code: 'custom',
					message: `Amount seems low for ${categorySchema[data.category]}. ${categoryLimit.typical}. Please verify this amount is correct.`,
					path: ['amount']
				});
			} else if (data.amount > categoryLimit.max) {
				ctx.addIssue({
					code: 'custom',
					message: `Amount seems high for ${categorySchema[data.category]}. ${categoryLimit.typical}. Please verify this amount is correct.`,
					path: ['amount']
				});
			}
		}
	});

/** Main expense schema with action discrimination and category-specific amount validation */
export const expenseSchema = z.discriminatedUnion('action', [
	z.object({
		...expenseFormSchema.shape,
		action: z.literal('default')
	}).superRefine((data, ctx) => {
		// Re-apply the category-specific validation rules
		const categoryLimits: Record<Category, { min: number; max: number; typical: string }> = {
			venue: {
				min: 100_000,
				max: 100_000_000,
				typical: 'Venue costs typically range from 100,000 to 100,000,000 (100K - 100M)'
			},
			catering: {
				min: 50_000,
				max: 50_000_000,
				typical: 'Catering costs typically range from 50,000 to 50,000,000 (50K - 50M)'
			},
			decoration: {
				min: 10_000,
				max: 20_000_000,
				typical: 'Decoration costs typically range from 10,000 to 20,000,000 (10K - 20M)'
			},
			entertainment: {
				min: 50_000,
				max: 10_000_000,
				typical: 'Entertainment costs typically range from 50,000 to 10,000,000 (50K - 10M)'
			},
			'makeup-attire': {
				min: 100_000,
				max: 15_000_000,
				typical: 'Makeup & attire costs typically range from 100,000 to 15,000,000 (100K - 15M)'
			},
			paperwork: {
				min: 10_000,
				max: 5_000_000,
				typical: 'Paperwork costs typically range from 10,000 to 5,000,000 (10K - 5M)'
			},
			'photo-video': {
				min: 500_000,
				max: 25_000_000,
				typical: 'Photo & video costs typically range from 500,000 to 25,000,000 (500K - 25M)'
			},
			accommodation: {
				min: 200_000,
				max: 50_000_000,
				typical: 'Accommodation costs typically range from 200,000 to 50,000,000 (200K - 50M)'
			},
			miscellaneous: {
				min: 1_000,
				max: 10_000_000,
				typical: 'Miscellaneous costs typically range from 1,000 to 10,000,000 (1K - 10M)'
			}
		};

		const categoryLimit = categoryLimits[data.category];
		if (categoryLimit) {
			if (data.amount < categoryLimit.min) {
				ctx.addIssue({
					code: 'custom',
					message: `Amount seems low for ${categorySchema[data.category]}. ${categoryLimit.typical}. Please verify this amount is correct.`,
					path: ['amount']
				});
			} else if (data.amount > categoryLimit.max) {
				ctx.addIssue({
					code: 'custom',
					message: `Amount seems high for ${categorySchema[data.category]}. ${categoryLimit.typical}. Please verify this amount is correct.`,
					path: ['amount']
				});
			}
		}
	})
]);

export type ExpenseSchema = typeof expenseSchema;

// =============================================================================
// TASK SCHEMAS
// =============================================================================

/** 
 * Task management form validation schema
 * Handles wedding planning to-do items with priority levels and due date validation
 */
export const taskFormSchema = z.object({
	description: z
		.string()
		.min(5, { message: 'Task description must be at least 5 characters long' })
		.max(1000, { message: 'Task description must be less than 1000 characters' })
		.refine(
			(desc) => {
				// Ensure description is meaningful (not just spaces or repeated characters)
				const trimmed = desc.trim();
				const uniqueChars = new Set(trimmed.toLowerCase().replace(/\s/g, '')).size;
				return uniqueChars >= 3; // At least 3 different characters
			},
			{
				message: 'Please provide a more descriptive task description'
			}
		)
		.transform((desc) => {
			// Capitalize first letter and clean up spacing
			const cleaned = desc.trim().replace(/\s+/g, ' ');
			return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
		}),
	category: z.enum(Object.keys(categorySchema) as [Category, ...Category[]]),
	priority: z.enum(Object.keys(taskPrioritySchema) as [Priority, ...Priority[]]),
	status: z.enum(Object.keys(taskStatusSchema) as [TaskStatus, ...TaskStatus[]]).default('pending'),
	date: z.coerce.date({
		message: 'Please select a valid due date'
	}).refine(
		(date) => {
			const today = new Date();
			today.setHours(0, 0, 0, 0); // Reset time to start of day for comparison
			return date >= today;
		},
		{
			message: 'Due date cannot be in the past'
		}
	),
}).refine(
	(data) => {
		// Conditional priority validation based on status
		if (data.status === 'completed' && data.priority === 'high') {
			// High priority tasks should be completed within reasonable time
			const today = new Date();
			const taskDate = new Date(data.date);
			const daysDiff = Math.ceil((today.getTime() - taskDate.getTime()) / (1000 * 60 * 60 * 24));

			// If high priority task is overdue by more than 7 days, show warning
			if (daysDiff > 7) {
				return true; // Allow but could add warning in UI
			}
		}

		// High priority tasks should have more detailed descriptions
		if (data.priority === 'high' && data.description.length < 20) {
			return false;
		}

		return true;
	},
	{
		message: 'High priority tasks require more detailed descriptions (at least 20 characters)',
		path: ['description']
	}
);

/** Main task schema with action discrimination and priority-based validation rules */
export const taskSchema = z.discriminatedUnion('action', [
	z.object({
		action: z.literal('default'),
		description: z
			.string()
			.min(5, { message: 'Task description must be at least 5 characters long' })
			.max(1000, { message: 'Task description must be less than 1000 characters' })
			.refine(
				(desc) => {
					// Ensure description is meaningful (not just spaces or repeated characters)
					const trimmed = desc.trim();
					const uniqueChars = new Set(trimmed.toLowerCase().replace(/\s/g, '')).size;
					return uniqueChars >= 3; // At least 3 different characters
				},
				{
					message: 'Please provide a more descriptive task description'
				}
			)
			.transform((desc) => {
				// Capitalize first letter and clean up spacing
				const cleaned = desc.trim().replace(/\s+/g, ' ');
				return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
			}),
		category: z.enum(Object.keys(categorySchema) as [Category, ...Category[]]),
		priority: z.enum(Object.keys(taskPrioritySchema) as [Priority, ...Priority[]]),
		status: z.enum(Object.keys(taskStatusSchema) as [TaskStatus, ...TaskStatus[]]).default('pending'),
		date: z.coerce.date({
			message: 'Please select a valid due date'
		}).refine(
			(date) => {
				const today = new Date();
				today.setHours(0, 0, 0, 0); // Reset time to start of day for comparison
				return date >= today;
			},
			{
				message: 'Due date cannot be in the past'
			}
		),
	}).refine(
		(data) => {
			// Conditional priority validation based on status
			if (data.status === 'completed' && data.priority === 'high') {
				// High priority tasks should be completed within reasonable time
				const today = new Date();
				const taskDate = new Date(data.date);
				const daysDiff = Math.ceil((today.getTime() - taskDate.getTime()) / (1000 * 60 * 60 * 24));

				// If high priority task is overdue by more than 7 days, show warning
				if (daysDiff > 7) {
					return true; // Allow but could add warning in UI
				}
			}

			// High priority tasks should have more detailed descriptions
			if (data.priority === 'high' && data.description.length < 20) {
				return false;
			}

			return true;
		},
		{
			message: 'High priority tasks require more detailed descriptions (at least 20 characters)',
			path: ['description']
		}
	)
]);

export type TaskSchema = typeof taskSchema;

// =============================================================================
// VENDOR SCHEMAS
// =============================================================================

/** 
 * Vendor management form validation schema
 * Handles wedding service providers with contact info, pricing, and relationship status tracking
 */
export const vendorFormSchema = z.object({
	name: textLengthValidator('Vendor name', 2, 100)
		.transform(sanitizeText),

	category: z.enum(Object.keys(categorySchema) as [Category, ...Category[]], {
		message: 'Please select a valid vendor category'
	}),

	instagram: instagramValidator,

	email: z.string()
		.optional()
		.refine((val) => !val || val === '' || z.string().email().safeParse(val).success, {
			message: 'Please enter a valid email address'
		})
		.transform(val => val ? val.toLowerCase().trim() : ''),

	phone: z.string()
		.optional()
		.refine((val) => !val || val === '' || /^[\+]?[1-9][\d\s\-\(\)]{7,15}$/.test(val), {
			message: 'Please enter a valid phone number'
		}),

	website: z.string()
		.optional()
		.refine((val) => !val || val === '' || z.string().url().safeParse(val).success, {
			message: 'Please enter a valid website URL (e.g., https://example.com)'
		}),

	price: currencyValidator(0.01, 1_000_000_000, 'Price must be greater than 0'),

	rating: z.enum(Object.keys(vendorRatingSchema) as [string, ...string[]], {
		message: 'Please select a rating between 1 and 5'
	}),

	status: z
		.enum(Object.keys(vendorStatusSchema) as [VendorStatus, ...VendorStatus[]], {
			message: 'Please select a valid vendor status'
		})
		.default('researching'),

	notes: z.string()
		.max(1000, { message: 'Notes must be less than 1000 characters' })
		.transform(sanitizeHtml)
		.optional()
		.or(z.literal(''))
});

/** Main vendor schema with action discrimination for form handling */
export const vendorSchema = z.discriminatedUnion('action', [
	vendorFormSchema.extend({ action: z.literal('default') }),
]);

export type VendorSchema = typeof vendorSchema;

// =============================================================================
// SCHEDULE/RUNDOWN SCHEMAS
// =============================================================================

/** Wedding day schedule event categories for organizing the timeline */
export const rundownCategorySchema = {
	preparation: 'Preparation',
	ceremony: 'Ceremony',
	reception: 'Reception',
	entertainment: 'Entertainment',
	logistics: 'Logistics',
	'photo-video': 'Photo & Video',
	paperwork: 'Paperwork',
	closing: 'Closing',
	miscellaneous: 'Miscellaneous'
} as const;

type RundownCategory = keyof typeof rundownCategorySchema;

/** Time format validator for schedule events (HH:MM format with reasonable wedding hours) */
export const scheduleTimeValidator = z.string()
	.regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
		message: 'Please enter time in HH:MM format (e.g., 14:30)'
	})
	.refine((time) => {
		// Additional validation for reasonable times (not too early/late)
		const [hours, minutes] = time.split(':').map(Number);
		const totalMinutes = hours * 60 + minutes;

		// Wedding events typically happen between 6:00 AM and 11:59 PM
		return totalMinutes >= 360 && totalMinutes <= 1439; // 6:00 AM to 11:59 PM
	}, {
		message: 'Event time should be between 06:00 and 23:59 for typical wedding schedules'
	});

/** 
 * Schedule event form validation schema
 * Handles wedding day timeline events with time validation and category-specific duration rules
 */
export const scheduleEventFormSchema = z.object({
	title: textLengthValidator('Event title', 2, 200)
		.transform(sanitizeText),

	category: z.enum(Object.keys(rundownCategorySchema) as [RundownCategory, ...RundownCategory[]], {
		message: 'Please select a valid event category'
	}),

	startTime: scheduleTimeValidator,

	endTime: scheduleTimeValidator,

	description: z.string()
		.max(500, { message: 'Description must be less than 500 characters' })
		.transform(sanitizeHtml)
		.optional()
		.or(z.literal('')),

	location: z.string()
		.max(200, { message: 'Location must be less than 200 characters' })
		.transform(sanitizeText)
		.optional()
		.or(z.literal('')),

	responsible: z.string()
		.max(100, { message: 'Responsible person must be less than 100 characters' })
		.transform(sanitizeText)
		.optional()
		.or(z.literal(''))
})
	.refine((data) => {
		// Validate time range
		const [startHours, startMinutes] = data.startTime.split(':').map(Number);
		const [endHours, endMinutes] = data.endTime.split(':').map(Number);

		const startTotalMinutes = startHours * 60 + startMinutes;
		const endTotalMinutes = endHours * 60 + endMinutes;

		return endTotalMinutes > startTotalMinutes;
	}, {
		message: 'End time must be after start time',
		path: ['endTime']
	})
	.refine((data) => {
		// Validate reasonable duration
		const [startHours, startMinutes] = data.startTime.split(':').map(Number);
		const [endHours, endMinutes] = data.endTime.split(':').map(Number);

		const startTotalMinutes = startHours * 60 + startMinutes;
		const endTotalMinutes = endHours * 60 + endMinutes;
		const duration = endTotalMinutes - startTotalMinutes;

		// Duration should be between 15 minutes and 8 hours
		return duration >= 15 && duration <= 480;
	}, {
		message: 'Event duration should be between 15 minutes and 8 hours',
		path: ['endTime']
	})
	.superRefine((data, ctx) => {
		// Category-specific validation rules
		const categoryRequirements: Record<RundownCategory, {
			minDuration?: number;
			maxDuration?: number;
			requiresLocation?: boolean;
			requiresResponsible?: boolean;
			suggestedDuration?: string;
		}> = {
			preparation: {
				minDuration: 30,
				maxDuration: 180,
				requiresLocation: true,
				suggestedDuration: '30 minutes to 3 hours'
			},
			ceremony: {
				minDuration: 30,
				maxDuration: 120,
				requiresLocation: true,
				requiresResponsible: true,
				suggestedDuration: '30 minutes to 2 hours'
			},
			reception: {
				minDuration: 60,
				maxDuration: 300,
				requiresLocation: true,
				suggestedDuration: '1 to 5 hours'
			},
			entertainment: {
				minDuration: 15,
				maxDuration: 240,
				requiresLocation: true,
				suggestedDuration: '15 minutes to 4 hours'
			},
			logistics: {
				minDuration: 15,
				maxDuration: 120,
				suggestedDuration: '15 minutes to 2 hours'
			},
			'photo-video': {
				minDuration: 30,
				maxDuration: 180,
				requiresLocation: true,
				requiresResponsible: true,
				suggestedDuration: '30 minutes to 3 hours'
			},
			paperwork: {
				minDuration: 15,
				maxDuration: 60,
				suggestedDuration: '15 minutes to 1 hour'
			},
			closing: {
				minDuration: 15,
				maxDuration: 60,
				requiresLocation: true,
				suggestedDuration: '15 minutes to 1 hour'
			},
			miscellaneous: {
				minDuration: 15,
				maxDuration: 240,
				suggestedDuration: '15 minutes to 4 hours'
			}
		};

		const requirements = categoryRequirements[data.category];
		if (requirements) {
			const [startHours, startMinutes] = data.startTime.split(':').map(Number);
			const [endHours, endMinutes] = data.endTime.split(':').map(Number);

			const startTotalMinutes = startHours * 60 + startMinutes;
			const endTotalMinutes = endHours * 60 + endMinutes;
			const duration = endTotalMinutes - startTotalMinutes;

			// Check minimum duration
			if (requirements.minDuration && duration < requirements.minDuration) {
				ctx.addIssue({
					code: 'custom',
					message: `${rundownCategorySchema[data.category]} events typically last at least ${requirements.minDuration} minutes. ${requirements.suggestedDuration ? `Suggested duration: ${requirements.suggestedDuration}` : ''}`,
					path: ['endTime']
				});
			}

			// Check maximum duration
			if (requirements.maxDuration && duration > requirements.maxDuration) {
				ctx.addIssue({
					code: 'custom',
					message: `${rundownCategorySchema[data.category]} events typically last no more than ${Math.floor(requirements.maxDuration / 60)} hours. ${requirements.suggestedDuration ? `Suggested duration: ${requirements.suggestedDuration}` : ''}`,
					path: ['endTime']
				});
			}

			// Check required location
			if (requirements.requiresLocation && (!data.location || data.location.trim() === '')) {
				ctx.addIssue({
					code: 'custom',
					message: `Location is required for ${rundownCategorySchema[data.category]} events`,
					path: ['location']
				});
			}

			// Check required responsible person
			if (requirements.requiresResponsible && (!data.responsible || data.responsible.trim() === '')) {
				ctx.addIssue({
					code: 'custom',
					message: `Responsible person is required for ${rundownCategorySchema[data.category]} events`,
					path: ['responsible']
				});
			}
		}
	});

/** Main schedule event schema with action discrimination and comprehensive time/duration validation */
export const scheduleEventSchema = z.discriminatedUnion('action', [
	z.object({
		...scheduleEventFormSchema.shape,
		action: z.literal('default')
	}).refine((data) => {
		// Validate time range
		const [startHours, startMinutes] = data.startTime.split(':').map(Number);
		const [endHours, endMinutes] = data.endTime.split(':').map(Number);

		const startTotalMinutes = startHours * 60 + startMinutes;
		const endTotalMinutes = endHours * 60 + endMinutes;

		return endTotalMinutes > startTotalMinutes;
	}, {
		message: 'End time must be after start time',
		path: ['endTime']
	}).refine((data) => {
		// Validate reasonable duration
		const [startHours, startMinutes] = data.startTime.split(':').map(Number);
		const [endHours, endMinutes] = data.endTime.split(':').map(Number);

		const startTotalMinutes = startHours * 60 + startMinutes;
		const endTotalMinutes = endHours * 60 + endMinutes;
		const duration = endTotalMinutes - startTotalMinutes;

		// Duration should be between 15 minutes and 8 hours
		return duration >= 15 && duration <= 480;
	}, {
		message: 'Event duration should be between 15 minutes and 8 hours',
		path: ['endTime']
	}).superRefine((data, ctx) => {
		// Category-specific validation rules
		const categoryRequirements: Record<RundownCategory, {
			minDuration?: number;
			maxDuration?: number;
			requiresLocation?: boolean;
			requiresResponsible?: boolean;
			suggestedDuration?: string;
		}> = {
			preparation: {
				minDuration: 30,
				maxDuration: 180,
				requiresLocation: true,
				suggestedDuration: '30 minutes to 3 hours'
			},
			ceremony: {
				minDuration: 30,
				maxDuration: 120,
				requiresLocation: true,
				requiresResponsible: true,
				suggestedDuration: '30 minutes to 2 hours'
			},
			reception: {
				minDuration: 60,
				maxDuration: 300,
				requiresLocation: true,
				suggestedDuration: '1 to 5 hours'
			},
			entertainment: {
				minDuration: 15,
				maxDuration: 240,
				requiresLocation: true,
				suggestedDuration: '15 minutes to 4 hours'
			},
			logistics: {
				minDuration: 15,
				maxDuration: 120,
				suggestedDuration: '15 minutes to 2 hours'
			},
			'photo-video': {
				minDuration: 30,
				maxDuration: 180,
				requiresLocation: true,
				requiresResponsible: true,
				suggestedDuration: '30 minutes to 3 hours'
			},
			paperwork: {
				minDuration: 15,
				maxDuration: 60,
				suggestedDuration: '15 minutes to 1 hour'
			},
			closing: {
				minDuration: 15,
				maxDuration: 60,
				requiresLocation: true,
				suggestedDuration: '15 minutes to 1 hour'
			},
			miscellaneous: {
				minDuration: 15,
				maxDuration: 240,
				suggestedDuration: '15 minutes to 4 hours'
			}
		};

		const requirements = categoryRequirements[data.category];
		if (requirements) {
			const [startHours, startMinutes] = data.startTime.split(':').map(Number);
			const [endHours, endMinutes] = data.endTime.split(':').map(Number);

			const startTotalMinutes = startHours * 60 + startMinutes;
			const endTotalMinutes = endHours * 60 + endMinutes;
			const duration = endTotalMinutes - startTotalMinutes;

			// Check minimum duration
			if (requirements.minDuration && duration < requirements.minDuration) {
				ctx.addIssue({
					code: 'custom',
					message: `${rundownCategorySchema[data.category]} events typically last at least ${requirements.minDuration} minutes. ${requirements.suggestedDuration ? `Suggested duration: ${requirements.suggestedDuration}` : ''}`,
					path: ['endTime']
				});
			}

			// Check maximum duration
			if (requirements.maxDuration && duration > requirements.maxDuration) {
				ctx.addIssue({
					code: 'custom',
					message: `${rundownCategorySchema[data.category]} events typically last no more than ${Math.floor(requirements.maxDuration / 60)} hours. ${requirements.suggestedDuration ? `Suggested duration: ${requirements.suggestedDuration}` : ''}`,
					path: ['endTime']
				});
			}

			// Check required location
			if (requirements.requiresLocation && (!data.location || data.location.trim() === '')) {
				ctx.addIssue({
					code: 'custom',
					message: `Location is required for ${rundownCategorySchema[data.category]} events`,
					path: ['location']
				});
			}

			// Check required responsible person
			if (requirements.requiresResponsible && (!data.responsible || data.responsible.trim() === '')) {
				ctx.addIssue({
					code: 'custom',
					message: `Responsible person is required for ${rundownCategorySchema[data.category]} events`,
					path: ['responsible']
				});
			}
		}
	})
]);

/** Array schema for validating multiple schedule events and detecting time overlaps */
export const scheduleEventsArraySchema = z.array(scheduleEventFormSchema)
	.superRefine((events, ctx) => {
		// Check for time overlaps between events
		for (let i = 0; i < events.length; i++) {
			for (let j = i + 1; j < events.length; j++) {
				const event1 = events[i];
				const event2 = events[j];

				const [start1Hours, start1Minutes] = event1.startTime.split(':').map(Number);
				const [end1Hours, end1Minutes] = event1.endTime.split(':').map(Number);
				const [start2Hours, start2Minutes] = event2.startTime.split(':').map(Number);
				const [end2Hours, end2Minutes] = event2.endTime.split(':').map(Number);

				const start1Total = start1Hours * 60 + start1Minutes;
				const end1Total = end1Hours * 60 + end1Minutes;
				const start2Total = start2Hours * 60 + start2Minutes;
				const end2Total = end2Hours * 60 + end2Minutes;

				// Check for overlap: event1 starts before event2 ends AND event2 starts before event1 ends
				const hasOverlap = start1Total < end2Total && start2Total < end1Total;

				if (hasOverlap) {
					ctx.addIssue({
						code: 'custom',
						message: `"${event1.title}" (${event1.startTime}-${event1.endTime}) overlaps with "${event2.title}" (${event2.startTime}-${event2.endTime})`,
						path: [i, 'endTime']
					});
				}
			}
		}
	});

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/** Utility function to check if two time ranges overlap */
export const checkTimeOverlap = (
	start1: string,
	end1: string,
	start2: string,
	end2: string
): boolean => {
	const [start1Hours, start1Minutes] = start1.split(':').map(Number);
	const [end1Hours, end1Minutes] = end1.split(':').map(Number);
	const [start2Hours, start2Minutes] = start2.split(':').map(Number);
	const [end2Hours, end2Minutes] = end2.split(':').map(Number);

	const start1Total = start1Hours * 60 + start1Minutes;
	const end1Total = end1Hours * 60 + end1Minutes;
	const start2Total = start2Hours * 60 + start2Minutes;
	const end2Total = end2Hours * 60 + end2Minutes;

	return start1Total < end2Total && start2Total < end1Total;
};

/** Utility function to calculate duration between two times in minutes */
export const calculateDuration = (startTime: string, endTime: string): number => {
	const [startHours, startMinutes] = startTime.split(':').map(Number);
	const [endHours, endMinutes] = endTime.split(':').map(Number);

	const startTotalMinutes = startHours * 60 + startMinutes;
	const endTotalMinutes = endHours * 60 + endMinutes;

	return endTotalMinutes - startTotalMinutes;
};

/** Utility function to format duration in a human-readable way */
export const formatDuration = (minutes: number): string => {
	const hours = Math.floor(minutes / 60);
	const remainingMinutes = minutes % 60;

	if (hours === 0) {
		return `${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`;
	} else if (remainingMinutes === 0) {
		return `${hours} hour${hours !== 1 ? 's' : ''}`;
	} else {
		return `${hours} hour${hours !== 1 ? 's' : ''} ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`;
	}
};

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type ScheduleEventFormSchema = typeof scheduleEventFormSchema;
export type ScheduleEventSchema = typeof scheduleEventSchema;
export type ScheduleEventsArraySchema = typeof scheduleEventsArraySchema;