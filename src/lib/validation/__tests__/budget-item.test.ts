import { describe, it, expect } from 'vitest';
import { budgetItemFormSchema, budgetItemSchema, budgetItemsArraySchema } from '../index.js';

describe('Budget Item Schema', () => {
	describe('Valid Data', () => {
		it('should validate correct budget item data with all fields', () => {
			const validData = {
				name: 'Wedding Photographer',
				category: 'photo-video',
				estimatedAmount: 25000,
				actualAmount: 24000,
				status: 'on-budget',
				priority: 'high',
				dueDate: new Date('2025-12-31'),
				vendor: 'Amazing Photography Studio',
				notes: 'Includes engagement shoot and wedding day coverage',
			};

			const result = budgetItemFormSchema.safeParse(validData);
			expect(result.success).toBe(true);

			if (result.success) {
				expect(result.data.name).toBe('Wedding Photographer');
				expect(result.data.category).toBe('photo-video');
				expect(result.data.estimatedAmount).toBe(25000);
				expect(result.data.actualAmount).toBe(24000);
				expect(result.data.status).toBe('on-budget');
				expect(result.data.priority).toBe('high');
				expect(result.data.vendor).toBe('Amazing Photography Studio');
			}
		});

		it('should validate minimal budget item data with only required fields', () => {
			const minimalData = {
				name: 'Wedding Cake',
				category: 'catering',
				estimatedAmount: 5000,
			};

			const result = budgetItemFormSchema.safeParse(minimalData);
			expect(result.success).toBe(true);

			if (result.success) {
				expect(result.data.name).toBe('Wedding Cake');
				expect(result.data.category).toBe('catering');
				expect(result.data.estimatedAmount).toBe(5000);
				expect(result.data.actualAmount).toBe(0); // Should default to 0
				expect(result.data.status).toBe('not-started'); // Should default
				expect(result.data.priority).toBe('medium'); // Should default
			}
		});

		it('should validate future due date', () => {
			const futureDate = new Date();
			futureDate.setDate(futureDate.getDate() + 30);

			const validData = {
				name: 'Future Item',
				category: 'venue',
				estimatedAmount: 10000,
				dueDate: futureDate,
			};

			const result = budgetItemFormSchema.safeParse(validData);
			expect(result.success).toBe(true);
		});

		it('should sanitize and format item name', () => {
			const dataWithSpaces = {
				name: '  wedding flowers  ',
				category: 'decoration',
				estimatedAmount: 3000,
			};

			const result = budgetItemFormSchema.safeParse(dataWithSpaces);
			expect(result.success).toBe(true);

			if (result.success) {
				expect(result.data.name).toBe('wedding flowers'); // Should be trimmed
			}
		});
	});

	describe('Invalid Data', () => {
		it('should reject item with empty name', () => {
			const invalidData = {
				name: '',
				category: 'catering',
				estimatedAmount: 1000,
			};

			const result = budgetItemFormSchema.safeParse(invalidData);
			expect(result.success).toBe(false);

			if (!result.success) {
				expect(result.error.issues[0].message).toContain('Item name must be at least 2 characters');
			}
		});

		it('should reject item with name too short', () => {
			const invalidData = {
				name: 'A',
				category: 'catering',
				estimatedAmount: 1000,
			};

			const result = budgetItemFormSchema.safeParse(invalidData);
			expect(result.success).toBe(false);

			if (!result.success) {
				expect(result.error.issues[0].message).toContain('Item name must be at least 2 characters');
			}
		});

		it('should reject item with name too long', () => {
			const invalidData = {
				name: 'A'.repeat(201), // 201 characters
				category: 'catering',
				estimatedAmount: 1000,
			};

			const result = budgetItemFormSchema.safeParse(invalidData);
			expect(result.success).toBe(false);

			if (!result.success) {
				expect(result.error.issues[0].message).toContain(
					'Item name must be less than 200 characters',
				);
			}
		});

		it('should reject invalid category', () => {
			const invalidData = {
				name: 'Valid Item',
				category: 'invalid-category',
				estimatedAmount: 1000,
			};

			const result = budgetItemFormSchema.safeParse(invalidData);
			expect(result.success).toBe(false);

			if (!result.success) {
				expect(result.error.issues[0].message).toContain('Please select a valid budget category');
			}
		});

		it('should reject negative estimated amount', () => {
			const invalidData = {
				name: 'Valid Item',
				category: 'catering',
				estimatedAmount: -1000,
			};

			const result = budgetItemFormSchema.safeParse(invalidData);
			expect(result.success).toBe(false);

			if (!result.success) {
				expect(result.error.issues[0].message).toContain('Estimated amount must be 0 or greater');
			}
		});

		it('should reject negative actual amount', () => {
			const invalidData = {
				name: 'Valid Item',
				category: 'catering',
				estimatedAmount: 1000,
				actualAmount: -500,
			};

			const result = budgetItemFormSchema.safeParse(invalidData);
			expect(result.success).toBe(false);

			if (!result.success) {
				expect(result.error.issues[0].message).toContain('Actual amount must be 0 or greater');
			}
		});

		it('should reject past due date', () => {
			const pastDate = new Date();
			pastDate.setDate(pastDate.getDate() - 1);

			const invalidData = {
				name: 'Past Due Item',
				category: 'venue',
				estimatedAmount: 10000,
				dueDate: pastDate,
			};

			const result = budgetItemFormSchema.safeParse(invalidData);
			expect(result.success).toBe(false);

			if (!result.success) {
				expect(result.error.issues[0].message).toContain('Due date cannot be in the past');
			}
		});

		it('should reject when actual amount significantly exceeds estimated', () => {
			const invalidData = {
				name: 'Over Budget Item',
				category: 'catering',
				estimatedAmount: 10000,
				actualAmount: 14000, // 40% over estimate
			};

			const result = budgetItemFormSchema.safeParse(invalidData);
			expect(result.success).toBe(false);

			if (!result.success) {
				expect(result.error.issues[0].message).toContain('significantly higher than estimated');
			}
		});

		it('should reject vendor name that is too long', () => {
			const invalidData = {
				name: 'Valid Item',
				category: 'catering',
				estimatedAmount: 1000,
				vendor: 'A'.repeat(101), // 101 characters
			};

			const result = budgetItemFormSchema.safeParse(invalidData);
			expect(result.success).toBe(false);

			if (!result.success) {
				expect(result.error.issues[0].message).toContain(
					'Vendor name must be less than 100 characters',
				);
			}
		});

		it('should reject notes that are too long', () => {
			const invalidData = {
				name: 'Valid Item',
				category: 'catering',
				estimatedAmount: 1000,
				notes: 'A'.repeat(1001), // 1001 characters
			};

			const result = budgetItemFormSchema.safeParse(invalidData);
			expect(result.success).toBe(false);

			if (!result.success) {
				expect(result.error.issues[0].message).toContain('Notes must be less than 1000 characters');
			}
		});

		it('should reject invalid status', () => {
			const invalidData = {
				name: 'Valid Item',
				category: 'catering',
				estimatedAmount: 1000,
				status: 'invalid-status',
			};

			const result = budgetItemFormSchema.safeParse(invalidData);
			expect(result.success).toBe(false);

			if (!result.success) {
				expect(result.error.issues[0].message).toContain('Please select a valid budget status');
			}
		});

		it('should reject invalid priority', () => {
			const invalidData = {
				name: 'Valid Item',
				category: 'catering',
				estimatedAmount: 1000,
				priority: 'invalid-priority',
			};

			const result = budgetItemFormSchema.safeParse(invalidData);
			expect(result.success).toBe(false);

			if (!result.success) {
				expect(result.error.issues[0].message).toContain('Please select a valid priority level');
			}
		});
	});

	describe('Edge Cases', () => {
		it('should allow actual amount equal to estimated amount', () => {
			const edgeData = {
				name: 'Exact Estimate',
				category: 'catering',
				estimatedAmount: 10000,
				actualAmount: 10000,
			};

			const result = budgetItemFormSchema.safeParse(edgeData);
			expect(result.success).toBe(true);
		});

		it('should allow actual amount 30% over estimated (at the limit)', () => {
			const edgeData = {
				name: 'At Limit Item',
				category: 'catering',
				estimatedAmount: 10000,
				actualAmount: 13000, // Exactly 30% over
			};

			const result = budgetItemFormSchema.safeParse(edgeData);
			expect(result.success).toBe(true);
		});

		it('should allow today as due date', () => {
			const today = new Date();
			today.setHours(0, 0, 0, 0);

			const validData = {
				name: 'Today Item',
				category: 'venue',
				estimatedAmount: 10000,
				dueDate: today,
			};

			const result = budgetItemFormSchema.safeParse(validData);
			expect(result.success).toBe(true);
		});

		it('should handle empty optional fields', () => {
			const dataWithEmptyFields = {
				name: 'Item',
				category: 'catering',
				estimatedAmount: 1000,
				vendor: '',
				notes: '',
			};

			const result = budgetItemFormSchema.safeParse(dataWithEmptyFields);
			expect(result.success).toBe(true);
		});

		it('should handle zero estimated amount', () => {
			const zeroData = {
				name: 'Free Item',
				category: 'miscellaneous',
				estimatedAmount: 0,
			};

			const result = budgetItemFormSchema.safeParse(zeroData);
			expect(result.success).toBe(true);
		});
	});

	describe('Discriminated Union Schema', () => {
		it('should validate with action field', () => {
			const validData = {
				name: 'Action Item',
				category: 'catering',
				estimatedAmount: 5000,
				action: 'default' as const,
			};

			const result = budgetItemSchema.safeParse(validData);
			expect(result.success).toBe(true);
		});

		it('should reject without action field', () => {
			const invalidData = {
				name: 'No Action Item',
				category: 'catering',
				estimatedAmount: 5000,
			};

			const result = budgetItemSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
		});
	});
});

