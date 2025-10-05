import { z } from 'zod/v4';
import { instagramValidator, currencyValidator } from './utils';
import { sanitizeText, sanitizeHtml } from './sanitization';
import {
	getErrorMessage,
	applyValidationMessage,
	createStringValidator,
	createNumberValidator,
	createEnumValidator,
	createDateValidator,
} from './messages';

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
export const documentFormSchema = z
	.object({
		name: createStringValidator('document', 'name', {
			required: true,
			minLength: 2,
			maxLength: 200,
			transform: sanitizeText,
		}),

		category: createEnumValidator(
			'document',
			'category',
			Object.keys(categorySchema) as [Category, ...Category[]],
		),

		file: z
			.array(
				z
					.instanceof(File)
					.refine(
						(f) => f.size <= 10_000_000, // 10MB limit
						{ message: getErrorMessage('document', 'file', 'size') },
					)
					.refine(
						(f) => ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'].includes(f.type),
						{ message: getErrorMessage('document', 'file', 'type') },
					)
					.refine((f) => f.name.length <= 255, {
						message:
							'File name is too long. Please rename your file to be shorter than 255 characters.',
					}),
			)
			.max(1, { message: getErrorMessage('document', 'file', 'multiple') })
			.min(1, { message: getErrorMessage('document', 'file', 'required') }),

		date: createDateValidator('document', 'date', {
			required: true,
			customValidation: (dateString) => {
				const date = new Date(dateString);
				const today = new Date();
				const oneYearAgo = new Date();
				oneYearAgo.setFullYear(today.getFullYear() - 1);
				const twoYearsFromNow = new Date();
				twoYearsFromNow.setFullYear(today.getFullYear() + 2);
				return date >= oneYearAgo && date <= twoYearsFromNow;
			},
			customErrorType: 'format',
		}),

		expiryDate: createDateValidator('document', 'date', {}).optional(),

		description: createStringValidator('document', 'description', {
			maxLength: 500,
			transform: sanitizeHtml,
		})
			.optional()
			.or(z.literal('')),
	})
	.refine(
		(data) => {
			if (data.expiryDate && data.date) {
				return new Date(data.expiryDate) > new Date(data.date);
			}
			return true;
		},
		{
			message: 'Expiry date must be after the document date',
			path: ['expiryDate'],
		},
	);

