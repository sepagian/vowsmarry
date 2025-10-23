import { z } from 'zod/v4';

export const emailValidator = z.email({ error: 'Please enter a valid email address' });

export const phoneValidator = z.regex(/^[\+]?[1-9][\d\s\-\(\)]{7,15}$/, {
	error: 'Please enter a valid phone number',
});

export const urlValidator = z.url({
	error: 'Please enter a valid website URL (e.g., https://example.com)',
});

export const instagramValidator = z
	.string()
	.min(1, { error: 'Instagram handle is required' })
	.regex(/^@?[a-zA-Z0-9._]+$/, {
		error: 'Instagram handle can only contain letters, numbers, dots, and underscores',
	})
	.transform((val) => (val.startsWith('@') ? val : `@${val}`));

export const fileTypeValidator = (allowedTypes: string[], maxSize: number = 5_000_000) =>
	z
		.instanceof(File)
		.refine(
			(f) => f.size <= maxSize,
			`File size must be less than ${Math.round(maxSize / 1_000_000)}MB`,
		)
		.refine((f) => allowedTypes.includes(f.type), {
			message: `Only ${allowedTypes.map((type) => type.split('/')[1].toUpperCase()).join(', ')} files are allowed`,
		});

export const createDateRangeValidator = (
	startField: string,
	endField: string,
	message: string = 'End date must be after start date',
) => {
	return z.any().refine(
		(data: any) => {
			if (!data || typeof data !== 'object') return true;
			const startDate = new Date(data[startField]);
			const endDate = new Date(data[endField]);
			return !isNaN(startDate.getTime()) && !isNaN(endDate.getTime()) ? endDate > startDate : true;
		},
		{
			message,
			path: [endField],
		},
	);
};

export const futureDateValidator = (message: string = 'Date must be in the future') =>
	z.date().refine((date) => date > new Date(), { message });

export const currencyValidator = (min: number = 0, max: number = 1_000_000_000, message?: string) =>
	z.coerce
		.number({ message: 'Please enter a valid number' })
		.min(min, { message: message || `Amount must be at least ${min}` })
		.max(max, { message: `Amount must be less than ${max.toLocaleString()}` })
		.multipleOf(0.01, { message: 'Amount can only have up to 2 decimal places' });

export const textLengthValidator = (
	fieldName: string,
	minLength: number = 1,
	maxLength: number = 1000,
) =>
	z
		.string({ error: `${fieldName} is required` })
		.min(minLength, {
			error:
				minLength === 1
					? `${fieldName} is required`
					: `${fieldName} must be at least ${minLength} characters`,
		})
		.max(maxLength, {
			error: `${fieldName} must be less than ${maxLength} characters`,
		});

/**
 * Password strength validator
 */
export const passwordValidator = z
	.string()
	.min(8, { message: 'Password must be at least 8 characters long' })
	.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
		message:
			'Password must contain at least one uppercase letter, one lowercase letter, and one number',
	});

export const createConfirmPasswordValidator = () =>
	z
		.object({
			password: z.string(),
			confirmPassword: z.string(),
		})
		.refine((data) => data.password === data.confirmPassword, {
			message: "Passwords don't match",
			path: ['confirmPassword'],
		});

export const timeValidator = z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
	message: 'Please enter time in HH:MM format (e.g., 14:30)',
});

export const createEnumValidator = (
	enumValues: readonly [string, ...string[]],
	fieldName: string,
) =>
	z.enum(enumValues, {
		message: `Please select a valid ${fieldName.toLowerCase()}`,
	});

/**
 * Validates expense dates to ensure they're within reasonable range
 * @param allowFuture - Whether to allow future dates (default: true, up to 1 year)
 * @param allowPast - Whether to allow past dates (default: true, up to 2 years)
 */
export const expenseDateValidator = (allowFuture: boolean = true, allowPast: boolean = true) => {
	return z.coerce
		.date({
			message: 'Please select a valid expense date',
		})
		.refine(
			(date) => {
				const today = new Date();

				if (!allowPast && date < today) {
					return false;
				}

				if (!allowFuture && date > today) {
					return false;
				}

				// Default range: 2 years ago to 1 year in the future
				const twoYearsAgo = new Date();
				twoYearsAgo.setFullYear(today.getFullYear() - 2);
				const oneYearFromNow = new Date();
				oneYearFromNow.setFullYear(today.getFullYear() + 1);

				return date >= twoYearsAgo && date <= oneYearFromNow;
			},
			{
				message:
					allowFuture && allowPast
						? 'Expense date must be within the last 2 years or up to 1 year in the future'
						: allowFuture
							? 'Expense date cannot be in the past'
							: 'Expense date cannot be in the future',
			},
		);
};