describe('Budget Items Array Schema', () => {
	describe('Valid Arrays', () => {
		it('should validate array of valid budget items', () => {
			const validItems = [
				{
					name: 'Wedding Cake',
					category: 'catering',
					estimatedAmount: 5000,
				},
				{
					name: 'Photographer',
					category: 'photo-video',
					estimatedAmount: 20000,
				},
			];

			const result = budgetItemsArraySchema.safeParse(validItems);
			expect(result.success).toBe(true);
		});

		it('should validate empty array', () => {
			const result = budgetItemsArraySchema.safeParse([]);
			expect(result.success).toBe(true);
		});

		it('should allow same names in different categories', () => {
			const validItems = [
				{
					name: 'Setup',
					category: 'venue',
					estimatedAmount: 5000,
				},
				{
					name: 'Setup',
					category: 'catering',
					estimatedAmount: 3000,
				},
			];

			const result = budgetItemsArraySchema.safeParse(validItems);
			expect(result.success).toBe(true);
		});
	});

	describe('Invalid Arrays', () => {
		it('should reject duplicate item names within same category', () => {
			const invalidItems = [
				{
					name: 'Wedding Cake',
					category: 'catering',
					estimatedAmount: 5000,
				},
				{
					name: 'Wedding Cake', // Duplicate name in same category
					category: 'catering',
					estimatedAmount: 6000,
				},
			];

			const result = budgetItemsArraySchema.safeParse(invalidItems);
			expect(result.success).toBe(false);

			if (!result.success) {
				expect(result.error.issues[0].message).toContain('Duplicate item name');
			}
		});

		it('should reject when category total exceeds reasonable limits', () => {
			const invalidItems = [
				{
					name: 'Expensive Venue 1',
					category: 'venue',
					estimatedAmount: 60_000_000,
				},
				{
					name: 'Expensive Venue 2',
					category: 'venue',
					estimatedAmount: 50_000_000, // Total exceeds venue limit
				},
			];

			const result = budgetItemsArraySchema.safeParse(invalidItems);
			expect(result.success).toBe(false);

			if (!result.success) {
				expect(result.error.issues[0].message).toContain('exceeds typical range');
			}
		});

		it('should handle case-insensitive duplicate detection', () => {
			const invalidItems = [
				{
					name: 'Wedding Cake',
					category: 'catering',
					estimatedAmount: 5000,
				},
				{
					name: 'WEDDING CAKE', // Same name, different case
					category: 'catering',
					estimatedAmount: 6000,
				},
			];

			const result = budgetItemsArraySchema.safeParse(invalidItems);
			expect(result.success).toBe(false);

			if (!result.success) {
				expect(result.error.issues[0].message).toContain('Duplicate item name');
			}
		});
	});

	describe('Edge Cases', () => {
		it('should handle items at category limits', () => {
			const edgeItems = [
				{
					name: 'Max Venue',
					category: 'venue',
					estimatedAmount: 100_000_000, // At the limit
				},
			];

			const result = budgetItemsArraySchema.safeParse(edgeItems);
			expect(result.success).toBe(true);
		});

		it('should handle whitespace in duplicate detection', () => {
			const invalidItems = [
				{
					name: '  Wedding Cake  ',
					category: 'catering',
					estimatedAmount: 5000,
				},
				{
					name: 'Wedding Cake',
					category: 'catering',
					estimatedAmount: 6000,
				},
			];

			const result = budgetItemsArraySchema.safeParse(invalidItems);
			expect(result.success).toBe(false);

			if (!result.success) {
				expect(result.error.issues[0].message).toContain('Duplicate item name');
			}
		});
	});
});