/** Main document schema with action discrimination for form handling */
export const documentSchema = z.discriminatedUnion('action', [
	z
		.object({
			...documentFormSchema.shape,
			action: z.literal('default'),
		})
		.refine(
			(data) => {
				if (data.expiryDate && data.date) {
					return new Date(data.expiryDate) > new Date(data.date);
				}
				return true;
			},
			{
				message: 'Expiry date must be after the document date',
				path: ['expiryDate'],
			},
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
export const expenseFormSchema = z
	.object({
		description: createStringValidator('expense', 'description', {
			required: true,
			minLength: 5,
			maxLength: 500,
			transform: sanitizeText,
		}),

		amount: createNumberValidator('expense', 'amount', {
			required: true,
			min: 0.01,
			max: 1_000_000_000,
			coerce: true,
		}),

		category: createEnumValidator(
			'expense',
			'category',
			Object.keys(categorySchema) as [Category, ...Category[]],
		),

		status: createEnumValidator(
			'expense',
			'status',
			Object.keys(paymentStatusSchema) as [PaymentStatus, ...PaymentStatus[]],
		).default('pending'),

		date: createDateValidator('expense', 'date', {
			required: true,
			customValidation: (dateString) => {
				const date = new Date(dateString);
				const today = new Date();
				const oneYearFromNow = new Date();
				oneYearFromNow.setFullYear(today.getFullYear() + 1);
				return date <= oneYearFromNow;
			},
			customErrorType: 'future',
		}),

		notes: createStringValidator('expense', 'notes', {
			maxLength: 1000,
			transform: sanitizeHtml,
		})
			.optional()
			.or(z.literal('')),
	})
	.superRefine((data, ctx) => {
		// Category-specific validation rules with detailed error messages
		const categoryLimits: Record<Category, { min: number; max: number; typical: string }> = {
			venue: {
				min: 100_000,
				max: 100_000_000,
				typical: 'Venue costs typically range from 100,000 to 100,000,000 (100K - 100M)',
			},
			catering: {
				min: 50_000,
				max: 50_000_000,
				typical: 'Catering costs typically range from 50,000 to 50,000,000 (50K - 50M)',
			},
			decoration: {
				min: 10_000,
				max: 20_000_000,
				typical: 'Decoration costs typically range from 10,000 to 20,000,000 (10K - 20M)',
			},
			entertainment: {
				min: 50_000,
				max: 10_000_000,
				typical: 'Entertainment costs typically range from 50,000 to 10,000,000 (50K - 10M)',
			},
			'makeup-attire': {
				min: 100_000,
				max: 15_000_000,
				typical: 'Makeup & attire costs typically range from 100,000 to 15,000,000 (100K - 15M)',
			},
			paperwork: {
				min: 10_000,
				max: 5_000_000,
				typical: 'Paperwork costs typically range from 10,000 to 5,000,000 (10K - 5M)',
			},
			'photo-video': {
				min: 500_000,
				max: 25_000_000,
				typical: 'Photo & video costs typically range from 500,000 to 25,000,000 (500K - 25M)',
			},
			accommodation: {
				min: 200_000,
				max: 50_000_000,
				typical: 'Accommodation costs typically range from 200,000 to 50,000,000 (200K - 50M)',
			},
			miscellaneous: {
				min: 1_000,
				max: 10_000_000,
				typical: 'Miscellaneous costs typically range from 1,000 to 10,000,000 (1K - 10M)',
			},
		};

		const categoryLimit = categoryLimits[data.category];
		if (categoryLimit) {
			if (data.amount < categoryLimit.min) {
				ctx.addIssue({
					code: 'custom',
					message: `Amount seems low for ${categorySchema[data.category]}. ${categoryLimit.typical}. Please verify this amount is correct.`,
					path: ['amount'],
				});
			} else if (data.amount > categoryLimit.max) {
				ctx.addIssue({
					code: 'custom',
					message: `Amount seems high for ${categorySchema[data.category]}. ${categoryLimit.typical}. Please verify this amount is correct.`,
					path: ['amount'],
				});
			}
		}
	});

/** Main expense schema with action discrimination and category-specific amount validation */
export const expenseSchema = z.discriminatedUnion('action', [
	z
		.object({
			...expenseFormSchema.shape,
			action: z.literal('default'),
		})
		.superRefine((data, ctx) => {
			// Re-apply the category-specific validation rules
			const categoryLimits: Record<Category, { min: number; max: number; typical: string }> = {
				venue: {
					min: 100_000,
					max: 100_000_000,
					typical: 'Venue costs typically range from 100,000 to 100,000,000 (100K - 100M)',
				},
				catering: {
					min: 50_000,
					max: 50_000_000,
					typical: 'Catering costs typically range from 50,000 to 50,000,000 (50K - 50M)',
				},
				decoration: {
					min: 10_000,
					max: 20_000_000,
					typical: 'Decoration costs typically range from 10,000 to 20,000,000 (10K - 20M)',
				},
				entertainment: {
					min: 50_000,
					max: 10_000_000,
					typical: 'Entertainment costs typically range from 50,000 to 10,000,000 (50K - 10M)',
				},
				'makeup-attire': {
					min: 100_000,
					max: 15_000_000,
					typical: 'Makeup & attire costs typically range from 100,000 to 15,000,000 (100K - 15M)',
				},
				paperwork: {
					min: 10_000,
					max: 5_000_000,
					typical: 'Paperwork costs typically range from 10,000 to 5,000,000 (10K - 5M)',
				},
				'photo-video': {
					min: 500_000,
					max: 25_000_000,
					typical: 'Photo & video costs typically range from 500,000 to 25,000,000 (500K - 25M)',
				},
				accommodation: {
					min: 200_000,
					max: 50_000_000,
					typical: 'Accommodation costs typically range from 200,000 to 50,000,000 (200K - 50M)',
				},
				miscellaneous: {
					min: 1_000,
					max: 10_000_000,
					typical: 'Miscellaneous costs typically range from 1,000 to 10,000,000 (1K - 10M)',
				},
			};

			const categoryLimit = categoryLimits[data.category];
			if (categoryLimit) {
				if (data.amount < categoryLimit.min) {
					ctx.addIssue({
						code: 'custom',
						message: `Amount seems low for ${categorySchema[data.category]}. ${categoryLimit.typical}. Please verify this amount is correct.`,
						path: ['amount'],
					});
				} else if (data.amount > categoryLimit.max) {
					ctx.addIssue({
						code: 'custom',
						message: `Amount seems high for ${categorySchema[data.category]}. ${categoryLimit.typical}. Please verify this amount is correct.`,
						path: ['amount'],
					});
				}
			}
		}),
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
		.min(5, applyValidationMessage('task', 'description', 'minLength'))
		.max(1000, applyValidationMessage('task', 'description', 'maxLength'))
		.refine(
			(desc: string) => {
				// Ensure description is meaningful (not just spaces or repeated characters)
				const trimmed = desc.trim();
				const uniqueChars = new Set(trimmed.toLowerCase().replace(/\s/g, '')).size;
				return uniqueChars >= 3; // At least 3 different characters
			},
			{ message: getErrorMessage('task', 'description', 'meaningful') },
		)
		.transform((desc: string) => {
			// Capitalize first letter and clean up spacing
			const cleaned = desc.trim().replace(/\s+/g, ' ');
			return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
		}),
	category: createEnumValidator(
		'task',
		'category',
		Object.keys(categorySchema) as [Category, ...Category[]],
	),
	priority: createEnumValidator(
		'task',
		'priority',
		Object.keys(taskPrioritySchema) as [Priority, ...Priority[]],
	),
	status: createEnumValidator(
		'task',
		'status',
		Object.keys(taskStatusSchema) as [TaskStatus, ...TaskStatus[]],
	).default('pending'),
	date: createDateValidator('task', 'date', {
		required: true,
		future: true,
	}),
});

/** Main task schema - alias for taskFormSchema for consistency */
export const taskSchema = taskFormSchema;

export type TaskSchema = typeof taskSchema;

// =============================================================================
// VENDOR SCHEMAS
// =============================================================================

/**
 * Vendor management form validation schema
 * Handles wedding service providers with contact info, pricing, and relationship status tracking
 */
export const vendorFormSchema = z.object({
	name: createStringValidator('vendor', 'name', {
		required: true,
		minLength: 2,
		maxLength: 100,
		transform: sanitizeText,
	}),

	category: createEnumValidator(
		'vendor',
		'category',
		Object.keys(categorySchema) as [Category, ...Category[]],
	),

	instagram: instagramValidator,

	email: z
		.string()
		.optional()
		.refine(
			(val) => !val || val === '' || z.string().email().safeParse(val).success,
			getErrorMessage('vendor', 'email', 'format'),
		)
		.transform((val) => (val ? val.toLowerCase().trim() : '')),

	phone: z
		.string()
		.optional()
		.refine(
			(val) => !val || val === '' || /^[\+]?[1-9][\d\s\-\(\)]{7,15}$/.test(val),
			getErrorMessage('vendor', 'phone', 'format'),
		),

	website: z
		.string()
		.optional()
		.refine(
			(val) => !val || val === '' || z.string().url().safeParse(val).success,
			getErrorMessage('vendor', 'website', 'format'),
		),

	price: createNumberValidator('vendor', 'price', {
		required: true,
		min: 0.01,
		max: 1_000_000_000,
		coerce: true,
	}),

	rating: createEnumValidator(
		'vendor',
		'rating',
		Object.keys(vendorRatingSchema) as [string, ...string[]],
	),

	status: createEnumValidator(
		'vendor',
		'status',
		Object.keys(vendorStatusSchema) as [VendorStatus, ...VendorStatus[]],
	).default('researching'),

	notes: createStringValidator('vendor', 'notes', {
		maxLength: 1000,
		transform: sanitizeHtml,
	})
		.optional()
		.or(z.literal('')),
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
	miscellaneous: 'Miscellaneous',
} as const;

type RundownCategory = keyof typeof rundownCategorySchema;

/** Time format validator for schedule events (HH:MM format with reasonable wedding hours) */
export const scheduleTimeValidator = z
	.string()
	.regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
		message: 'Please enter time in HH:MM format (e.g., 14:30)',
	})
	.refine(
		(time) => {
			// Additional validation for reasonable times (not too early/late)
			const [hours, minutes] = time.split(':').map(Number);
			const totalMinutes = hours * 60 + minutes;

			// Wedding events typically happen between 6:00 AM and 11:59 PM
			return totalMinutes >= 360 && totalMinutes <= 1439; // 6:00 AM to 11:59 PM
		},
		{
			message: 'Event time should be between 06:00 and 23:59 for typical wedding schedules',
		},
	);

/**
 * Schedule event form validation schema
 * Handles wedding day timeline events with time validation and category-specific duration rules
 */
export const scheduleEventFormSchema = z
	.object({
		title: createStringValidator('schedule', 'title', {
			required: true,
			minLength: 2,
			maxLength: 200,
			transform: sanitizeText,
		}),

		category: createEnumValidator(
			'schedule',
			'category',
			Object.keys(rundownCategorySchema) as [RundownCategory, ...RundownCategory[]],
		),

		startTime: z
			.string()
			.min(1, applyValidationMessage('schedule', 'startTime', 'required'))
			.regex(
				/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
				applyValidationMessage('schedule', 'startTime', 'format'),
			)
			.refine(
				(time: string) => {
					// Additional validation for reasonable times (not too early/late)
					const [hours, minutes] = time.split(':').map(Number);
					const totalMinutes = hours * 60 + minutes;
					// Wedding events typically happen between 6:00 AM and 11:59 PM
					return totalMinutes >= 360 && totalMinutes <= 1439; // 6:00 AM to 11:59 PM
				},
				{
					message: 'Event time should be between 06:00 and 23:59 for typical wedding schedules',
				},
			),

		endTime: z
			.string()
			.min(1, applyValidationMessage('schedule', 'endTime', 'required'))
			.regex(
				/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
				applyValidationMessage('schedule', 'endTime', 'format'),
			)
			.refine(
				(time: string) => {
					// Additional validation for reasonable times (not too early/late)
					const [hours, minutes] = time.split(':').map(Number);
					const totalMinutes = hours * 60 + minutes;
					// Wedding events typically happen between 6:00 AM and 11:59 PM
					return totalMinutes >= 360 && totalMinutes <= 1439; // 6:00 AM to 11:59 PM
				},
				{
					message: 'Event time should be between 06:00 and 23:59 for typical wedding schedules',
				},
			),

		description: createStringValidator('schedule', 'description', {
			maxLength: 500,
			transform: sanitizeHtml,
		})
			.optional()
			.or(z.literal('')),

		location: createStringValidator('schedule', 'location', {
			maxLength: 200,
			transform: sanitizeText,
		})
			.optional()
			.or(z.literal('')),

		responsible: createStringValidator('schedule', 'responsible', {
			maxLength: 100,
			transform: sanitizeText,
		})
			.optional()
			.or(z.literal('')),
	})
	.refine(
		(data) => {
			// Validate time range
			const [startHours, startMinutes] = data.startTime.split(':').map(Number);
			const [endHours, endMinutes] = data.endTime.split(':').map(Number);

			const startTotalMinutes = startHours * 60 + startMinutes;
			const endTotalMinutes = endHours * 60 + endMinutes;

			return endTotalMinutes > startTotalMinutes;
		},
		{
			message: 'End time must be after start time',
			path: ['endTime'],
		},
	)
	.refine(
		(data) => {
			// Validate reasonable duration
			const [startHours, startMinutes] = data.startTime.split(':').map(Number);
			const [endHours, endMinutes] = data.endTime.split(':').map(Number);

			const startTotalMinutes = startHours * 60 + startMinutes;
			const endTotalMinutes = endHours * 60 + endMinutes;
			const duration = endTotalMinutes - startTotalMinutes;

			// Duration should be between 15 minutes and 8 hours
			return duration >= 15 && duration <= 480;
		},
		{
			message: 'Event duration should be between 15 minutes and 8 hours',
			path: ['endTime'],
		},
	)
	.superRefine((data, ctx) => {
		// Category-specific validation rules
		const categoryRequirements: Record<
			RundownCategory,
			{
				minDuration?: number;
				maxDuration?: number;
				requiresLocation?: boolean;
				requiresResponsible?: boolean;
				suggestedDuration?: string;
			}
		> = {
			preparation: {
				minDuration: 30,
				maxDuration: 180,
				requiresLocation: true,
				suggestedDuration: '30 minutes to 3 hours',
			},
			ceremony: {
				minDuration: 30,
				maxDuration: 120,
				requiresLocation: true,
				requiresResponsible: true,
				suggestedDuration: '30 minutes to 2 hours',
			},
			reception: {
				minDuration: 60,
				maxDuration: 300,
				requiresLocation: true,
				suggestedDuration: '1 to 5 hours',
			},
			entertainment: {
				minDuration: 15,
				maxDuration: 240,
				requiresLocation: true,
				suggestedDuration: '15 minutes to 4 hours',
			},
			logistics: {
				minDuration: 15,
				maxDuration: 120,
				suggestedDuration: '15 minutes to 2 hours',
			},
			'photo-video': {
				minDuration: 30,
				maxDuration: 180,
				requiresLocation: true,
				requiresResponsible: true,
				suggestedDuration: '30 minutes to 3 hours',
			},
			paperwork: {
				minDuration: 15,
				maxDuration: 60,
				suggestedDuration: '15 minutes to 1 hour',
			},
			closing: {
				minDuration: 15,
				maxDuration: 60,
				requiresLocation: true,
				suggestedDuration: '15 minutes to 1 hour',
			},
			miscellaneous: {
				minDuration: 15,
				maxDuration: 240,
				suggestedDuration: '15 minutes to 4 hours',
			},
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
					path: ['endTime'],
				});
			}

			// Check maximum duration
			if (requirements.maxDuration && duration > requirements.maxDuration) {
				ctx.addIssue({
					code: 'custom',
					message: `${rundownCategorySchema[data.category]} events typically last no more than ${Math.floor(requirements.maxDuration / 60)} hours. ${requirements.suggestedDuration ? `Suggested duration: ${requirements.suggestedDuration}` : ''}`,
					path: ['endTime'],
				});
			}

			// Check required location
			if (requirements.requiresLocation && (!data.location || data.location.trim() === '')) {
				ctx.addIssue({
					code: 'custom',
					message: `Location is required for ${rundownCategorySchema[data.category]} events`,
					path: ['location'],
				});
			}

			// Check required responsible person
			if (
				requirements.requiresResponsible &&
				(!data.responsible || data.responsible.trim() === '')
			) {
				ctx.addIssue({
					code: 'custom',
					message: `Responsible person is required for ${rundownCategorySchema[data.category]} events`,
					path: ['responsible'],
				});
			}
		}
	});

