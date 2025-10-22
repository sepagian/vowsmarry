import { z } from 'zod/v4';

/**
 * Context-specific error messages for form validation
 * Organized by schema/form type and field name
 */

export interface ValidationMessages {
	[schemaName: string]: {
		[fieldName: string]: {
			[errorType: string]: string;
		};
	};
}

export const validationMessages: ValidationMessages = {
	// Vendor management form messages
	vendor: {
		name: {
			required: 'Vendor name is required',
			minLength: 'Vendor name must be at least 2 characters',
			maxLength: 'Vendor name must be less than 100 characters',
		},
		category: {
			required: 'Please select a vendor category',
			invalid: 'Please select a valid category from the list',
		},
		instagram: {
			required: 'Instagram handle is required',
			format: 'Please enter a valid Instagram handle (e.g., @username or username)',
			minLength: 'Instagram handle is too short',
		},
		email: {
			format: 'Please enter a valid email address (e.g., vendor@example.com)',
			optional: 'Email is optional but must be valid if provided',
		},
		phone: {
			format: 'Please enter a valid phone number (e.g., +1234567890)',
			optional: 'Phone number is optional but must be valid if provided',
		},
		website: {
			format: 'Please enter a valid website URL (e.g., https://vendor.com)',
			optional: 'Website is optional but must be a valid URL if provided',
		},
		price: {
			required: 'Price is required',
			min: 'Price must be greater than 0',
			max: 'Price seems unreasonably high, please double-check',
			format: 'Please enter a valid price amount',
		},
		rating: {
			required: 'Please select a rating',
			invalid: 'Rating must be between 1 and 5',
		},
		status: {
			required: 'Please select a vendor status',
			invalid: 'Please select a valid status from the list',
		},
		notes: {
			maxLength: 'Notes must be less than 1000 characters',
			optional: 'Notes are optional',
		},
	},

	// Document management form messages
	document: {
		name: {
			required: 'Document name is required',
			minLength: 'Document name must be at least 2 characters',
			maxLength: 'Document name must be less than 200 characters',
		},
		category: {
			required: 'Please select a document category',
			invalid: 'Please select a valid category from the list',
		},
		file: {
			required: 'Please upload a file',
			size: 'File size must be less than 5MB',
			type: 'Only PDF, JPEG, and PNG files are allowed',
			multiple: 'Please upload only one file at a time',
		},
		date: {
			required: 'Please select a date',
			format: 'Please enter a valid date',
			future: 'Date cannot be in the future for completed documents',
		},
	},

	// Expense tracking form messages
	expense: {
		description: {
			required: 'Expense description is required',
			minLength: 'Description must be at least 5 characters',
			maxLength: 'Description must be less than 500 characters',
		},
		amount: {
			required: 'Amount is required',
			min: 'Amount must be greater than 0',
			max: 'Amount seems unreasonably high, please double-check',
			format: 'Please enter a valid amount',
			decimal: 'Amount can only have up to 2 decimal places',
		},
		category: {
			required: 'Please select an expense category',
			invalid: 'Please select a valid category from the list',
		},
		status: {
			required: 'Please select payment status',
			invalid: 'Please select a valid payment status',
		},
		date: {
			required: 'Please select expense date',
			format: 'Please enter a valid date',
			future: 'Expense date cannot be too far in the future',
		},
	},

	// Task management form messages
	task: {
		description: {
			required: 'Task description is required',
			minLength: 'Task description must be at least 5 characters',
			maxLength: 'Task description must be less than 1000 characters',
			meaningful: 'Please provide a more descriptive task description',
		},
		category: {
			required: 'Please select a task category',
			invalid: 'Please select a valid category from the list',
		},
		priority: {
			required: 'Please select task priority',
			invalid: 'Please select a valid priority level',
		},
		status: {
			required: 'Please select task status',
			invalid: 'Please select a valid status',
		},
		date: {
			required: 'Please select due date',
			format: 'Please enter a valid date',
			past: 'Due date cannot be in the past',
			future: 'Please select a future date for the task due date',
		},
	},

	// User authentication form messages
	auth: {
		email: {
			required: 'Email address is required',
			format: 'Please enter a valid email address',
			exists: 'An account with this email already exists',
			notFound: 'No account found with this email address',
		},
		password: {
			required: 'Password is required',
			minLength: 'Password must be at least 8 characters long',
			strength:
				'Password must contain at least one uppercase letter, one lowercase letter, and one number',
			weak: 'Password is too weak, please choose a stronger password',
		},
		confirmPassword: {
			required: 'Please confirm your password',
			match: "Passwords don't match",
		},
		firstName: {
			required: 'First name is required',
			minLength: 'First name must be at least 2 characters',
			maxLength: 'First name must be less than 50 characters',
		},
		lastName: {
			required: 'Last name is required',
			minLength: 'Last name must be at least 2 characters',
			maxLength: 'Last name must be less than 50 characters',
		},
	},

	// Guest management form messages
	guest: {
		name: {
			required: 'Guest name is required',
			minLength: 'Guest name must be at least 2 characters',
			maxLength: 'Guest name must be less than 100 characters',
		},
		email: {
			format: 'Please enter a valid email address',
			optional: 'Email is optional but must be valid if provided',
		},
		phone: {
			format: 'Please enter a valid phone number',
			optional: 'Phone number is optional but must be valid if provided',
		},
		rsvpStatus: {
			required: 'Please select RSVP status',
			invalid: 'Please select a valid RSVP status',
		},
		dietaryRestrictions: {
			maxLength: 'Dietary restrictions must be less than 500 characters',
			optional: 'Dietary restrictions are optional',
		},
		plusOne: {
			invalid: 'Please specify if guest has a plus one',
		},
	},

	// Budget management form messages
	budget: {
		categoryName: {
			required: 'Budget category name is required',
			minLength: 'Category name must be at least 2 characters',
			maxLength: 'Category name must be less than 100 characters',
		},
		budgetAmount: {
			required: 'Budget amount is required',
			min: 'Budget amount must be 0 or greater',
			max: 'Budget amount seems unreasonably high',
			format: 'Please enter a valid budget amount',
		},
		actualAmount: {
			min: 'Actual amount must be 0 or greater',
			max: 'Actual amount cannot exceed budget significantly',
			format: 'Please enter a valid actual amount',
		},
	},

	// Schedule/rundown form messages
	schedule: {
		title: {
			required: 'Event title is required',
			minLength: 'Event title must be at least 2 characters',
			maxLength: 'Event title must be less than 200 characters',
		},
		startTime: {
			required: 'Start time is required',
			format: 'Please enter time in HH:MM format (e.g., 14:30)',
		},
		endTime: {
			required: 'End time is required',
			format: 'Please enter time in HH:MM format (e.g., 16:00)',
			after: 'End time must be after start time',
		},
		description: {
			maxLength: 'Description must be less than 500 characters',
			optional: 'Description is optional',
		},
		location: {
			maxLength: 'Location must be less than 200 characters',
			optional: 'Location is optional',
		},
		attendees: {
			maxLength: 'Attendees must be less than 100 characters',
			optional: 'Attendees is optional',
		},
	},
};

