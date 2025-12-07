import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { expenseSchema, weddingSchema, type ExpenseData } from '$lib/validation/planner';
import { getUser, withAuth } from '$lib/server/auth-helpers';
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
	const { activeWorkspaceId, activeWorkspace } = locals;

	if (!activeWorkspaceId || !activeWorkspace) {
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
			getTableCount(plannerDb, TABLES.TASKS, activeWorkspaceId),

			plannerDb
				.selectFrom(TABLES.EXPENSES)
				.select((eb) => eb.fn.sum<string>('expenseAmount').as('total'))
				.where('organizationId', '=', activeWorkspaceId)
				.executeTakeFirst()
				.then((result) => (result?.total ? Number(result.total) : 0)),

			getTableCount(plannerDb, TABLES.DOCUMENTS, activeWorkspaceId),
			getTableCount(plannerDb, TABLES.VENDORS, activeWorkspaceId),

			plannerDb
				.selectFrom(TABLES.EXPENSES)
				.selectAll()
				.where('organizationId', '=', activeWorkspaceId)
				.orderBy('expenseDueDate', 'desc')
				.execute(),
		],
	);

	const [taskUpdate, expenseUpdate, documentUpdate, vendorUpdate] = await Promise.all([
		getLastUpdate(plannerDb, TABLES.TASKS, activeWorkspaceId),
		getLastUpdate(plannerDb, TABLES.EXPENSES, activeWorkspaceId),
		getLastUpdate(plannerDb, TABLES.DOCUMENTS, activeWorkspaceId),
		getLastUpdate(plannerDb, TABLES.VENDORS, activeWorkspaceId),
	]);

	// Get partner name from member table (other member in the organization)
	const members = await plannerDb
		.selectFrom('member')
		.innerJoin('user', 'user.id', 'member.userId')
		.select(['user.id', 'user.name'])
		.where('member.organizationId', '=', activeWorkspaceId)
		.where('user.id', '!=', user.id)
		.execute();

	return {
		user: {
			id: user.id,
			email: user.email || '',
			firstName,
			lastName,
		},
		workspace: {
			id: activeWorkspace.id,
			groomName: activeWorkspace.groomName || null,
			brideName: activeWorkspace.brideName || null,
			weddingDate: activeWorkspace.weddingDate || null,
			weddingVenue: activeWorkspace.weddingVenue || null,
			weddingBudget: activeWorkspace.weddingBudget
				? parseFloat(activeWorkspace.weddingBudget)
				: null,
		},
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
	// Wedding data is now managed through Better Auth organization API
	// Use the settings/workspace page to update organization details

	createExpenseItem: withAuth(async ({ organizationId, plannerDb }, { request }) => {
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
					organizationId,
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

	updateExpenseItem: withAuth(async ({ organizationId, plannerDb }, { request }) => {
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
					expenseDescription,
					expenseCategory,
					expenseAmount,
					expensePaymentStatus,
					expenseDueDate: String(expenseDueDate),
					updatedAt: Date.now(),
				})
				.where('id', '=', expenseId)
				.where('organizationId', '=', organizationId)
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

	deleteExpenseItem: withAuth(async ({ organizationId, plannerDb }, { request }) => {
		try {
			const parser = new FormDataParser(await request.formData());
			const expenseId = parser.getString('id');

			const deletedExpense = await plannerDb
				.deleteFrom(TABLES.EXPENSES)
				.where('id', '=', expenseId)
				.where('organizationId', '=', organizationId)
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

	updatePaymentStatus: withAuth(async ({ organizationId, plannerDb }, { request }) => {
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
				.where('organizationId', '=', organizationId)
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