/** Main schedule event schema with action discrimination and comprehensive time/duration validation */
export const scheduleEventSchema = z.discriminatedUnion('action', [
	z
		.object({
			...scheduleEventFormSchema.shape,
			action: z.literal('default'),
		})
		.refine(
			(data) => {
				// Validate time range
				const [startHours, startMinutes] = data.startTime.split(':').map(Number);
				const [endHours, endMinutes] = data.endTime.split(':').map(Number);

				const startTotalMinutes = startHours * 60 + startMinutes;
				const endTotalMinutes = endHours * 60 + endMinutes;

				return endTotalMinutes > startTotalMinutes;
			},
			{
				message: 'End time must be after start time',
				path: ['endTime'],
			},
		)
		.refine(
			(data) => {
				// Validate reasonable duration
				const [startHours, startMinutes] = data.startTime.split(':').map(Number);
				const [endHours, endMinutes] = data.endTime.split(':').map(Number);

				const startTotalMinutes = startHours * 60 + startMinutes;
				const endTotalMinutes = endHours * 60 + endMinutes;
				const duration = endTotalMinutes - startTotalMinutes;

				// Duration should be between 15 minutes and 8 hours
				return duration >= 15 && duration <= 480;
			},
			{
				message: 'Event duration should be between 15 minutes and 8 hours',
				path: ['endTime'],
			},
		)
		.superRefine((data, ctx) => {
			// Category-specific validation rules
			const categoryRequirements: Record<
				RundownCategory,
				{
					minDuration?: number;
					maxDuration?: number;
					requiresLocation?: boolean;
					requiresResponsible?: boolean;
					suggestedDuration?: string;
				}
			> = {
				preparation: {
					minDuration: 30,
					maxDuration: 180,
					requiresLocation: true,
					suggestedDuration: '30 minutes to 3 hours',
				},
				ceremony: {
					minDuration: 30,
					maxDuration: 120,
					requiresLocation: true,
					requiresResponsible: true,
					suggestedDuration: '30 minutes to 2 hours',
				},
				reception: {
					minDuration: 60,
					maxDuration: 300,
					requiresLocation: true,
					suggestedDuration: '1 to 5 hours',
				},
				entertainment: {
					minDuration: 15,
					maxDuration: 240,
					requiresLocation: true,
					suggestedDuration: '15 minutes to 4 hours',
				},
				logistics: {
					minDuration: 15,
					maxDuration: 120,
					suggestedDuration: '15 minutes to 2 hours',
				},
				'photo-video': {
					minDuration: 30,
					maxDuration: 180,
					requiresLocation: true,
					requiresResponsible: true,
					suggestedDuration: '30 minutes to 3 hours',
				},
				paperwork: {
					minDuration: 15,
					maxDuration: 60,
					suggestedDuration: '15 minutes to 1 hour',
				},
				closing: {
					minDuration: 15,
					maxDuration: 60,
					requiresLocation: true,
					suggestedDuration: '15 minutes to 1 hour',
				},
				miscellaneous: {
					minDuration: 15,
					maxDuration: 240,
					suggestedDuration: '15 minutes to 4 hours',
				},
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
						path: ['endTime'],
					});
				}

				// Check maximum duration
				if (requirements.maxDuration && duration > requirements.maxDuration) {
					ctx.addIssue({
						code: 'custom',
						message: `${rundownCategorySchema[data.category]} events typically last no more than ${Math.floor(requirements.maxDuration / 60)} hours. ${requirements.suggestedDuration ? `Suggested duration: ${requirements.suggestedDuration}` : ''}`,
						path: ['endTime'],
					});
				}

				// Check required location
				if (requirements.requiresLocation && (!data.location || data.location.trim() === '')) {
					ctx.addIssue({
						code: 'custom',
						message: `Location is required for ${rundownCategorySchema[data.category]} events`,
						path: ['location'],
					});
				}

				// Check required responsible person
				if (
					requirements.requiresResponsible &&
					(!data.responsible || data.responsible.trim() === '')
				) {
					ctx.addIssue({
						code: 'custom',
						message: `Responsible person is required for ${rundownCategorySchema[data.category]} events`,
						path: ['responsible'],
					});
				}
			}
		}),
]);