/**
 * Get error message for a specific field and error type
 */
export const getErrorMessage = (
	schemaName: string,
	fieldName: string,
	errorType: string,
	fallback?: string,
): string => {
	const message = validationMessages[schemaName]?.[fieldName]?.[errorType];
	return message || fallback || `Invalid ${fieldName}`;
};

/**
 * Get all error messages for a specific schema
 */
export const getSchemaMessages = (schemaName: string) => {
	return validationMessages[schemaName] || {};
};

/**
 * Helper function to consistently apply error messages from validationMessages object
 * This ensures all schemas use centralized error messages instead of inline ones
 */
export const applyValidationMessage = (
	schemaName: string,
	fieldName: string,
	errorType: string,
	fallback?: string,
): { message: string } => {
	const message = getErrorMessage(schemaName, fieldName, errorType, fallback);
	return { message };
};

/**
 * Helper function to create Zod string validators with consistent error messages
 */
export const createStringValidator = (
	schemaName: string,
	fieldName: string,
	options: {
		required?: boolean;
		minLength?: number;
		maxLength?: number;
		email?: boolean;
		url?: boolean;
		regex?: { pattern: RegExp; errorType: string };
		transform?: (value: string) => string;
	} = {},
) => {
	let validator: any = z.string();

	if (options.required) {
		validator = validator.min(1, applyValidationMessage(schemaName, fieldName, 'required'));
	}

	if (options.minLength) {
		validator = validator.min(
			options.minLength,
			applyValidationMessage(schemaName, fieldName, 'minLength'),
		);
	}

	if (options.maxLength) {
		validator = validator.max(
			options.maxLength,
			applyValidationMessage(schemaName, fieldName, 'maxLength'),
		);
	}

	if (options.email) {
		validator = validator.email(applyValidationMessage(schemaName, fieldName, 'format'));
	}

	if (options.url) {
		validator = validator.url(applyValidationMessage(schemaName, fieldName, 'format'));
	}

	if (options.regex) {
		validator = validator.regex(
			options.regex.pattern,
			applyValidationMessage(schemaName, fieldName, options.regex.errorType),
		);
	}

	if (options.transform) {
		validator = validator.transform(options.transform);
	}

	return validator;
};

