import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { expenseFormSchema } from '$lib/validation/index';
import { plannerDb } from '$lib/server/db';
import {
	expenseItems,
	weddings,
	expenseCategories,
	savingsItems,
} from '$lib/server/db/schema/planner';
import { eq, and, sum, desc } from 'drizzle-orm';
import type { ExpenseStatus } from '$lib/types';

export const load: PageServerLoad = async ({ locals: { supabase }, depends }) => {
	depends('expense:list');
	const expenseForm = await superValidate(zod4(expenseFormSchema as any));

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
			stats: {
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
			tasks: [],
		};
	}

	const [plannedBudget, budgetSpent, totalSavings] = await Promise.all([
		plannerDb
			.select({ total: sum(weddings.budget) })
			.from(weddings)
			.where(eq(weddings.id, wedding.id))
			.then((result) => result[0]?.total ?? '0'),

		plannerDb
			.select({ total: sum(expenseItems.amount) })
			.from(expenseItems)
			.where(eq(expenseItems.weddingId, wedding.id))
			.then((result) => result[0]?.total ?? '0'),

		plannerDb
			.select({ total: sum(savingsItems.amount) })
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
		stats: {
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

		const form = await superValidate(request, zod4(expenseFormSchema as any));
		if (!form.valid) return fail(400, { form });

		const { description, category, amount, paymentStatus, date } = form.data as any;

		try {
			let expenseCategory = await plannerDb.query.expenseCategories.findFirst({
				where: and(
					eq(expenseCategories.weddingId, wedding.id),
					eq(expenseCategories.category, category),
				),
			});

			if (!expenseCategory) {
				const [newCategory] = await plannerDb
					.insert(expenseCategories)
					.values({
						weddingId: wedding.id,
						category,
						allocatedAmount: '0',
						spentAmount: '0',
					})
					.returning();
				expenseCategory = newCategory;
			}

			const newExpense = await plannerDb
				.insert(expenseItems)
				.values({
					weddingId: wedding.id,
					description,
					expenseCategoryId: expenseCategory.id,
					category,
					amount,
					paymentStatus,
					dueDate: date,
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
					paymentStatus: newPaymentStatus,
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

		const form = await superValidate(request, zod4(expenseFormSchema as any));
		if (!form.valid) return fail(400, { form });

		const data = await request.formData();
		const expenseId = data.get('id') as string;

		if (!expenseId) {
			return fail(400, { form, error: 'Missing expense ID' });
		}

		const { description, category, amount, paymentStatus, date } = form.data as any;

		try {
			let expenseCategory = await plannerDb.query.expenseCategories.findFirst({
				where: and(
					eq(expenseCategories.weddingId, wedding.id),
					eq(expenseCategories.category, category),
				),
			});

			if (!expenseCategory) {
				const [newCategory] = await plannerDb
					.insert(expenseCategories)
					.values({
						weddingId: wedding.id,
						category,
						allocatedAmount: '0',
						spentAmount: '0',
					})
					.returning();
				expenseCategory = newCategory;
			}

			const updatedExpense = await plannerDb
				.update(expenseItems)
				.set({
					description,
					expenseCategoryId: expenseCategory.id,
					category,
					amount,
					paymentStatus,
					dueDate: date,
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