/** Array schema for validating multiple schedule events and detecting time overlaps */
export const scheduleEventsArraySchema = z
	.array(scheduleEventFormSchema)
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
						path: [i, 'endTime'],
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
	end2: string,
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
// BUDGET MANAGEMENT SCHEMAS
// =============================================================================

/** Budget category status for tracking budget allocation and spending */
export const budgetStatusSchema = {
	'under-budget': 'Under Budget',
	'on-budget': 'On Budget',
	'over-budget': 'Over Budget',
	'not-started': 'Not Started',
} as const;

type BudgetStatus = keyof typeof budgetStatusSchema;

/**
 * Budget category form validation schema
 * Handles wedding budget categories with amount validation and spending tracking
 */
export const budgetCategoryFormSchema = z
	.object({
		name: createStringValidator('budget', 'categoryName', {
			required: true,
			minLength: 2,
			maxLength: 100,
			transform: sanitizeText,
		}),

		budgetAmount: createNumberValidator('budget', 'budgetAmount', {
			required: true,
			min: 0,
			max: 1_000_000_000,
			coerce: true,
		}),

		actualAmount: createNumberValidator('budget', 'actualAmount', {
			min: 0,
			max: 1_000_000_000,
			coerce: true,
		}).default(0),

		description: createStringValidator('budget', 'description', {
			maxLength: 500,
			transform: sanitizeHtml,
		})
			.optional()
			.or(z.literal(''))
			.default(''),
	})
	.refine(
		(data) => {
			// Warn if actual amount significantly exceeds budget (more than 50% over)
			if (data.budgetAmount > 0 && data.actualAmount > data.budgetAmount * 1.5) {
				return false;
			}
			return true;
		},
		{
			message:
				'Actual amount significantly exceeds budget. Please review your spending or adjust the budget.',
			path: ['actualAmount'],
		},
	);

