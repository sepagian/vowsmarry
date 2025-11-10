import { describe, it, expect } from 'vitest';
import { budgetCategoryFormSchema, budgetCategorySchema } from '../index.js';

describe('Budget Category Schema', () => {
	describe('Valid Data', () => {
		it('should validate correct budget category data with all fields', () => {
			const validData = {
				name: 'Wedding Venue',
				budgetAmount: 50000,
				actualAmount: 45000,
				description: 'Budget for wedding venue including decorations and setup',
			};

			const result = budgetCategoryFormSchema.safeParse(validData);
			expect(result.success).toBe(true);

			if (result.success) {
				expect(result.data.name).toBe('Wedding Venue');
				expect(result.data.budgetAmount).toBe(50000);
				expect(result.data.actualAmount).toBe(45000);
				expect(result.data.description).toBe(
					'Budget for wedding venue including decorations and setup',
				);
			}
		});

		it('should validate minimal budget category data with only required fields', () => {
			const minimalData = {
				name: 'Catering',
				budgetAmount: 30000,
			};

			const result = budgetCategoryFormSchema.safeParse(minimalData);
			expect(result.success).toBe(true);

			if (result.success) {
				expect(result.data.name).toBe('Catering');
				expect(result.data.budgetAmount).toBe(30000);
				expect(result.data.actualAmount).toBe(0); // Should default to 0
			}
		});

		it('should validate zero budget amounts', () => {
			const zeroData = {
				name: 'Future Category',
				budgetAmount: 0,
				actualAmount: 0,
			};

			const result = budgetCategoryFormSchema.safeParse(zeroData);
			expect(result.success).toBe(true);
		});

		it('should sanitize and format category name', () => {
			const dataWithSpaces = {
				name: '  wedding photography  ',
				budgetAmount: 15000,
			};

			const result = budgetCategoryFormSchema.safeParse(dataWithSpaces);
			expect(result.success).toBe(true);

			if (result.success) {
				expect(result.data.name).toBe('wedding photography'); // Should be trimmed
			}
		});
	});

	describe('Invalid Data', () => {
		it('should reject category with empty name', () => {
			const invalidData = {
				name: '',
				budgetAmount: 10000,
			};

			const result = budgetCategoryFormSchema.safeParse(invalidData);
			expect(result.success).toBe(false);

			if (!result.success) {
				expect(result.error.issues[0].message).toContain(
					'Category name must be at least 2 characters',
				);
			}
		});

		it('should reject category with name too short', () => {
			const invalidData = {
				name: 'A',
				budgetAmount: 10000,
			};

			const result = budgetCategoryFormSchema.safeParse(invalidData);
			expect(result.success).toBe(false);

			if (!result.success) {
				expect(result.error.issues[0].message).toContain(
					'Category name must be at least 2 characters',
				);
			}
		});

		it('should reject category with name too long', () => {
			const invalidData = {
				name: 'A'.repeat(101), // 101 characters
				budgetAmount: 10000,
			};

			const result = budgetCategoryFormSchema.safeParse(invalidData);
			expect(result.success).toBe(false);

			if (!result.success) {
				expect(result.error.issues[0].message).toContain(
					'Category name must be less than 100 characters',
				);
			}
		});

		it('should reject negative budget amount', () => {
			const invalidData = {
				name: 'Valid Category',
				budgetAmount: -1000,
			};

			const result = budgetCategoryFormSchema.safeParse(invalidData);
			expect(result.success).toBe(false);

			if (!result.success) {
				expect(result.error.issues[0].message).toContain('Budget amount must be 0 or greater');
			}
		});

		it('should reject negative actual amount', () => {
			const invalidData = {
				name: 'Valid Category',
				budgetAmount: 10000,
				actualAmount: -500,
			};

			const result = budgetCategoryFormSchema.safeParse(invalidData);
			expect(result.success).toBe(false);

			if (!result.success) {
				expect(result.error.issues[0].message).toContain('Actual amount must be 0 or greater');
			}
		});

		it('should reject when actual amount significantly exceeds budget', () => {
			const invalidData = {
				name: 'Over Budget Category',
				budgetAmount: 10000,
				actualAmount: 16000, // 60% over budget
			};

			const result = budgetCategoryFormSchema.safeParse(invalidData);
			expect(result.success).toBe(false);

			if (!result.success) {
				expect(result.error.issues[0].message).toContain('significantly exceeds budget');
			}
		});

		it('should reject description that is too long', () => {
			const invalidData = {
				name: 'Valid Category',
				budgetAmount: 10000,
				description: 'A'.repeat(501), // 501 characters
			};

			const result = budgetCategoryFormSchema.safeParse(invalidData);
			expect(result.success).toBe(false);

			if (!result.success) {
				expect(result.error.issues[0].message).toContain(
					'Description must be less than 500 characters',
				);
			}
		});

		it('should reject unreasonably high budget amounts', () => {
			const invalidData = {
				name: 'Expensive Category',
				budgetAmount: 1_000_000_001, // Over 1 billion
			};

			const result = budgetCategoryFormSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
		});
	});

	describe('Edge Cases', () => {
		it('should allow actual amount equal to budget', () => {
			const edgeData = {
				name: 'Exact Budget',
				budgetAmount: 10000,
				actualAmount: 10000,
			};

			const result = budgetCategoryFormSchema.safeParse(edgeData);
			expect(result.success).toBe(true);
		});

		it('should allow actual amount 50% over budget (at the limit)', () => {
			const edgeData = {
				name: 'At Limit Category',
				budgetAmount: 10000,
				actualAmount: 15000, // Exactly 50% over
			};

			const result = budgetCategoryFormSchema.safeParse(edgeData);
			expect(result.success).toBe(true);
		});

		it('should handle empty description', () => {
			const dataWithEmptyDescription = {
				name: 'Category',
				budgetAmount: 10000,
				description: '',
			};

			const result = budgetCategoryFormSchema.safeParse(dataWithEmptyDescription);
			expect(result.success).toBe(true);
		});

		it('should handle missing optional fields', () => {
			const minimalData = {
				name: 'Minimal',
				budgetAmount: 5000,
			};

			const result = budgetCategoryFormSchema.safeParse(minimalData);
			expect(result.success).toBe(true);

			if (result.success) {
				expect(result.data.actualAmount).toBe(0);
				expect(result.data.description).toBe('');
			}
		});
	});

	describe('Discriminated Union Schema', () => {
		it('should validate with action field', () => {
			const validData = {
				name: 'Action Category',
				budgetAmount: 20000,
				actualAmount: 18000,
				action: 'default' as const,
			};

			const result = budgetCategorySchema.safeParse(validData);
			expect(result.success).toBe(true);
		});

		it('should reject without action field', () => {
			const invalidData = {
				name: 'No Action Category',
				budgetAmount: 20000,
			};

			const result = budgetCategorySchema.safeParse(invalidData);
			expect(result.success).toBe(false);
		});
	});
});
