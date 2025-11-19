import * as v from 'valibot';
import { safeEmail } from './sanitization';

export const loginSchema = v.object({
	email: safeEmail(),
	password: v.pipe(v.string(), v.nonEmpty('Please enter your password')),
});

export type LoginData = v.InferInput<typeof loginSchema>;

export const registerSchema = v.object({
	firstName: v.pipe(
		v.string(),
		v.nonEmpty('Please enter your first name'),
		v.minLength(2, 'First name must be at least 2 characters'),
	),
	lastName: v.pipe(
		v.string(),
		v.nonEmpty('Please enter your last name'),
		v.minLength(2, 'Last name must be at least 2 characters'),
	),
	password: v.pipe(
		v.string(),
		v.minLength(6, 'Password must be at least 6 characters'),
		v.maxLength(32, 'Password must be less than 32 characters'),
		v.regex(/[a-z]/, 'Password must contain at least one lowercase letter'),
		v.regex(/[A-Z]/, 'Password must contain at least one uppercase letter'),
		v.regex(/[0-9]/, 'Password must contain at least one number'),
	),
	confirmPassword: v.pipe(v.string(), v.nonEmpty('Please confirm your password')),
});

export const validateRegisterSchema = v.pipe(
	registerSchema,
	v.forward(
		v.partialCheck(
			[['confirmPassword'], ['password']],
			(input) => input.password === input.confirmPassword,
			'Passwords do not match',
		),
		['confirmPassword'],
	),
);

export type RegisterData = v.InferInput<typeof validateRegisterSchema>;

export const forgotPasswordSchema = v.object({
	email: v.pipe(safeEmail(), v.nonEmpty('Please enter your email')),
});

export type ForgotPasswordData = v.InferInput<typeof forgotPasswordSchema>;

export const resetPasswordSchema = v.object({
	token: v.optional(v.string()),
	newPassword: v.pipe(
		v.string(),
		v.minLength(6, 'Password must be at least 6 characters'),
		v.maxLength(32, 'Password must be less than 32 characters'),
		v.regex(/[a-z]/, 'Password must contain at least one lowercase letter'),
		v.regex(/[A-Z]/, 'Password must contain at least one uppercase letter'),
		v.regex(/[0-9]/, 'Password must contain at least one number'),
	),
	confirmNewPassword: v.pipe(v.string(), v.nonEmpty('Please confirm your password')),
});

export const validateResetPasswordSchema = v.pipe(
	resetPasswordSchema,
	v.forward(
		v.partialCheck(
			[['confirmNewPassword'], ['newPassword']],
			(input) => input.newPassword === input.confirmNewPassword,
			'Passwords do not match',
		),
		['confirmNewPassword'],
	),
);

export type ResetPasswordData = v.InferInput<typeof validateResetPasswordSchema>;

// Aliases for test compatibility
export const registrationSchema = validateRegisterSchema;
export const passwordResetRequestSchema = forgotPasswordSchema;
export const passwordResetSchema = validateResetPasswordSchema;

// Additional schemas for tests
export const changePasswordSchema = v.object({
	oldPassword: v.pipe(v.string(), v.nonEmpty('Please enter your current password')),
	newPassword: v.pipe(
		v.string(),
		v.minLength(6, 'Password must be at least 6 characters'),
		v.maxLength(32, 'Password must be less than 32 characters'),
		v.regex(/[a-z]/, 'Password must contain at least one lowercase letter'),
		v.regex(/[A-Z]/, 'Password must contain at least one uppercase letter'),
		v.regex(/[0-9]/, 'Password must contain at least one number'),
	),
	confirmNewPassword: v.pipe(v.string(), v.nonEmpty('Please confirm your new password')),
});

export const validateChangePasswordSchema = v.pipe(
	changePasswordSchema,
	v.forward(
		v.partialCheck(
			[['confirmNewPassword'], ['newPassword']],
			(input) => input.newPassword === input.confirmNewPassword,
			'Passwords do not match',
		),
		['confirmNewPassword'],
	),
);

export const profileUpdateSchema = v.object({
	firstName: v.pipe(
		v.string(),
		v.nonEmpty('Please enter your first name'),
		v.minLength(2, 'First name must be at least 2 characters'),
	),
	lastName: v.pipe(
		v.string(),
		v.nonEmpty('Please enter your last name'),
		v.minLength(2, 'Last name must be at least 2 characters'),
	),
	email: safeEmail(),
});

export const emailVerificationSchema = v.object({
	token: v.pipe(v.string(), v.nonEmpty('Verification token is required')),
});
