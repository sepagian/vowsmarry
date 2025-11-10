import { describe, it, expect } from 'vitest';
import { budgetCalculationSchema } from '../index.js';

describe('Budget Calculation Schema', () => {
	describe('Valid Calculations', () => {
		it('should validate correct budget calculation with matching totals', () => {
			const validData = {
				totalBudget: 100000,
				totalSpent: 75000,
				totalRemaining: 25000,
				categories: [
					{
						name: 'Venue',
						budgetAmount: 50000,
						actualAmount: 45000,
						description: 'Wedding venue and setup',
					},
					{
						name: 'Catering',
						budgetAmount: 30000,
						actualAmount: 20000,
						description: 'Food and beverages',
					},
					{
						name: 'Photography',
						budgetAmount: 20000,
						actualAmount: 10000,
						description: 'Wedding photography',
					},
				],
			};

			const result = budgetCalculationSchema.safeParse(validData);
			expect(result.success).toBe(true);
		});

		it('should validate budget with zero amounts', () => {
			const validData = {
				totalBudget: 0,
				totalSpent: 0,
				totalRemaining: 0,
				categories: [],
			};

			const result = budgetCalculationSchema.safeParse(validData);
			expect(result.success).toBe(true);
		});

		it('should validate budget with single category', () => {
			const validData = {
				totalBudget: 50000,
				totalSpent: 30000,
				totalRemaining: 20000,
				categories: [
					{
						name: 'Venue',
						budgetAmount: 50000,
						actualAmount: 30000,
						description: 'Complete venue package',
					},
				],
			};

			const result = budgetCalculationSchema.safeParse(validData);
			expect(result.success).toBe(true);
		});

		it('should validate budget with no spending yet', () => {
			const validData = {
				totalBudget: 75000,
				totalSpent: 0,
				totalRemaining: 75000,
				categories: [
					{
						name: 'Venue',
						budgetAmount: 40000,
						actualAmount: 0,
					},
					{
						name: 'Catering',
						budgetAmount: 35000,
						actualAmount: 0,
					},
				],
			};

			const result = budgetCalculationSchema.safeParse(validData);
			expect(result.success).toBe(true);
		});

		it('should handle floating point precision correctly', () => {
			const validData = {
				totalBudget: 100.5,
				totalSpent: 75.25,
				totalRemaining: 25.25,
				categories: [
					{
						name: 'Venue',
						budgetAmount: 100.5,
						actualAmount: 75.25,
					},
				],
			};

			const result = budgetCalculationSchema.safeParse(validData);
			expect(result.success).toBe(true);
		});
	});

	describe('Invalid Calculations', () => {
		it('should reject when remaining amount does not match calculation', () => {
			const invalidData = {
				totalBudget: 100000,
				totalSpent: 75000,
				totalRemaining: 30000, // Should be 25000
				categories: [
					{
						name: 'Venue',
						budgetAmount: 100000,
						actualAmount: 75000,
					},
				],
			};

			const result = budgetCalculationSchema.safeParse(invalidData);
			expect(result.success).toBe(false);

			if (!result.success) {
				expect(result.error.issues[0].message).toContain(
					'remaining amount does not match budget minus spent',
				);
			}
		});

		it('should reject when category budget totals do not match overall budget', () => {
			const invalidData = {
				totalBudget: 100000,
				totalSpent: 50000,
				totalRemaining: 50000,
				categories: [
					{
						name: 'Venue',
						budgetAmount: 60000, // Total categories = 90000, not 100000
						actualAmount: 30000,
					},
					{
						name: 'Catering',
						budgetAmount: 30000,
						actualAmount: 20000,
					},
				],
			};

			const result = budgetCalculationSchema.safeParse(invalidData);
			expect(result.success).toBe(false);

			if (!result.success) {
				expect(result.error.issues[0].message).toContain(
					'Category totals do not match overall budget totals',
				);
			}
		});

		it('should reject when category spent totals do not match overall spent', () => {
			const invalidData = {
				totalBudget: 100000,
				totalSpent: 75000,
				totalRemaining: 25000,
				categories: [
					{
						name: 'Venue',
						budgetAmount: 60000,
						actualAmount: 30000, // Total spent = 50000, not 75000
					},
					{
						name: 'Catering',
						budgetAmount: 40000,
						actualAmount: 20000,
					},
				],
			};

			const result = budgetCalculationSchema.safeParse(invalidData);
			expect(result.success).toBe(false);

			if (!result.success) {
				expect(result.error.issues[0].message).toContain(
					'Category totals do not match overall budget totals',
				);
			}
		});

		it('should reject negative total budget', () => {
			const invalidData = {
				totalBudget: -10000,
				totalSpent: 0,
				totalRemaining: -10000,
				categories: [],
			};

			const result = budgetCalculationSchema.safeParse(invalidData);
			expect(result.success).toBe(false);

			if (!result.success) {
				expect(result.error.issues[0].message).toContain('Total budget must be 0 or greater');
			}
		});

		it('should reject negative total spent', () => {
			const invalidData = {
				totalBudget: 10000,
				totalSpent: -5000,
				totalRemaining: 15000,
				categories: [],
			};

			const result = budgetCalculationSchema.safeParse(invalidData);
			expect(result.success).toBe(false);

			if (!result.success) {
				expect(result.error.issues[0].message).toContain('Total spent must be 0 or greater');
			}
		});

		it('should reject unreasonably high budget amounts', () => {
			const invalidData = {
				totalBudget: 1_000_000_001, // Over 1 billion
				totalSpent: 0,
				totalRemaining: 1_000_000_001,
				categories: [],
			};

			const result = budgetCalculationSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
		});
	});

	describe('Edge Cases', () => {
		it('should handle budget where spent equals budget', () => {
			const validData = {
				totalBudget: 50000,
				totalSpent: 50000,
				totalRemaining: 0,
				categories: [
					{
						name: 'Venue',
						budgetAmount: 50000,
						actualAmount: 50000,
					},
				],
			};

			const result = budgetCalculationSchema.safeParse(validData);
			expect(result.success).toBe(true);
		});

		it('should handle budget where spent exceeds budget', () => {
			const validData = {
				totalBudget: 50000,
				totalSpent: 60000,
				totalRemaining: -10000, // Negative remaining is mathematically correct
				categories: [
					{
						name: 'Venue',
						budgetAmount: 50000,
						actualAmount: 60000,
					},
				],
			};

			const result = budgetCalculationSchema.safeParse(validData);
			expect(result.success).toBe(true);
		});

		it('should handle very small amounts with floating point precision', () => {
			const validData = {
				totalBudget: 0.03,
				totalSpent: 0.01,
				totalRemaining: 0.02,
				categories: [
					{
						name: 'Small Item',
						budgetAmount: 0.03,
						actualAmount: 0.01,
					},
				],
			};

			const result = budgetCalculationSchema.safeParse(validData);
			expect(result.success).toBe(true);
		});

		it('should handle precision errors within tolerance', () => {
			// Simulate floating point precision issues
			const validData = {
				totalBudget: 100.1,
				totalSpent: 50.05,
				totalRemaining: 50.05, // Might have tiny precision error
				categories: [
					{
						name: 'Category',
						budgetAmount: 100.1,
						actualAmount: 50.05,
					},
				],
			};

			const result = budgetCalculationSchema.safeParse(validData);
			expect(result.success).toBe(true);
		});

		it('should reject precision errors beyond tolerance', () => {
			const invalidData = {
				totalBudget: 100,
				totalSpent: 50,
				totalRemaining: 50.02, // Error > 0.01 tolerance
				categories: [
					{
						name: 'Category',
						budgetAmount: 100,
						actualAmount: 50,
					},
				],
			};

			const result = budgetCalculationSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
		});

		it('should handle multiple categories with complex calculations', () => {
			const validData = {
				totalBudget: 123457.78,
				totalSpent: 98765.43,
				totalRemaining: 24692.35,
				categories: [
					{
						name: 'Venue',
						budgetAmount: 50000.25,
						actualAmount: 45000.12,
					},
					{
						name: 'Catering',
						budgetAmount: 35000.5,
						actualAmount: 30000.25,
					},
					{
						name: 'Photography',
						budgetAmount: 25000.75,
						actualAmount: 15000.5,
					},
					{
						name: 'Decoration',
						budgetAmount: 13456.28,
						actualAmount: 8764.56,
					},
				],
			};

			const result = budgetCalculationSchema.safeParse(validData);
			expect(result.success).toBe(true);
		});
	});
});