/**
 * Helper function to create Zod number validators with consistent error messages
 */
export const createNumberValidator = (
	schemaName: string,
	fieldName: string,
	options: {
		required?: boolean;
		min?: number;
		max?: number;
		coerce?: boolean;
	} = {},
) => {
	let validator = options.coerce ? z.coerce.number() : z.number();

	if (options.required) {
		validator = validator.min(0.01, applyValidationMessage(schemaName, fieldName, 'required'));
	}

	if (options.min !== undefined) {
		validator = validator.min(options.min, applyValidationMessage(schemaName, fieldName, 'min'));
	}

	if (options.max !== undefined) {
		validator = validator.max(options.max, applyValidationMessage(schemaName, fieldName, 'max'));
	}

	return validator;
};

/**
 * Helper function to create Zod enum validators with consistent error messages
 */
export const createEnumValidator = <T extends readonly [string, ...string[]]>(
	schemaName: string,
	fieldName: string,
	enumValues: T,
	errorType: string = 'invalid',
) => {
	return z.enum(enumValues, applyValidationMessage(schemaName, fieldName, errorType));
};

/**
 * Helper function to create Zod date validators with consistent error messages
 * Uses ISO date strings (YYYY-MM-DD) for better form compatibility
 */
export const createDateValidator = (
	schemaName: string,
	fieldName: string,
	options: {
		required?: boolean;
		future?: boolean;
		past?: boolean;
		customValidation?: (dateString: string) => boolean;
		customErrorType?: string;
	} = {},
) => {
	let validator = z.iso.date(applyValidationMessage(schemaName, fieldName, 'format'));

	if (options.future) {
		validator = validator.refine(
			(dateString) => {
				const inputDate = new Date(dateString);
				const today = new Date();
				today.setHours(0, 0, 0, 0); // Reset time to start of day for comparison
				return inputDate >= today;
			},
			applyValidationMessage(schemaName, fieldName, 'future'),
		);
	}

	if (options.past) {
		validator = validator.refine(
			(dateString) => {
				const inputDate = new Date(dateString);
				const today = new Date();
				today.setHours(23, 59, 59, 999); // Set to end of day for comparison
				return inputDate <= today;
			},
			applyValidationMessage(schemaName, fieldName, 'past'),
		);
	}

	if (options.customValidation && options.customErrorType) {
		validator = validator.refine(
			options.customValidation,
			applyValidationMessage(schemaName, fieldName, options.customErrorType),
		);
	}

	return validator;
};

/**
 * Common error message patterns for reuse
 */
export const commonMessages = {
	required: (fieldName: string) => `${fieldName} is required`,
	minLength: (fieldName: string, min: number) =>
		`${fieldName} must be at least ${min} character${min === 1 ? '' : 's'}`,
	maxLength: (fieldName: string, max: number) => `${fieldName} must be less than ${max} characters`,
	email: 'Please enter a valid email address',
	url: 'Please enter a valid URL',
	phone: 'Please enter a valid phone number',
	date: 'Please enter a valid date',
	number: 'Please enter a valid number',
	positive: 'Value must be greater than 0',
	future: 'Date must be in the future',
	past: 'Date cannot be in the past',
};
