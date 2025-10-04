import { describe, it, expect } from 'vitest';
import { taskFormSchema } from '../index';

describe('Enhanced Task Schema', () => {
	describe('Task Description Validation', () => {
		it('should accept valid task descriptions', () => {
			const validData = {
				description: 'Complete wedding venue booking with detailed requirements',
				category: 'venue',
				priority: 'medium',
				status: 'pending',
				date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
			};
			
			expect(() => taskFormSchema.parse(validData)).not.toThrow();
		});

		it('should reject descriptions that are too short', () => {
			const invalidData = {
				description: 'Book',
				category: 'venue',
				priority: 'medium',
				status: 'pending',
				date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
			};
			
			expect(() => taskFormSchema.parse(invalidData)).toThrow();
		});

		it('should reject descriptions that are too long', () => {
			const invalidData = {
				description: 'A'.repeat(1001), // 1001 characters
				category: 'venue',
				priority: 'medium',
				status: 'pending',
				date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
			};
			
			expect(() => taskFormSchema.parse(invalidData)).toThrow();
		});

		it('should reject meaningless descriptions', () => {
			const invalidData = {
				description: 'aaaaa', // Only repeated characters
				category: 'venue',
				priority: 'medium',
				status: 'pending',
				date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
			};
			
			expect(() => taskFormSchema.parse(invalidData)).toThrow();
		});

		it('should transform description by capitalizing first letter and cleaning spaces', () => {
			const inputData = {
				description: '  book   wedding   venue  ',
				category: 'venue',
				priority: 'medium',
				status: 'pending',
				date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
			};
			
			const result = taskFormSchema.parse(inputData);
			expect(result.description).toBe('Book wedding venue');
		});
	});

	describe('Due Date Validation', () => {
		it('should accept future dates', () => {
			const validData = {
				description: 'Complete wedding venue booking',
				category: 'venue',
				priority: 'medium',
				status: 'pending',
				date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
			};
			
			expect(() => taskFormSchema.parse(validData)).not.toThrow();
		});

		it('should accept today as due date', () => {
			const today = new Date();
			today.setHours(12, 0, 0, 0); // Set to noon today
			
			const validData = {
				description: 'Complete wedding venue booking',
				category: 'venue',
				priority: 'medium',
				status: 'pending',
				date: today
			};
			
			expect(() => taskFormSchema.parse(validData)).not.toThrow();
		});

		it('should reject past dates', () => {
			const invalidData = {
				description: 'Complete wedding venue booking',
				category: 'venue',
				priority: 'medium',
				status: 'pending',
				date: new Date(Date.now() - 24 * 60 * 60 * 1000) // Yesterday
			};
			
			expect(() => taskFormSchema.parse(invalidData)).toThrow('Due date cannot be in the past');
		});

		it('should handle string dates and convert them', () => {
			const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
			const validData = {
				description: 'Complete wedding venue booking',
				category: 'venue',
				priority: 'medium',
				status: 'pending',
				date: tomorrow.toISOString()
			};
			
			const result = taskFormSchema.parse(validData);
			expect(result.date).toBeInstanceOf(Date);
		});
	});

	describe('Priority-based Conditional Validation', () => {
		it('should require longer descriptions for high priority tasks', () => {
			const invalidData = {
				description: 'Book venue', // Too short for high priority
				category: 'venue',
				priority: 'high',
				status: 'pending',
				date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
			};
			
			expect(() => taskFormSchema.parse(invalidData)).toThrow('High priority tasks require more detailed descriptions');
		});

		it('should accept longer descriptions for high priority tasks', () => {
			const validData = {
				description: 'Complete wedding venue booking with detailed requirements and timeline coordination',
				category: 'venue',
				priority: 'high',
				status: 'pending',
				date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
			};
			
			expect(() => taskFormSchema.parse(validData)).not.toThrow();
		});

		it('should allow short descriptions for low and medium priority tasks', () => {
			const validDataLow = {
				description: 'Book venue',
				category: 'venue',
				priority: 'low',
				status: 'pending',
				date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
			};

			const validDataMedium = {
				description: 'Book venue',
				category: 'venue',
				priority: 'medium',
				status: 'pending',
				date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
			};
			
			expect(() => taskFormSchema.parse(validDataLow)).not.toThrow();
			expect(() => taskFormSchema.parse(validDataMedium)).not.toThrow();
		});
	});

	describe('Required Fields Validation', () => {
		it('should require all mandatory fields', () => {
			const incompleteData = {
				description: 'Complete wedding venue booking'
				// Missing category, priority, status, date
			};
			
			expect(() => taskFormSchema.parse(incompleteData)).toThrow();
		});

		it('should validate enum values for category, priority, and status', () => {
			const invalidData = {
				description: 'Complete wedding venue booking',
				category: 'invalid-category',
				priority: 'invalid-priority',
				status: 'invalid-status',
				date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
			};
			
			expect(() => taskFormSchema.parse(invalidData)).toThrow();
		});
	});

	describe('Edge Cases', () => {
		it('should handle empty strings properly', () => {
			const invalidData = {
				description: '',
				category: 'venue',
				priority: 'medium',
				status: 'pending',
				date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
			};
			
			expect(() => taskFormSchema.parse(invalidData)).toThrow();
		});

		it('should handle whitespace-only descriptions', () => {
			const invalidData = {
				description: '     ',
				category: 'venue',
				priority: 'medium',
				status: 'pending',
				date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
			};
			
			expect(() => taskFormSchema.parse(invalidData)).toThrow();
		});

		it('should handle special characters in descriptions', () => {
			const validData = {
				description: 'Book venue @ 2:00 PM - confirm with vendor!',
				category: 'venue',
				priority: 'medium',
				status: 'pending',
				date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
			};
			
			expect(() => taskFormSchema.parse(validData)).not.toThrow();
		});
	});
});