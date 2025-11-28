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
import { getUser, getWedding, withAuth } from '$lib/server/auth-helpers';
import { getTableCount, getLastUpdate } from '$lib/server/db/query-helpers';
import { handleActionError } from '$lib/server/error-handler';
import { parseUserName } from '$lib/utils/user-utils';
import { TABLES } from '$lib/constants/database';
import { FormDataParser } from '$lib/utils/form-helpers';

export const load: PageServerLoad = async ({ locals, plannerDb, depends }) => {
	depends('dashboard:data');
	const expenseForm = await superValidate(valibot(expenseSchema));
	const weddingForm = await superValidate(valibot(weddingSchema));

	const user = await getUser(locals.user);
	const { firstName, lastName } = parseUserName(user.name);

	const wedding = await plannerDb
		.selectFrom(TABLES.WEDDINGS)
		.selectAll()
		.where('userId', '=', user.id)
		.executeTakeFirst();

	if (!wedding) {
		return {
			user: {
				id: user.id,
				email: user.email || '',
				firstName,
				lastName,
			},
			expenseForm,
			weddingForm,
			stats: {
				taskCount: 0,
				expensePaidAmount: 0,
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
			getTableCount(plannerDb, TABLES.TASKS, wedding.id),

			plannerDb
				.selectFrom(TABLES.EXPENSES)
				.select((eb) => eb.fn.sum<string>('expenseAmount').as('total'))
				.where('weddingId', '=', wedding.id)
				.executeTakeFirst()
				.then((result) => (result?.total ? Number(result.total) : 0)),

			getTableCount(plannerDb, TABLES.DOCUMENTS, wedding.id),
			getTableCount(plannerDb, TABLES.VENDORS, wedding.id),

			plannerDb
				.selectFrom(TABLES.EXPENSES)
				.selectAll()
				.where('weddingId', '=', wedding.id)
				.orderBy('expenseDueDate', 'desc')
				.execute(),
		],
	);

	const [taskUpdate, expenseUpdate, documentUpdate, vendorUpdate] = await Promise.all([
		getLastUpdate(plannerDb, TABLES.TASKS, wedding.id),
		getLastUpdate(plannerDb, TABLES.EXPENSES, wedding.id),
		getLastUpdate(plannerDb, TABLES.DOCUMENTS, wedding.id),
		getLastUpdate(plannerDb, TABLES.VENDORS, wedding.id),
	]);

	return {
		user: {
			id: user.id,
			email: user.email || '',
			firstName,
			lastName,
		},
		wedding,
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
				.insertInto(TABLES.WEDDINGS)
				.values({
					id: crypto.randomUUID(),
					userId: user.id,
					groomName,
					brideName,
					weddingVenue,
					weddingDate: String(weddingDate),
					weddingBudget,
					createdAt: now,
					updatedAt: now,
				})
				.returningAll()
				.executeTakeFirstOrThrow();

			return { form, success: true, wedding: newWedding };
		} catch (error) {
			return handleActionError(error, 'create wedding data', { form });
		}
	},

	updateWeddingData: withAuth(async ({ wedding, plannerDb }, { request }) => {
		const form = await superValidate(request, valibot(weddingSchema));
		if (!form.valid) return fail(400, { form });

		const { groomName, brideName, weddingDate, weddingVenue, weddingBudget } =
			form.data as WeddingData;

		try {
			const updatedWedding = await plannerDb
				.updateTable(TABLES.WEDDINGS)
				.set({
					groomName,
					brideName,
					weddingDate: String(weddingDate),
					weddingVenue,
					weddingBudget,
					updatedAt: Date.now(),
				})
				.where('id', '=', wedding.id)
				.returningAll()
				.executeTakeFirstOrThrow();

			return { form, success: true, wedding: updatedWedding };
		} catch (error) {
			return handleActionError(error, 'update wedding data', { form });
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
				.insertInto(TABLES.EXPENSES)
				.values({
					id: crypto.randomUUID(),
					weddingId: wedding.id,
					expenseDescription,
					expenseCategory,
					expenseAmount,
					expensePaymentStatus,
					expenseDueDate: String(expenseDueDate),
					createdAt: now,
					updatedAt: now,
				})
				.returningAll()
				.executeTakeFirstOrThrow();

			return { form, success: true, expense: newExpense };
		} catch (error) {
			return handleActionError(error, 'create expense', { form });
		}
	}),

	updateExpenseItem: withAuth(async ({ wedding, plannerDb }, { request }) => {
		const clonedRequest = request.clone();
		const parser = new FormDataParser(await clonedRequest.formData());
		const expenseId = parser.getString('id');

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
			const updatedExpense = await plannerDb
				.updateTable(TABLES.EXPENSES)
				.set({
					weddingId: wedding.id,
					expenseDescription,
					expenseCategory,
					expenseAmount,
					expensePaymentStatus,
					expenseDueDate: String(expenseDueDate),
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
			return handleActionError(error, 'update expense', { form });
		}
	}),

	deleteExpenseItem: withAuth(async ({ wedding, plannerDb }, { request }) => {
		try {
			const parser = new FormDataParser(await request.formData());
			const expenseId = parser.getString('id');

			const deletedExpense = await plannerDb
				.deleteFrom(TABLES.EXPENSES)
				.where('id', '=', expenseId)
				.where('weddingId', '=', wedding.id)
				.returningAll()
				.executeTakeFirst();

			if (!deletedExpense) {
				return fail(404, { error: 'Expense not found' });
			}

			return { success: true };
		} catch (error) {
			return handleActionError(error, 'delete expense');
		}
	}),

	updatePaymentStatus: withAuth(async ({ wedding, plannerDb }, { request }) => {
		try {
			const parser = new FormDataParser(await request.formData());
			const expenseId = parser.getString('id');
			const newPaymentStatus = parser.getEnum('paymentStatus', ['paid', 'unpaid'] as const);

			const updatedPaymentStatus = await plannerDb
				.updateTable(TABLES.EXPENSES)
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

			return { success: true, expense: updatedPaymentStatus };
		} catch (error) {
			return handleActionError(error, 'update payment status');
		}
	}),
};
