/**
 * Authentication Validation Schemas
 * 
 * This module provides Valibot validation schemas for all authentication-related forms
 * in the VowsMarry application. These schemas ensure data integrity and provide
 * user-friendly error messages for form validation.
 * 
 * @module validation/auth
 */

import * as v from 'valibot';
import { safeEmail } from './sanitization';

/**
 * Reusable password validation pipeline
 * 
 * Enforces password security requirements:
 * - Minimum 6 characters
 * - Maximum 32 characters
 * - At least one lowercase letter
 * - At least one uppercase letter
 * - At least one number
 * 
 * @returns Valibot validation pipeline for password fields
 * 
 * @example
 * ```typescript
 * const schema = v.object({
 *   password: passwordValidation(),
 * });
 * ```
 */
export const passwordValidation = () => v.pipe(
	v.string(),
	v.minLength(6, 'Password must be at least 6 characters'),
	v.maxLength(32, 'Password must be less than 32 characters'),
	v.regex(/[a-z]/, 'Password must contain at least one lowercase letter'),
	v.regex(/[A-Z]/, 'Password must contain at least one uppercase letter'),
	v.regex(/[0-9]/, 'Password must contain at least one number'),
);

/**
 * Reusable string validation pipeline for name fields
 * 
 * Enforces:
 * - Non-empty string
 * - Minimum 2 characters
 * 
 * @returns Valibot validation pipeline for name fields
 * 
 * @example
 * ```typescript
 * const schema = v.object({
 *   firstName: stringValidation(),
 *   lastName: stringValidation(),
 * });
 * ```
 */
export const stringValidation = () => v.pipe(
	v.string(),
	v.nonEmpty('Please fill this field'),
	v.minLength(2, 'Must be at least 2 characters'),
);



/**
 * Login form validation schema
 * 
 * Validates user login credentials with email and password fields.
 * 
 * @example
 * ```typescript
 * import { loginSchema } from '$lib/validation/auth';
 * 
 * const form = superForm(data.form, {
 *   validators: valibot(loginSchema),
 * });
 * ```
 */
export const loginSchema = v.object({
	email: safeEmail(),
	password: v.pipe(v.string(), v.nonEmpty('Please enter your password')),
});

/**
 * Registration form base schema (without password confirmation)
 * 
 * Use `validateRegisterSchema` for the complete schema with password matching validation.
 */
export const registerSchema = v.object({
	firstName: stringValidation(),
	lastName: stringValidation(),
	email: safeEmail(),
	password: passwordValidation(),
	confirmPassword: v.pipe(v.string(), v.nonEmpty('Please confirm your password')),
});

/**
 * Complete registration form validation schema
 * 
 * Includes all registration fields plus password confirmation validation.
 * Use this schema for registration forms.
 * 
 * @example
 * ```typescript
 * import { validateRegisterSchema } from '$lib/validation/auth';
 * 
 * const form = superForm(data.form, {
 *   validators: valibot(validateRegisterSchema),
 * });
 * ```
 */
export const validateRegisterSchema = v.pipe(
	v.object({
		firstName: stringValidation(),
		lastName: stringValidation(),
		email: safeEmail(),
		password: passwordValidation(),
		confirmPassword: v.pipe(v.string(), v.nonEmpty('Please confirm your password')),
	}),
	v.custom((input) => {
		if (typeof input === 'object' && input !== null && 'password' in input && 'confirmPassword' in input) {
			return input.password === input.confirmPassword;
		}
		return false;
	}, 'Passwords do not match')
);

/**
 * Forgot password form validation schema
 * 
 * Validates the email field for password reset requests.
 * 
 * @example
 * ```typescript
 * import { forgotPasswordSchema } from '$lib/validation/auth';
 * 
 * const form = superForm(data.form, {
 *   validators: valibot(forgotPasswordSchema),
 * });
 * ```
 */
export const forgotPasswordSchema = v.object({
	email: v.pipe(safeEmail(), v.nonEmpty('Please enter your email')),
});

/**
 * Password reset form base schema (without password confirmation)
 * 
 * Use `validateResetPasswordSchema` for the complete schema with password matching validation.
 */
