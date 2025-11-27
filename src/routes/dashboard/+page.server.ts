import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import {
	expenseSchema,
	weddingSchema,
	type WeddingData,
	type ExpenseData,
} from '$lib/validation/planner';
import type { ExpenseStatus } from '$lib/types';
import { getUser, getWedding, withAuth } from '$lib/server/auth-helpers';

export const load: PageServerLoad = async ({ locals, plannerDb, depends }) => {
	depends('dashboard:data');
	const expenseForm = await superValidate(valibot(expenseSchema));
	const weddingForm = await superValidate(valibot(weddingSchema));

	const user = await getUser(locals.user);

	const wedding = await plannerDb
		.selectFrom('weddings')
		.selectAll()
		.where('userId', '=', user.id)
		.executeTakeFirst();

	if (!wedding) {
		return {
			user: {
				id: user.id,
				email: user.email,
				firstName: user.name?.split(' ')[0] || '',
				lastName: user.name?.split(' ').slice(1).join(' ') || '',
			},
			expenseForm,
			weddingForm,
			stats: {
				taskCount: 0,
				expensePaidAmount: '0',
				documentCount: 0,
				vendorCount: 0,
			},
			update: {
				taskUpdate: null,
				expenseUpdate: null,
				documentUpdate: null,
				vendorUpdate: null,
			},
			expenses: [],
		};
	}

	const [taskCount, expensePaidAmount, documentCount, vendorCount, expenseList] = await Promise.all(
		[
			plannerDb
				.selectFrom('tasks')
				.select((eb) => eb.fn.countAll<number>().as('count'))
				.where('weddingId', '=', wedding.id)
				.executeTakeFirst()
				.then((result) => result?.count ?? 0),

			plannerDb
				.selectFrom('expense_items')
				.select((eb) => eb.fn.sum<number>('expenseAmount').as('total'))
				.where('weddingId', '=', wedding.id)
				.where('expensePaymentStatus', '=', 'paid')
				.executeTakeFirst()
				.then((result) => result?.total ?? 0),

			plannerDb
				.selectFrom('documents')
				.select((eb) => eb.fn.countAll<number>().as('count'))
				.where('weddingId', '=', wedding.id)
				.executeTakeFirst()
				.then((result) => result?.count ?? 0),

			plannerDb
				.selectFrom('vendors')
				.select((eb) => eb.fn.countAll<number>().as('count'))
				.where('weddingId', '=', wedding.id)
				.executeTakeFirst()
				.then((result) => result?.count ?? 0),

			plannerDb
				.selectFrom('expense_items')
				.selectAll()
				.where('weddingId', '=', wedding.id)
				.orderBy('expenseDueDate', 'desc')
				.execute(),
		],
	);

	const [taskUpdate, expenseUpdate, documentUpdate, vendorUpdate] = await Promise.all([
		plannerDb
			.selectFrom('tasks')
			.select('updatedAt')
			.where('weddingId', '=', wedding.id)
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

		plannerDb
			.selectFrom('documents')
			.select('updatedAt')
			.where('weddingId', '=', wedding.id)
			.orderBy('updatedAt', 'desc')
			.limit(1)
			.executeTakeFirst()
			.then((result) => result?.updatedAt || null),

		plannerDb
			.selectFrom('vendors')
			.select('updatedAt')
			.where('weddingId', '=', wedding.id)
			.orderBy('updatedAt', 'desc')
			.limit(1)
			.executeTakeFirst()
			.then((result) => result?.updatedAt || null),
	]);

	return {
		user: {
			id: user.id,
			email: user.email || '',
			firstName: user.name?.split(' ')[0] || '',
			lastName: user.name?.split(' ').slice(1).join(' ') || '',
		},
		wedding: wedding,
		expenseForm,
		weddingForm,
		stats: {
			taskCount,
			expensePaidAmount,
			documentCount,
			vendorCount,
		},
		update: {
			taskUpdate,
			expenseUpdate,
			documentUpdate,
			vendorUpdate,
		},
		expenses: expenseList,
	};
};

export const actions: Actions = {
	createWeddingData: async ({ request, locals, plannerDb }) => {
		const user = await getUser(locals.user);

		const form = await superValidate(request, valibot(weddingSchema));
		if (!form.valid) return fail(400, { form });

		try {
			const existingWedding = await getWedding(user.id, plannerDb);

			if (existingWedding) {
				return fail(400, {
					form,
					error: 'Wedding data already exists. Please update instead.',
				});
			}

			const { groomName, brideName, weddingVenue, weddingDate, weddingBudget } =
				form.data as WeddingData;

			const now = Date.now();
			const newWedding = await plannerDb
				.insertInto('weddings')
				.values({
					id: crypto.randomUUID(),
					userId: user.id,
					groomName,
					brideName,
					weddingVenue,
					weddingDate,
					weddingBudget: weddingBudget,
					createdAt: now,
					updatedAt: now,
				})
				.returningAll()
				.executeTakeFirstOrThrow();

			return { form, success: true, wedding: newWedding };
		} catch (error) {
			console.error('Wedding creation error:', error);
			return fail(500, {
				form,
				error: 'Failed to create wedding data. Please try again.',
			});
		}
	},

	updateWeddingData: withAuth(async ({ wedding, plannerDb }, { request }) => {
		const form = await superValidate(request, valibot(weddingSchema));
		if (!form.valid) return fail(400, { form });

		const { groomName, brideName, weddingDate, weddingVenue, weddingBudget } =
			form.data as WeddingData;

		try {
			const updatedWedding = await plannerDb
				.updateTable('weddings')
				.set({
					groomName,
					brideName,
					weddingDate,
					weddingVenue,
					weddingBudget: weddingBudget,
					updatedAt: Date.now(),
				})
				.where('id', '=', wedding.id)
				.returningAll()
				.executeTakeFirstOrThrow();

			return { form, success: true, wedding: updatedWedding };
		} catch (error) {
			console.error('Wedding update error:', error);
			return fail(500, {
				form,
				error: 'Failed to update wedding data. Please try again.',
			});
		}
	}),

	createExpenseItem: withAuth(async ({ wedding, plannerDb }, { request }) => {
		const form = await superValidate(request, valibot(expenseSchema));
		if (!form.valid) return fail(400, { form });

		const {
			expenseDescription,
			expenseCategory,
			expenseAmount,
			expensePaymentStatus,
			expenseDueDate,
		} = form.data as ExpenseData;
		try {
			const now = Date.now();
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
					createdAt: now,
					updatedAt: now,
				})
				.returningAll()
				.executeTakeFirstOrThrow();

			return { form, success: true, expense: newExpense };
		} catch (error) {
			console.error('Expense creation error:', error);
			return fail(500, {
				form,
				error: 'Failed to create new expense. Please try again.',
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
					weddingId: wedding.id,
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
			console.error('Expense update error:', error);
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
			console.error('Expense deletion error:', error);
			return fail(500, {
				error: 'Failed to delete expense. Please try again.',
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
			console.error('Payment status update error:', error);
			return fail(500, {
				error: 'Failed to update payment status.',
			});
		}
	}),
};
