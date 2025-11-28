import type { Expense, ExpenseStatus, Category } from '$lib/types';
import { BaseStore } from './base-store.svelte';

/**
 * Svelte 5 runes-based expense state management
 * 
 * Provides reactive expense state with computed properties and type-safe methods.
 * Uses Svelte 5 runes for better performance and TypeScript inference.
 */
class ExpensesState extends BaseStore<Expense> {
	/**
	 * Cache for parsed due dates to avoid repeated Date object creation
	 * Key: expense ID, Value: parsed Date object
	 */
	private dueDateCache = new Map<string, Date>();

	/**
	 * Alias for items to maintain backward compatibility
	 */
	get expenses(): Expense[] {
		return this.items;
	}

	/**
	 * Get cached due date for an expense
	 * Creates and caches the Date object if not already cached
	 * 
	 * @param expense - Expense to get due date for
	 * @returns Parsed Date object
	 */
	private getDueDate(expense: Expense): Date {
		if (!expense.id) {
			return new Date(expense.expenseDueDate);
		}

		let cached = this.dueDateCache.get(expense.id);
		if (!cached) {
			cached = new Date(expense.expenseDueDate);
			this.dueDateCache.set(expense.id, cached);
		}
		return cached;
	}

	/**
	 * Clear date cache for a specific expense
	 * 
	 * @param id - Expense ID to clear cache for
	 */
	private clearDateCache(id: string | undefined): void {
		if (id) {
			this.dueDateCache.delete(id);
		}
	}

	/**
	 * Clear all date caches
	 */
	private clearAllDateCaches(): void {
		this.dueDateCache.clear();
	}
	
	/**
	 * Get all paid expenses
	 */
	get paid(): Expense[] {
		return this.expenses.filter(e => e.expensePaymentStatus === 'paid');
	}
	
	/**
	 * Get all unpaid expenses
	 */
	get unpaid(): Expense[] {
		return this.expenses.filter(e => e.expensePaymentStatus === 'unpaid');
	}
	
	/**
	 * Get expenses by status
	 */
	getByStatus(status: ExpenseStatus): Expense[] {
		return this.expenses.filter(e => e.expensePaymentStatus === status);
	}
	
	/**
	 * Get expenses by category
	 */
	getByCategory(category: Category): Expense[] {
		return this.expenses.filter(e => e.expenseCategory === category);
	}
	
	/**
	 * Get overdue unpaid expenses
	 * Uses cached dates for better performance
	 */
	get overdue(): Expense[] {
		const now = new Date();
		return this.unpaid.filter(e => {
			const dueDate = this.getDueDate(e);
			return dueDate < now;
		});
	}
	
	/**
	 * Get expenses due soon (within next 7 days)
	 * Uses cached dates for better performance
	 */
	get dueSoon(): Expense[] {
		const now = new Date();
		const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
		
		return this.unpaid.filter(e => {
			const dueDate = this.getDueDate(e);
			return dueDate >= now && dueDate <= weekFromNow;
		});
	}
	
	/**
	 * Calculate total amount
	 */
	get totalAmount(): number {
		return this.expenses.reduce((sum, e) => sum + e.expenseAmount, 0);
	}
	
	/**
	 * Calculate total paid amount
	 */
	get totalPaid(): number {
		return this.paid.reduce((sum, e) => sum + e.expenseAmount, 0);
	}
	
	/**
	 * Calculate total unpaid amount
	 */
	get totalUnpaid(): number {
		return this.unpaid.reduce((sum, e) => sum + e.expenseAmount, 0);
	}
	
	/**
	 * Calculate total overdue amount
	 */
	get totalOverdue(): number {
		return this.overdue.reduce((sum, e) => sum + e.expenseAmount, 0);
	}
	
	/**
	 * Get expense statistics
	 */
	override get stats() {
		return {
			...super.stats,
			paid: this.paid.length,
			unpaid: this.unpaid.length,
			overdue: this.overdue.length,
			dueSoon: this.dueSoon.length,
			totalAmount: this.totalAmount,
			totalPaid: this.totalPaid,
			totalUnpaid: this.totalUnpaid,
			totalOverdue: this.totalOverdue,
		};
	}
	
	/**
	 * Get payment completion percentage
	 */
	get paymentPercentage(): number {
		if (this.totalAmount === 0) return 0;
		return Math.round((this.totalPaid / this.totalAmount) * 100);
	}
	
	/**
	 * Get expenses grouped by category with totals
	 */
	get byCategory(): Record<Category, { expenses: Expense[]; total: number }> {
		const categories = [
			'accommodation',
			'catering',
			'decoration',
			'entertainment',
			'makeup-attire',
			'paperwork',
			'photo-video',
			'venue',
			'miscellaneous',
			'other',
		] as Category[];
		
		return categories.reduce((acc, category) => {
			const categoryExpenses = this.getByCategory(category);
			acc[category] = {
				expenses: categoryExpenses,
				total: categoryExpenses.reduce((sum, e) => sum + e.expenseAmount, 0),
			};
			return acc;
		}, {} as Record<Category, { expenses: Expense[]; total: number }>);
	}
	

	
	/**
	 * Sort expenses by due date (ascending)
	 * Uses cached dates for better performance
	 */
	sortByDueDate(): void {
		this.items = [...this.items].sort((a, b) => {
			const dateA = this.getDueDate(a).getTime();
			const dateB = this.getDueDate(b).getTime();
			return dateA - dateB;
		});
	}
	
	/**
	 * Sort expenses by amount (descending)
	 */
	sortByAmount(): void {
		this.items = [...this.items].sort((a, b) => b.expenseAmount - a.expenseAmount);
	}

	/**
	 * Override set method to clear date cache
	 */
	override set(items: Expense[]): void {
		super.set(items);
		this.clearAllDateCaches();
	}

	/**
	 * Override update method to clear cache for updated expense
	 */
	override update(id: string | undefined, updates: Partial<Expense>): void {
		super.update(id, updates);
		// Clear cache if due date was updated
		if (updates.expenseDueDate !== undefined) {
			this.clearDateCache(id);
		}
	}

	/**
	 * Override remove method to clear cache for removed expense
	 */
	override remove(id: string | undefined): void {
		super.remove(id);
		this.clearDateCache(id);
	}
}

/**
 * Global expense state instance
 */
export const expensesState = new ExpensesState();
