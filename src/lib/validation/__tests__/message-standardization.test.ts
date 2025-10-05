import { describe, it, expect } from 'vitest';
import { vendorFormSchema, documentFormSchema, expenseFormSchema, taskFormSchema } from '../index.js';
import { loginSchema, registrationSchema } from '../auth.js';
import { getErrorMessage } from '../messages.js';

describe('Message Standardization', () => {
	it('should use centralized error messages for vendor schema', () => {
		const result = vendorFormSchema.safeParse({
			name: '', // Empty string to trigger required message
			category: 'venue',
			instagram: '@test',
			price: 1000,
			rating: '5',
			status: 'researching'
		});
		expect(result.success).toBe(false);
		
		if (!result.success) {
			const nameError = result.error.issues.find(issue => issue.path.includes('name'));
			expect(nameError?.message).toBe(getErrorMessage('vendor', 'name', 'required'));
		}
	});

	it('should use centralized error messages for document schema', () => {
		const result = documentFormSchema.safeParse({
			name: '', // Empty string to trigger required message
			category: 'venue',
			file: [],
			date: new Date()
		});
		expect(result.success).toBe(false);
		
		if (!result.success) {
			const nameError = result.error.issues.find(issue => issue.path.includes('name'));
			expect(nameError?.message).toBe(getErrorMessage('document', 'name', 'required'));
		}
	});

	it('should use centralized error messages for expense schema', () => {
		const result = expenseFormSchema.safeParse({
			description: '', // Empty string to trigger required message
			amount: 1000,
			category: 'venue',
			status: 'pending',
			date: new Date()
		});
		expect(result.success).toBe(false);
		
		if (!result.success) {
			const descriptionError = result.error.issues.find(issue => issue.path.includes('description'));
			expect(descriptionError?.message).toBe(getErrorMessage('expense', 'description', 'required'));
		}
	});

	it('should use centralized error messages for task schema', () => {
		const result = taskFormSchema.safeParse({
			description: 'ab', // Too short to trigger minLength message
			category: 'venue',
			priority: 'medium',
			status: 'pending',
			date: new Date(Date.now() + 86400000) // Tomorrow
		});
		expect(result.success).toBe(false);
		
		if (!result.success) {
			const descriptionError = result.error.issues.find(issue => issue.path.includes('description'));
			expect(descriptionError?.message).toBe(getErrorMessage('task', 'description', 'minLength'));
		}
	});

	it('should use centralized error messages for auth schemas', () => {
		const loginResult = loginSchema.safeParse({
			email: '', // Empty string to trigger required message
			password: 'password123'
		});
		expect(loginResult.success).toBe(false);
		
		if (!loginResult.success) {
			const emailError = loginResult.error.issues.find(issue => issue.path.includes('email'));
			expect(emailError?.message).toBe(getErrorMessage('auth', 'email', 'required'));
		}

		const registrationResult = registrationSchema.safeParse({
			email: 'test@example.com',
			password: 'password123',
			confirmPassword: 'different',
			firstName: 'John',
			lastName: 'Doe'
		});
		expect(registrationResult.success).toBe(false);
		
		if (!registrationResult.success) {
			const confirmPasswordError = registrationResult.error.issues.find(issue => issue.path.includes('confirmPassword'));
			expect(confirmPasswordError?.message).toBe(getErrorMessage('auth', 'confirmPassword', 'match'));
		}
	});

	it('should provide consistent error message structure', () => {
		// Test that all schemas use the same message structure
		const vendorMessage = getErrorMessage('vendor', 'name', 'required');
		const documentMessage = getErrorMessage('document', 'name', 'required');
		const expenseMessage = getErrorMessage('expense', 'description', 'required');
		const taskMessage = getErrorMessage('task', 'description', 'required');
		const authMessage = getErrorMessage('auth', 'email', 'required');

		// All required messages should follow the same pattern
		expect(vendorMessage).toContain('required');
		expect(documentMessage).toContain('required');
		expect(expenseMessage).toContain('required');
		expect(taskMessage).toContain('required');
		expect(authMessage).toContain('required');
	});
});