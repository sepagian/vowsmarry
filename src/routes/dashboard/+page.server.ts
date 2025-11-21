import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import {
	expenseSchema,
	weddingSchema,
	type WeddingData,
	type ExpenseData,
} from '$lib/validation/planner';
import type { ExpenseStatus } from '$lib/types';

export const load: PageServerLoad = async ({ locals: { supabase }, plannerDb, depends }) => {
	depends('dashboard:data');
	const expenseForm = await superValidate(valibot(expenseSchema));
	const weddingForm = await superValidate(valibot(weddingSchema));

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
			user: {
				id: user.id,
				email: user.email,
				firstName: user.user_metadata?.first_name,
				lastName: user.user_metadata?.last_name,
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
			firstName: user.user_metadata?.first_name || '',
			lastName: user.user_metadata?.last_name || '',
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
	createWeddingData: async ({ request, locals: { supabase }, plannerDb }) => {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) return fail(401, { error: 'Unauthorized' });

		const form = await superValidate(request, valibot(weddingSchema));
		if (!form.valid) return fail(400, { form });

		try {
			const existingWedding = await plannerDb
				.selectFrom('weddings')
				.selectAll()
				.where('userId', '=', user.id)
				.executeTakeFirst();

			if (existingWedding) {
				return fail(400, {
					form,
					error: 'Wedding data already exists. Please update instead.',
				});
			}

			const { groomName, brideName, weddingVenue, weddingDate, weddingBudget } =
				form.data as WeddingData;

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
					createdAt: new Date(),
					updatedAt: new Date(),
				})
				.returningAll()
				.executeTakeFirstOrThrow();

			return { form, success: true, wedding: newWedding };
		} catch {
			return fail(500, {
				form,
				error: 'Failed to create wedding data. Please try again.',
			});
		}
	},

	updateWeddingData: async ({ request, locals: { supabase }, plannerDb }) => {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) return fail(401, { error: 'Unauthorized' });

		const wedding = await plannerDb
			.selectFrom('weddings')
			.selectAll()
			.where('userId', '=', user.id)
			.executeTakeFirst();

		if (!wedding) return fail(403, { error: 'No wedding data found' });

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
					updatedAt: new Date(),
				})
				.where('id', '=', wedding.id)
				.returningAll()
				.executeTakeFirstOrThrow();

			return { form, success: true, wedding: updatedWedding };
		} catch {
			return fail(500, {
				form,
				error: 'Failed to update wedding data. Please try again.',
			});
		}
	},

	createExpenseItem: async ({ request, locals: { supabase }, plannerDb }) => {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) return fail(401, { error: 'Unauthorized' });

		const wedding = await plannerDb
			.selectFrom('weddings')
			.selectAll()
			.where('userId', '=', user.id)
			.executeTakeFirst();

		if (!wedding) return fail(403, { error: 'No wedding data found' });

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
					createdAt: new Date(),
					updatedAt: new Date(),
				})
				.returningAll()
				.executeTakeFirstOrThrow();

			return { form, success: true, expense: newExpense };
		} catch {
			return fail(500, {
				form,
				error: 'Failed to create new expense. Please try again.',
			});
		}
	},

	editExpenseItem: async ({ request, locals: { supabase }, plannerDb }) => {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) return fail(401, { error: 'Unauthorized' });

		const wedding = await plannerDb
			.selectFrom('weddings')
			.selectAll()
			.where('userId', '=', user.id)
			.executeTakeFirst();

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
				.updateTable('expense_items')
				.set({
					weddingId: wedding.id,
					expenseDescription,
					expenseCategory,
					expenseAmount: expenseAmount,
					expensePaymentStatus,
					expenseDueDate,
					updatedAt: new Date(),
				})
				.where('id', '=', expenseId)
				.where('weddingId', '=', wedding.id)
				.returningAll()
				.executeTakeFirst();

			if (!updatedExpense) {
				return fail(404, { form, error: 'Expense not found' });
			}

			return { form, success: true, expense: updatedExpense };
		} catch {
			return fail(500, {
				form,
				error: 'Failed to update expense. Please try again.',
			});
		}
	},

	deleteExpenseItem: async ({ request, locals: { supabase }, plannerDb }) => {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) return fail(401, { error: 'Unauthorized' });

		const wedding = await plannerDb
			.selectFrom('weddings')
			.selectAll()
			.where('userId', '=', user.id)
			.executeTakeFirst();

		if (!wedding) return fail(403, { error: 'No wedding data found' });

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
		} catch {
			return fail(500, {
				error: 'Failed to delete expense. Please try again.',
			});
		}
	},

	updatePaymentStatus: async ({ request, locals: { supabase }, plannerDb }) => {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) return fail(401, { error: 'Unauthorized' });

		const wedding = await plannerDb
			.selectFrom('weddings')
			.selectAll()
			.where('userId', '=', user.id)
			.executeTakeFirst();

		if (!wedding) return fail(403, { error: 'No wedding data found' });

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
					updatedAt: new Date(),
				})
				.where('id', '=', expenseId)
				.where('weddingId', '=', wedding.id)
				.returningAll()
				.executeTakeFirst();
			if (!updatedPaymentStatus) {
				return fail(404, { error: 'Expense not found' });
			}

			return { success: true, task: updatedPaymentStatus };
		} catch {
			return fail(500, {
				error: 'Failed to update payment status.',
			});
		}
	},
};
