import { z } from 'zod/v4';
import { passwordValidator } from './utils';
import { sanitizeEmail, sanitizeText } from './sanitization';
import { getErrorMessage, createStringValidator } from './messages';

/**
 * Login schema for user authentication
 * Validates email and password for login forms
 */
export const loginSchema = z.object({
	email: z.email({ message: 'Email address is required' }).transform(sanitizeEmail),

	password: createStringValidator('auth', 'password', {
		required: true,
	}),
});

/**
 * Registration schema for new user signup
 * Includes password confirmation and user details
 */
export const registrationSchema = z
	.object({
		email: z
			.email({ message: 'Please enter a valid email address' })
			.min(1, { message: 'Email address is required' })
			.transform(sanitizeEmail),

		password: passwordValidator,

		confirmPassword: z.string().min(1, { message: 'Please confirm your password' }),

		firstName: z
			.string({ message: 'Please enter your first name' })
			.min(1, { message: 'First name is required' })
			.min(2, { message: 'First name must be at least 2 characters' })
			.max(50, { message: 'First name must be less than 50 characters' })
			.transform(sanitizeText),

		lastName: z
			.string()
			.min(1, { message: 'Last name is required' })
			.min(2, { message: 'Last name must be at least 2 characters' })
			.max(50, { message: 'Last name must be less than 50 characters' })
			.transform(sanitizeText)
			.optional(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword'],
	});

/**
 * Password reset request schema
 * For requesting password reset via email
 */
export const passwordResetRequestSchema = z.object({
	email: z
		.email({ message: 'Please enter a valid email address' })
		.min(1, { message: 'Email address is required' })
		.transform(sanitizeEmail),
});

/**
 * Password reset schema
 * For setting new password with reset token
 */
export const passwordResetSchema = z
	.object({
		token: z.string().min(1, { message: 'Reset token is required' }),

		password: passwordValidator,

		confirmPassword: createStringValidator('auth', 'confirmPassword', {
			required: true,
		}),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: getErrorMessage('auth', 'confirmPassword', 'match'),
		path: ['confirmPassword'],
	});

/**
 * Change password schema
 * For authenticated users changing their password
 */
export const changePasswordSchema = z
	.object({
		currentPassword: z.string().min(1, { message: 'Current password is required' }),

		newPassword: passwordValidator,

		confirmNewPassword: z.string().min(1, { message: 'Please confirm your new password' }),
	})
	.refine((data) => data.newPassword === data.confirmNewPassword, {
		message: "New passwords don't match",
		path: ['confirmNewPassword'],
	})
	.refine((data) => data.currentPassword !== data.newPassword, {
		message: 'New password must be different from current password',
		path: ['newPassword'],
	});

/**
 * Profile update schema
 * For updating user profile information
 */
export const profileUpdateSchema = z.object({
	firstName: createStringValidator('auth', 'firstName', {
		required: true,
		minLength: 2,
		maxLength: 50,
		transform: sanitizeText,
	}),

	lastName: createStringValidator('auth', 'lastName', {
		required: true,
		minLength: 2,
		maxLength: 50,
		transform: sanitizeText,
	}),

	email: z
		.email({ message: 'Please enter a valid email address' })
		.min(1, { message: 'Email address is required' })
		.transform(sanitizeEmail),
});

/**
 * Email verification schema
 * For verifying email addresses with token
 */
export const emailVerificationSchema = z.object({
	token: z.string().min(1, { message: 'Verification token is required' }),

	email: z
		.email({ message: 'Please enter a valid email address' })
		.min(1, { message: 'Email address is required' })
		.transform(sanitizeEmail),
});

// Type exports for use in components
export type LoginData = z.infer<typeof loginSchema>;
export type RegistrationData = z.infer<typeof registrationSchema>;
export type PasswordResetRequestData = z.infer<typeof passwordResetRequestSchema>;
export type PasswordResetData = z.infer<typeof passwordResetSchema>;
export type ChangePasswordData = z.infer<typeof changePasswordSchema>;
export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>;
export type EmailVerificationData = z.infer<typeof emailVerificationSchema>;
