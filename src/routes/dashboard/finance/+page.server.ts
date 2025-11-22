import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { expenseSchema } from '$lib/validation/planner';
import type { ExpenseData, ExpenseStatus } from '$lib/types';
import { withAuth } from '$lib/server/auth-helpers';

export const load: PageServerLoad = async ({ locals: { supabase }, plannerDb, depends }) => {
	depends('expense:list');
	depends('calendar:data');
	const expenseForm = await superValidate(valibot(expenseSchema));

	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();

	if (error || !user) {
		redirect(302, '/login');
	}

	const wedding = await plannerDb
		.selectFrom('weddings')
		.selectAll()
		.where('userId', '=', user.id)
		.executeTakeFirst();

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
			.selectFrom('weddings')
			.select((eb) => eb.fn.sum<number>('weddingBudget').as('total'))
			.where('id', '=', wedding.id)
			.executeTakeFirst()
			.then((result) => result?.total ?? 0),

		plannerDb
			.selectFrom('expense_items')
			.select((eb) => eb.fn.sum<number>('expenseAmount').as('total'))
			.where('weddingId', '=', wedding.id)
			.executeTakeFirst()
			.then((result) => result?.total ?? 0),

		plannerDb
			.selectFrom('savings_items')
			.select((eb) => eb.fn.sum<number>('savingAmount').as('total'))
			.where('weddingId', '=', wedding.id)
			.executeTakeFirst()
			.then((result) => result?.total ?? 0),
	]);

	const [planned, spent] = await Promise.all([
		plannerDb
			.selectFrom('weddings')
			.select('updatedAt')
			.where('id', '=', wedding.id)
			.orderBy('updatedAt', 'desc')
			.limit(1)
			.executeTakeFirst()
			.then((result) => result?.updatedAt || null),

		plannerDb
			.selectFrom('expense_items')
			.select('updatedAt')
			.where('weddingId', '=', wedding.id)
			.orderBy('updatedAt', 'desc')
			.limit(1)
			.executeTakeFirst()
			.then((result) => result?.updatedAt || null),
	]);

	const budgetRemaining = (plannedBudget - budgetSpent).toString();

	const savingProgress = Math.floor((totalSavings / plannedBudget) * 100);

	const expenses = await plannerDb
		.selectFrom('expense_items')
		.selectAll()
		.where('weddingId', '=', wedding.id)
		.orderBy('createdAt', 'desc')
		.execute();

	return {
		expenseForm,
		financeStats: {
			plannedBudget: plannedBudget.toString(),
			budgetSpent: budgetSpent.toString(),
			totalSavings: totalSavings.toString(),
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
	createExpenseItem: withAuth(async ({ wedding, plannerDb }, { request }) => {
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
				.insertInto('expense_items')
				.values({
					id: crypto.randomUUID(),
					weddingId: wedding.id,
					expenseDescription,
					expenseCategory,
					expenseAmount: expenseAmount,
					expensePaymentStatus,
					expenseDueDate,
					createdAt: Date.now(),
					updatedAt: Date.now(),
				})
				.returningAll()
				.executeTakeFirstOrThrow();

			return { form, success: true, expense: newExpense };
		} catch (error) {
			console.error('createExpenseItem error:', error);
			return fail(500, {
				form,
				error: 'Failed to create new expense. Please try again.',
			});
		}
	}),

	updatePaymentStatus: withAuth(async ({ wedding, plannerDb }, { request }) => {
		const data = await request.formData();
		const expenseId = data.get('id') as string;
		const newPaymentStatus = data.get('paymentStatus') as ExpenseStatus;

		if (!expenseId || !newPaymentStatus) {
			return fail(400, { error: 'Missing required fields' });
		}

		try {
			const updatedPaymentStatus = await plannerDb
				.updateTable('expense_items')
				.set({
					expensePaymentStatus: newPaymentStatus,
					updatedAt: Date.now(),
				})
				.where('id', '=', expenseId)
				.where('weddingId', '=', wedding.id)
				.returningAll()
				.executeTakeFirst();
			if (!updatedPaymentStatus) {
				return fail(404, { error: 'Expense not found' });
			}

			return { success: true, task: updatedPaymentStatus };
		} catch (error) {
			console.error('updatePaymentStatus error:', error);
			return fail(500, {
				error: 'Failed to update payment status.',
			});
		}
	}),

	updateExpenseItem: withAuth(async ({ wedding, plannerDb }, { request }) => {
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
				.updateTable('expense_items')
				.set({
					expenseDescription,
					expenseCategory,
					expenseAmount: expenseAmount,
					expensePaymentStatus,
					expenseDueDate,
					updatedAt: Date.now(),
				})
				.where('id', '=', expenseId)
				.where('weddingId', '=', wedding.id)
				.returningAll()
				.executeTakeFirst();

			if (!updatedExpense) {
				return fail(404, { form, error: 'Expense not found' });
			}

			return { form, success: true, expense: updatedExpense };
		} catch (error) {
			console.error('editExpenseItem error:', error);
			return fail(500, {
				form,
				error: 'Failed to update expense. Please try again.',
			});
		}
	}),

	deleteExpenseItem: withAuth(async ({ wedding, plannerDb }, { request }) => {
		const data = await request.formData();
		const expenseId = data.get('id') as string;

		if (!expenseId) {
			return fail(400, { error: 'Missing expense ID' });
		}

		try {
			const deletedExpense = await plannerDb
				.deleteFrom('expense_items')
				.where('id', '=', expenseId)
				.where('weddingId', '=', wedding.id)
				.returningAll()
				.executeTakeFirst();

			if (!deletedExpense) {
				return fail(404, { error: 'Expense not found' });
			}

			return { success: true };
		} catch (error) {
			console.error('deleteExpenseItem error:', error);
			return fail(500, {
				error: 'Failed to delete expense. Please try again.',
			});
		}
	}),
};