/** Main budget category schema with action discrimination */
export const budgetCategorySchema = z.discriminatedUnion('action', [
	z
		.object({
			...budgetCategoryFormSchema.shape,
			action: z.literal('default'),
		})
		.refine(
			(data) => {
				// Re-apply budget validation
				if (data.budgetAmount > 0 && data.actualAmount > data.budgetAmount * 1.5) {
					return false;
				}
				return true;
			},
			{
				message:
					'Actual amount significantly exceeds budget. Please review your spending or adjust the budget.',
				path: ['actualAmount'],
			},
		),
]);

/**
 * Budget item form validation schema
 * Handles individual budget items/expenses within categories with detailed tracking
 */
export const budgetItemFormSchema = z
	.object({
		name: createStringValidator('budget', 'categoryName', {
			required: true,
			minLength: 2,
			maxLength: 200,
			transform: sanitizeText,
		}),

		category: createEnumValidator(
			'budget',
			'category',
			Object.keys(categorySchema) as [Category, ...Category[]],
		),

		estimatedAmount: createNumberValidator('budget', 'budgetAmount', {
			required: true,
			min: 0,
			max: 1_000_000_000,
			coerce: true,
		}),

		actualAmount: createNumberValidator('budget', 'actualAmount', {
			min: 0,
			max: 1_000_000_000,
			coerce: true,
		})
			.optional()
			.default(0),

		status: createEnumValidator(
			'budget',
			'status',
			Object.keys(budgetStatusSchema) as [BudgetStatus, ...BudgetStatus[]],
		).default('not-started'),

		priority: createEnumValidator(
			'budget',
			'priority',
			Object.keys(taskPrioritySchema) as [Priority, ...Priority[]],
		).default('medium'),

		dueDate: createDateValidator('budget', 'date', {}).optional(),

		vendor: createStringValidator('budget', 'vendor', {
			maxLength: 100,
			transform: sanitizeText,
		})
			.optional()
			.or(z.literal(''))
			.default(''),

		notes: createStringValidator('budget', 'notes', {
			maxLength: 1000,
			transform: sanitizeHtml,
		})
			.optional()
			.or(z.literal(''))
			.default(''),
	})
	.refine(
		(data) => {
			// Validate due date is not in the past if provided
			if (data.dueDate) {
				const today = new Date();
				today.setHours(0, 0, 0, 0);
				const dueDate = new Date(data.dueDate);
				return dueDate >= today;
			}
			return true;
		},
		{
			message: 'Due date cannot be in the past',
			path: ['dueDate'],
		},
	)
	.refine(
		(data) => {
			// Warn if actual amount significantly exceeds estimated amount
			if (
				data.actualAmount &&
				data.estimatedAmount > 0 &&
				data.actualAmount > data.estimatedAmount * 1.3
			) {
				return false;
			}
			return true;
		},
		{
			message:
				'Actual amount is significantly higher than estimated. Please review the expense or update the estimate.',
			path: ['actualAmount'],
		},
	);

