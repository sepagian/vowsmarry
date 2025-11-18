import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { expenseSchema } from '$lib/validation/planner';
import { plannerDb } from '$lib/server/db';
import { expenseItems, weddings, savingsItems } from '$lib/server/db/schema/planner';
import { eq, and, sum, desc } from 'drizzle-orm';
import type { ExpenseData, ExpenseStatus } from '$lib/types';

export const load: PageServerLoad = async ({ locals: { supabase }, depends }) => {
	depends('expense:list');
	const expenseForm = await superValidate(valibot(expenseSchema));

	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();

	if (error || !user) {
		redirect(302, '/login');
	}

	const wedding = await plannerDb.query.weddings.findFirst({
		where: eq(weddings.userId, user.id),
	});

	if (!wedding) {
		return {
			expenseForm,
			financeStats: {
				plannedBudget: '0',
				budgetSpent: '0',
				totalSavings: '0',
				budgetRemaining: '0',
				savingProgress: 0,
			},
			update: {
				planned: null,
				spent: null,
			},
			expenses: [],
		};
	}

	const [plannedBudget, budgetSpent, totalSavings] = await Promise.all([
		plannerDb
			.select({ total: sum(weddings.weddingBudget) })
			.from(weddings)
			.where(eq(weddings.id, wedding.id))
			.then((result) => result[0]?.total ?? '0'),

		plannerDb
			.select({ total: sum(expenseItems.expenseAmount) })
			.from(expenseItems)
			.where(eq(expenseItems.weddingId, wedding.id))
			.then((result) => result[0]?.total ?? '0'),

		plannerDb
			.select({ total: sum(savingsItems.savingAmount) })
			.from(savingsItems)
			.where(eq(savingsItems.weddingId, wedding.id))
			.then((result) => result[0]?.total ?? '0'),
	]);

	const [planned, spent] = await Promise.all([
		plannerDb
			.select({ updatedAt: weddings.updatedAt })
			.from(weddings)
			.where(eq(weddings.id, wedding.id))
			.orderBy(desc(weddings.updatedAt))
			.limit(1)
			.then((result) => result[0]?.updatedAt || null),

		plannerDb
			.select({ updatedAt: expenseItems.updatedAt })
			.from(expenseItems)
			.where(eq(expenseItems.weddingId, wedding.id))
			.orderBy(desc(expenseItems.updatedAt))
			.limit(1)
			.then((result) => result[0]?.updatedAt || null),
	]);

	const budgetRemaining = (parseFloat(plannedBudget) - parseFloat(budgetSpent)).toString();

	const savingProgress = Math.floor((parseFloat(totalSavings) / parseFloat(plannedBudget)) * 100);

	const expenses = await plannerDb.query.expenseItems.findMany({
		where: eq(expenseItems.weddingId, wedding.id),
		orderBy: (expenseItems, { desc }) => [desc(expenseItems.createdAt)],
	});

	return {
		expenseForm,
		financeStats: {
			plannedBudget,
			budgetSpent,
			totalSavings,
			budgetRemaining,
			savingProgress,
		},
		update: {
			planned,
			spent,
		},
		expenses,
	};
};