export const resetPasswordSchema = v.object({
	token: v.optional(v.string()),
	newPassword: passwordValidation(),
	confirmNewPassword: v.pipe(v.string(), v.nonEmpty('Please confirm your password')),
});

/**
 * Complete password reset form validation schema
 * 
 * Includes token, new password, and password confirmation validation.
 * Use this schema for password reset forms.
 * 
 * @example
 * ```typescript
 * import { validateResetPasswordSchema } from '$lib/validation/auth';
 * 
 * const form = superForm(data.form, {
 *   validators: valibot(validateResetPasswordSchema),
 * });
 * ```
 */
export const validateResetPasswordSchema = v.pipe(
	resetPasswordSchema,
	v.custom((input) => {
		if (typeof input === 'object' && input !== null && 'newPassword' in input && 'confirmNewPassword' in input) {
			return input.newPassword === input.confirmNewPassword;
		}
		return false;
	}, 'Passwords do not match')
);

/**
 * Change password form base schema (without password confirmation)
 * 
 * Use `validateChangePasswordSchema` for the complete schema with password matching validation.
 */
export const changePasswordSchema = v.object({
	oldPassword: v.pipe(v.string(), v.nonEmpty('Please enter your current password')),
	newPassword: passwordValidation(),
	confirmNewPassword: v.pipe(v.string(), v.nonEmpty('Please confirm your new password')),
});

/**
 * Complete change password form validation schema
 * 
 * Includes old password, new password, and password confirmation validation.
 * Use this schema for authenticated users changing their password.
 * 
 * @example
 * ```typescript
 * import { validateChangePasswordSchema } from '$lib/validation/auth';
 * 
 * const form = superForm(data.form, {
 *   validators: valibot(validateChangePasswordSchema),
 * });
 * ```
 */
export const validateChangePasswordSchema = v.pipe(
	changePasswordSchema,
	v.custom((input) => {
		if (typeof input === 'object' && input !== null && 'newPassword' in input && 'confirmNewPassword' in input) {
			return input.newPassword === input.confirmNewPassword;
		}
		return false;
	}, 'Passwords do not match')
);

/**
 * Profile update form validation schema
 * 
 * Validates user profile information (name and email).
 * Does not include password fields.
 * 
 * @example
 * ```typescript
 * import { profileUpdateSchema } from '$lib/validation/auth';
 * 
 * const form = superForm(data.form, {
 *   validators: valibot(profileUpdateSchema),
 * });
 * ```
 */
export const profileUpdateSchema = v.object({
	firstName: stringValidation(),
	lastName: stringValidation(),
	email: safeEmail(),
});

/**
 * Email verification form validation schema
 * 
 * Validates the verification token from email confirmation links.
 * 
 * @example
 * ```typescript
 * import { emailVerificationSchema } from '$lib/validation/auth';
 * 
 * const form = superForm(data.form, {
 *   validators: valibot(emailVerificationSchema),
 * });
 * ```
 */
export const emailVerificationSchema = v.object({
	token: v.pipe(v.string(), v.nonEmpty('Verification token is required')),
});

// ============================================================================
// Type Exports
// ============================================================================

/**
 * Inferred TypeScript type for login form data
 * 
 * @example
 * ```typescript
 * import type { LoginData } from '$lib/validation/auth';
 * 
 * const credentials: LoginData = {
 *   email: 'user@example.com',
 *   password: 'SecurePass123',
 * };
 * ```
 */
export type LoginData = v.InferInput<typeof loginSchema>;

/**
 * Inferred TypeScript type for registration form data
 * 
 * @example
 * ```typescript
 * import type { RegisterData } from '$lib/validation/auth';
 * 
 * const userData: RegisterData = {
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   email: 'john@example.com',
 *   password: 'SecurePass123',
 *   confirmPassword: 'SecurePass123',
 * };
 * ```
 */
export type RegisterData = v.InferInput<typeof validateRegisterSchema>;

/**
 * Inferred TypeScript type for forgot password form data
 */
export type ForgotPasswordData = v.InferInput<typeof forgotPasswordSchema>;

/**
 * Inferred TypeScript type for password reset form data
 */
export type ResetPasswordData = v.InferInput<typeof validateResetPasswordSchema>;