/** Main budget item schema with action discrimination */
export const budgetItemSchema = z.discriminatedUnion('action', [
	z
		.object({
			...budgetItemFormSchema.shape,
			action: z.literal('default'),
		})
		.refine(
			(data) => {
				// Re-apply due date validation
				if (data.dueDate) {
					const today = new Date();
					today.setHours(0, 0, 0, 0);
					const dueDate = new Date(data.dueDate);
					return dueDate >= today;
				}
				return true;
			},
			{
				message: 'Due date cannot be in the past',
				path: ['dueDate'],
			},
		)
		.refine(
			(data) => {
				// Re-apply amount validation
				if (
					data.actualAmount &&
					data.estimatedAmount > 0 &&
					data.actualAmount > data.estimatedAmount * 1.3
				) {
					return false;
				}
				return true;
			},
			{
				message:
					'Actual amount is significantly higher than estimated. Please review the expense or update the estimate.',
				path: ['actualAmount'],
			},
		),
]);

/**
 * Budget calculation validation schema
 * Validates budget totals and provides spending insights
 */
export const budgetCalculationSchema = z
	.object({
		totalBudget: currencyValidator(0, 1_000_000_000, 'Total budget must be 0 or greater'),
		totalSpent: currencyValidator(0, 1_000_000_000, 'Total spent must be 0 or greater'),
		totalRemaining: z.number(),
		categories: z.array(budgetCategoryFormSchema),
	})
	.refine(
		(data) => {
			// Validate that total remaining equals total budget minus total spent
			const calculatedRemaining = data.totalBudget - data.totalSpent;
			return Math.abs(data.totalRemaining - calculatedRemaining) < 0.01; // Allow for floating point precision
		},
		{
			message: 'Budget calculation error: remaining amount does not match budget minus spent',
			path: ['totalRemaining'],
		},
	)
	.refine(
		(data) => {
			// Validate that category totals match overall totals
			const categoryBudgetSum = data.categories.reduce((sum, cat) => sum + cat.budgetAmount, 0);
			const categorySpentSum = data.categories.reduce((sum, cat) => sum + cat.actualAmount, 0);

			return (
				Math.abs(categoryBudgetSum - data.totalBudget) < 0.01 &&
				Math.abs(categorySpentSum - data.totalSpent) < 0.01
			);
		},
		{
			message: 'Category totals do not match overall budget totals',
			path: ['categories'],
		},
	);