export const actions: Actions = {
	createExpenseItem: async ({ request, locals: { supabase } }) => {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) return fail(401, { error: 'Unauthorized' });

		const wedding = await plannerDb.query.weddings.findFirst({
			where: eq(weddings.userId, user.id),
		});

		if (!wedding) return fail(403, { error: 'No wedding data found' });

		const form = await superValidate(request, valibot(expenseSchema));
		if (!form.valid) return fail(400, { form });

		try {
			const {
				expenseDescription,
				expenseCategory,
				expenseAmount,
				expensePaymentStatus,
				expenseDueDate,
			} = form.data as ExpenseData;

			const newExpense = await plannerDb
				.insert(expenseItems)
				.values({
					weddingId: wedding.id,
					expenseDescription,
					expenseCategory,
					expenseAmount: expenseAmount.toString(),
					expensePaymentStatus,
					expenseDueDate,
				})
				.returning();

			return { form, success: true, expense: newExpense[0] };
		} catch (error) {
			return fail(500, {
				form,
				error: 'Failed to create new expense. Please try again.',
			});
		}
	},

	updatePaymentStatus: async ({ request, locals: { supabase } }) => {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) return fail(401, { error: 'Unauthorized' });

		const wedding = await plannerDb.query.weddings.findFirst({
			where: eq(weddings.userId, user.id),
		});

		if (!wedding) return fail(403, { error: 'No wedding data found' });

		const data = await request.formData();
		const expenseId = data.get('id') as string;
		const newPaymentStatus = data.get('paymentStatus') as ExpenseStatus;

		if (!expenseId || !newPaymentStatus) {
			return fail(400, { error: 'Missing required fields' });
		}

		try {
			const updatedPaymentStatus = await plannerDb
				.update(expenseItems)
				.set({
					expensePaymentStatus: newPaymentStatus,
					updatedAt: new Date(),
				})
				.where(and(eq(expenseItems.id, expenseId), eq(expenseItems.weddingId, wedding.id)))
				.returning();
			if (updatedPaymentStatus.length === 0) {
				return fail(404, { error: 'Expense not found' });
			}

			return { success: true, task: updatedPaymentStatus[0] };
		} catch (error) {
			return fail(500, {
				error: 'Failed to update payment status.',
			});
		}
	},

	editExpenseItem: async ({ request, locals: { supabase } }) => {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) return fail(401, { error: 'Unauthorized' });

		const wedding = await plannerDb.query.weddings.findFirst({
			where: eq(weddings.userId, user.id),
		});

		if (!wedding) return fail(403, { error: 'No wedding data found' });

		const form = await superValidate(request, valibot(expenseSchema));
		if (!form.valid) return fail(400, { form });

		const data = await request.formData();
		const expenseId = data.get('id') as string;

		if (!expenseId) {
			return fail(400, { form, error: 'Missing expense ID' });
		}

		const {
			expenseDescription,
			expenseCategory,
			expenseAmount,
			expensePaymentStatus,
			expenseDueDate,
		} = form.data as ExpenseData;

		try {
			const updatedExpense = await plannerDb
				.update(expenseItems)
				.set({
					expenseDescription,
					expenseCategory,
					expenseAmount: expenseAmount.toString(),
					expensePaymentStatus,
					expenseDueDate,
					updatedAt: new Date(),
				})
				.where(and(eq(expenseItems.id, expenseId), eq(expenseItems.weddingId, wedding.id)))
				.returning();

			if (updatedExpense.length === 0) {
				return fail(404, { form, error: 'Expense not found' });
			}

			return { form, success: true, expense: updatedExpense[0] };
		} catch (error) {
			return fail(500, {
				form,
				error: 'Failed to update expense. Please try again.',
			});
		}
	},

	deleteExpenseItem: async ({ request, locals: { supabase } }) => {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) return fail(401, { error: 'Unauthorized' });

		const wedding = await plannerDb.query.weddings.findFirst({
			where: eq(weddings.userId, user.id),
		});

		if (!wedding) return fail(403, { error: 'No wedding data found' });

		const data = await request.formData();
		const expenseId = data.get('id') as string;

		if (!expenseId) {
			return fail(400, { error: 'Missing expense ID' });
		}

		try {
			const deletedExpense = await plannerDb
				.delete(expenseItems)
				.where(and(eq(expenseItems.id, expenseId), eq(expenseItems.weddingId, wedding.id)))
				.returning();

			if (deletedExpense.length === 0) {
				return fail(404, { error: 'Expense not found' });
			}

			return { success: true };
		} catch (error) {
			return fail(500, {
				error: 'Failed to delete expense. Please try again.',
			});
		}
	},
};
