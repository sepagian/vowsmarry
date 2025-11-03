import { z } from 'zod/v4';
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

export const categoryEnum = {
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

export const rundownCategoryEnum = {
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

export const documentCategoryEnum = {
	'legal-formal': 'Legal & Formal',
	'vendor-finance': 'Vendor & Finance',
	'guest-ceremony': 'Guest & Ceremony',
	'personal-keepsake': 'Personal & Keepsake',
} as const;

export const taskStatusEnum = {
	pending: 'Pending',
	on_progress: 'On Progress',
	completed: 'Completed',
} as const;

export const taskPriorityEnum = { low: 'Low', medium: 'Medium', high: 'High' } as const;

export const paymentStatusEnum = {
	unpaid: 'Unpaid',
	paid: 'Paid',
} as const;

export const vendorRatingEnum = {
	1: '1',
	2: '2',
	3: '3',
	4: '4',
	5: '5',
} as const;

export const vendorStatusEnum = {
	researching: 'Researching',
	contacted: 'Contacted',
	quoted: 'Quoted',
	booked: 'Booked',
} as const;

type Category = keyof typeof categoryEnum;
type Priority = keyof typeof taskPriorityEnum;
type VendorStatus = keyof typeof vendorStatusEnum;
type PaymentStatus = keyof typeof paymentStatusEnum;
type TaskStatus = keyof typeof taskStatusEnum;
type DocumentCategory = keyof typeof documentCategoryEnum;
type RundownCategory = keyof typeof rundownCategoryEnum;

// =============================================================================
// CORE SCHEMAS
// =============================================================================

export const weddingSchema = z.object({
	groomName: createStringValidator('wedding', 'groom', {
		required: true,
		minLength: 2,
		maxLength: 100,
		transform: sanitizeText,
	}),

	brideName: createStringValidator('wedding', 'bride', {
		required: true,
		minLength: 2,
		maxLength: 100,
		transform: sanitizeText,
	}),

	weddingDate: createDateValidator('wedding', 'date', {
		required: true,
		future: true,
	}),

	venue: createStringValidator('wedding', 'venue', {
		required: false,
		minLength: 2,
		maxLength: 100,
		transform: sanitizeText,
	}),
});

// =============================================================================
// TASK SCHEMAS
// =============================================================================

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
		Object.keys(categoryEnum) as [Category, ...Category[]],
	),

	priority: createEnumValidator(
		'task',
		'priority',
		Object.keys(taskPriorityEnum) as [Priority, ...Priority[]],
	),

	status: createEnumValidator(
		'task',
		'status',
		Object.keys(taskStatusEnum) as [TaskStatus, ...TaskStatus[]],
	).default('pending'),

	date: createDateValidator('task', 'date', {
		required: true,
		future: true,
	}),
});

// =============================================================================
// DOCUMENT SCHEMAS
// =============================================================================

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
			Object.keys(documentCategoryEnum) as [DocumentCategory, ...DocumentCategory[]],
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

// =============================================================================
// EXPENSE SCHEMAS
// =============================================================================

export const expenseFormSchema = z.object({
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
		Object.keys(categoryEnum) as [Category, ...Category[]],
	),

	paymentStatus: createEnumValidator(
		'expense',
		'status',
		Object.keys(paymentStatusEnum) as [PaymentStatus, ...PaymentStatus[]],
	).default('unpaid'),

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
});

// =============================================================================
// VENDOR SCHEMAS
// =============================================================================

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
		Object.keys(categoryEnum) as [Category, ...Category[]],
	),

	instagram: z
		.string()
		.min(1, { error: 'Instagram handle is required' })
		.regex(/^@?[a-zA-Z0-9._]+$/, {
			error: 'Instagram handle can only contain letters, numbers, dots, and underscores',
		})
		.transform((val) => (val.startsWith('@') ? val : `@${val}`)),

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
		.url()
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

	totalCost: createNumberValidator('vendor', 'total_cost', {
		required: true,
		min: 0.01,
		max: 1_000_000_000,
		coerce: true,
	}),

	rating: createEnumValidator(
		'vendor',
		'rating',
		Object.keys(vendorRatingEnum) as [string, ...string[]],
	),

	status: createEnumValidator(
		'vendor',
		'status',
		Object.keys(vendorStatusEnum) as [VendorStatus, ...VendorStatus[]],
	).default('researching'),

	notes: createStringValidator('vendor', 'notes', {
		maxLength: 1000,
		transform: sanitizeHtml,
	})
		.optional()
		.or(z.literal('')),
});

// =============================================================================
// SCHEDULE/RUNDOWN SCHEMAS
// =============================================================================

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
			Object.keys(rundownCategoryEnum) as [RundownCategory, ...RundownCategory[]],
		),

		startTime: z.iso
			.time(applyValidationMessage('schedule', 'startTime', 'required'))
			.min(1, applyValidationMessage('schedule', 'startTime', 'required')),

		endTime: z.iso
			.time(applyValidationMessage('schedule', 'endTime', 'required'))
			.min(1, applyValidationMessage('schedule', 'endTime', 'required')),

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

		attendees: createStringValidator('schedule', 'attendees', {
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
	);

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
// TYPE EXPORTS
// =============================================================================

export type ScheduleEventFormSchema = typeof scheduleEventFormSchema;

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
