import { describe, it, expect } from 'vitest';
import { taskFormSchema } from '../index';

// Helper function to get ISO date string
const getISODate = (daysFromNow: number) => {
	const date = new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000);
	return date.toISOString().split('T')[0]; // YYYY-MM-DD format
};

describe('Enhanced Task Schema', () => {
	describe('Task Description Validation', () => {
		it('should accept valid task descriptions', () => {
			const validData = {
				description: 'Complete wedding venue booking with detailed requirements',
				category: 'venue',
				priority: 'medium',
				status: 'pending',
				date: getISODate(7) // 7 days from now
			};
			
			expect(() => taskFormSchema.parse(validData)).not.toThrow();
		});

		it('should reject descriptions that are too short', () => {
			const invalidData = {
				description: 'Book',
				category: 'venue',
				priority: 'medium',
				status: 'pending',
				date: getISODate(7)
			};
			
			expect(() => taskFormSchema.parse(invalidData)).toThrow();
		});

		it('should reject descriptions that are too long', () => {
			const invalidData = {
				description: 'A'.repeat(1001), // 1001 characters
				category: 'venue',
				priority: 'medium',
				status: 'pending',
				date: getISODate(7)
			};
			
			expect(() => taskFormSchema.parse(invalidData)).toThrow();
		});

		it('should reject meaningless descriptions', () => {
			const invalidData = {
				description: 'aaaaa', // Only repeated characters
				category: 'venue',
				priority: 'medium',
				status: 'pending',
				date: getISODate(7)
			};
			
			expect(() => taskFormSchema.parse(invalidData)).toThrow();
		});

		it('should transform description by capitalizing first letter and cleaning spaces', () => {
			const inputData = {
				description: '  book wedding venue  ',
				category: 'venue',
				priority: 'medium',
				status: 'pending',
				date: getISODate(7)
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
				date: getISODate(7) // 7 days from now
			};
			
			expect(() => taskFormSchema.parse(validData)).not.toThrow();
		});

		it('should accept today as due date', () => {
			const validData = {
				description: 'Complete wedding venue booking',
				category: 'venue',
				priority: 'medium',
				status: 'pending',
				date: getISODate(0) // Today
			};
			
			expect(() => taskFormSchema.parse(validData)).not.toThrow();
		});

		it('should reject past dates', () => {
			const invalidData = {
				description: 'Complete wedding venue booking',
				category: 'venue',
				priority: 'medium',
				status: 'pending',
				date: getISODate(-1) // Yesterday
			};
			
			expect(() => taskFormSchema.parse(invalidData)).toThrow('Please select a future date for the task due date');
		});

		it('should handle ISO date strings', () => {
			const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
			const validData = {
				description: 'Complete wedding venue booking',
				category: 'venue',
				priority: 'medium',
				status: 'pending',
				date: tomorrow.toISOString().split('T')[0] // ISO date string (YYYY-MM-DD)
			};
			
			const result = taskFormSchema.parse(validData);
			expect(result.date).toBe(tomorrow.toISOString().split('T')[0]);
		});
	});

	describe('Priority Validation', () => {
		it('should accept all priority levels with any description length', () => {
			const validDataHigh = {
				description: 'Book venue',
				category: 'venue',
				priority: 'high',
				status: 'pending',
				date: getISODate(7)
			};
			
			const validDataMedium = {
				description: 'Call venue',
				category: 'venue',
				priority: 'medium',
				status: 'pending',
				date: getISODate(7)
			};
			
			const validDataLow = {
				description: 'Check venue',
				category: 'venue',
				priority: 'low',
				status: 'pending',
				date: getISODate(7)
			};
			
			expect(() => taskFormSchema.parse(validDataHigh)).not.toThrow();
			expect(() => taskFormSchema.parse(validDataMedium)).not.toThrow();
			expect(() => taskFormSchema.parse(validDataLow)).not.toThrow();
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
				date: getISODate(7)
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
				date: getISODate(7)
			};
			
			expect(() => taskFormSchema.parse(invalidData)).toThrow();
		});

		it('should handle whitespace-only descriptions', () => {
			const invalidData = {
				description: '     ',
				category: 'venue',
				priority: 'medium',
				status: 'pending',
				date: getISODate(7)
			};
			
			expect(() => taskFormSchema.parse(invalidData)).toThrow();
		});

		it('should handle special characters in descriptions', () => {
			const validData = {
				description: 'Book venue @ 2:00 PM (confirm with John & Mary)',
				category: 'venue',
				priority: 'medium',
				status: 'pending',
				date: getISODate(7)
			};
			
			expect(() => taskFormSchema.parse(validData)).not.toThrow();
		});
	});
});