/** Array schema for validating multiple budget items */
export const budgetItemsArraySchema = z.array(budgetItemFormSchema).superRefine((items, ctx) => {
	// Check for duplicate item names within the same category
	const itemsByCategory = new Map<string, string[]>();

	items.forEach((item, index) => {
		if (!itemsByCategory.has(item.category)) {
			itemsByCategory.set(item.category, []);
		}

		const categoryItems = itemsByCategory.get(item.category)!;
		const normalizedName = item.name.toLowerCase().trim();

		if (categoryItems.includes(normalizedName)) {
			ctx.addIssue({
				code: 'custom',
				message: `Duplicate item name "${item.name}" found in ${categorySchema[item.category]} category`,
				path: [index, 'name'],
			});
		} else {
			categoryItems.push(normalizedName);
		}
	});

	// Validate total amounts don't exceed reasonable limits per category
	const categoryTotals = new Map<string, number>();
	items.forEach((item, index) => {
		const currentTotal = categoryTotals.get(item.category) || 0;
		const newTotal = currentTotal + item.estimatedAmount;
		categoryTotals.set(item.category, newTotal);

		// Check against category limits from expense schema
		const categoryLimits: Record<Category, number> = {
			venue: 100_000_000,
			catering: 50_000_000,
			decoration: 20_000_000,
			entertainment: 10_000_000,
			'makeup-attire': 15_000_000,
			paperwork: 5_000_000,
			'photo-video': 25_000_000,
			accommodation: 50_000_000,
			miscellaneous: 10_000_000,
		};

		const limit = categoryLimits[item.category];
		if (limit && newTotal > limit) {
			ctx.addIssue({
				code: 'custom',
				message: `Total estimated amount for ${categorySchema[item.category]} (${newTotal.toLocaleString()}) exceeds typical range. Please review your budget items.`,
				path: [index, 'estimatedAmount'],
			});
		}
	});
});

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type ScheduleEventFormSchema = typeof scheduleEventFormSchema;
export type ScheduleEventSchema = typeof scheduleEventSchema;
export type ScheduleEventsArraySchema = typeof scheduleEventsArraySchema;
export type BudgetCategoryFormSchema = typeof budgetCategoryFormSchema;
export type BudgetCategorySchema = typeof budgetCategorySchema;
export type BudgetItemFormSchema = typeof budgetItemFormSchema;
export type BudgetItemSchema = typeof budgetItemSchema;
export type BudgetCalculationSchema = typeof budgetCalculationSchema;
export type BudgetItemsArraySchema = typeof budgetItemsArraySchema;

// =============================================================================
// AUTHENTICATION SCHEMAS
// =============================================================================

// Re-export authentication schemas from auth.ts
export {
	loginSchema,
	registrationSchema,
	passwordResetRequestSchema,
	passwordResetSchema,
	changePasswordSchema,
	profileUpdateSchema,
	emailVerificationSchema,
	type LoginData,
	type RegistrationData,
	type PasswordResetRequestData,
	type PasswordResetData,
	type ChangePasswordData,
	type ProfileUpdateData,
	type EmailVerificationData,
} from './auth.js';

// =============================================================================
// GUEST MANAGEMENT SCHEMAS
// =============================================================================

/** RSVP status options for guest responses */
export const rsvpStatusSchema = {
	pending: 'Pending',
	attending: 'Attending',
	'not-attending': 'Not Attending',
} as const;

type RsvpStatus = keyof typeof rsvpStatusSchema;

/**
 * Guest management form validation schema
 * Handles wedding guest information, contact details, and RSVP tracking
 */
export const guestFormSchema = z.object({
	name: createStringValidator('guest', 'name', {
		required: true,
		minLength: 2,
		maxLength: 100,
		transform: sanitizeText,
	}),

	email: z
		.string()
		.optional()
		.refine((val) => !val || val === '' || z.string().email().safeParse(val).success, {
			message: getErrorMessage('guest', 'email', 'format'),
		})
		.transform((val) => (val ? val.toLowerCase().trim() : '')),

	phone: z
		.string()
		.optional()
		.refine((val) => !val || val === '' || /^[\+]?[1-9][\d\s\-\(\)]{7,15}$/.test(val), {
			message: getErrorMessage('guest', 'phone', 'format'),
		}),

	rsvpStatus: createEnumValidator(
		'guest',
		'rsvpStatus',
		Object.keys(rsvpStatusSchema) as [RsvpStatus, ...RsvpStatus[]],
	).default('pending'),

	dietaryRestrictions: createStringValidator('guest', 'dietaryRestrictions', {
		maxLength: 500,
		transform: sanitizeText,
	})
		.optional()
		.or(z.literal('')),

	plusOne: z.boolean().default(false),
});

/** Main guest schema with action discrimination for form handling */
export const guestSchema = z.discriminatedUnion('action', [
	guestFormSchema.extend({ action: z.literal('default') }),
]);

export type GuestSchema = typeof guestSchema;

