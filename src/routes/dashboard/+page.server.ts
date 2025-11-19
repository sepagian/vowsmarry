import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { plannerDb } from '$lib/server/db';
import { tasks, expenseItems, documents, vendors, weddings } from '$lib/server/db/schema/planner';
import { eq, count, sum, and, desc } from 'drizzle-orm';
import {
	expenseSchema,
	weddingSchema,
	type WeddingData,
	type ExpenseData,
} from '$lib/validation/planner';
import type { ExpenseStatus } from '$lib/types';

export const load: PageServerLoad = async ({ locals: { supabase }, depends }) => {
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

	const wedding = await plannerDb.query.weddings.findFirst({
		where: eq(weddings.userId, user.id),
	});

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
				.select({ count: count() })
				.from(tasks)
				.where(eq(tasks.weddingId, wedding.id))
				.then((result) => result[0]?.count ?? 0),

			plannerDb
				.select({ total: sum(expenseItems.expenseAmount) })
				.from(expenseItems)
				.where(
					and(
						eq(expenseItems.weddingId, wedding.id),
						eq(expenseItems.expensePaymentStatus, 'paid'),
					),
				)
				.then((result) => result[0]?.total ?? '0'),

			plannerDb
				.select({ count: count() })
				.from(documents)
				.where(eq(documents.weddingId, wedding.id))
				.then((result) => result[0]?.count ?? 0),

			plannerDb
				.select({ count: count() })
				.from(vendors)
				.where(eq(vendors.weddingId, wedding.id))
				.then((result) => result[0]?.count ?? 0),

			plannerDb.query.expenseItems.findMany({
				where: eq(expenseItems.weddingId, wedding.id),
				orderBy: (expenseItems, { desc }) => [desc(expenseItems.expenseDueDate)],
			}),
		],
	);

	const [taskUpdate, expenseUpdate, documentUpdate, vendorUpdate] = await Promise.all([
		plannerDb
			.select({ updatedAt: tasks.updatedAt })
			.from(tasks)
			.where(eq(tasks.weddingId, wedding.id))
			.orderBy(desc(tasks.updatedAt))
			.limit(1)
			.then((result) => result[0]?.updatedAt || null),

		plannerDb
			.select({ updatedAt: expenseItems.updatedAt })
			.from(expenseItems)
			.where(eq(expenseItems.weddingId, wedding.id))
			.orderBy(desc(expenseItems.updatedAt))
			.limit(1)
			.then((result) => result[0]?.updatedAt || null),

		plannerDb
			.select({ updatedAt: documents.updatedAt })
			.from(documents)
			.where(eq(documents.weddingId, wedding.id))
			.orderBy(desc(documents.updatedAt))
			.limit(1)
			.then((result) => result[0]?.updatedAt || null),

		plannerDb
			.select({ updatedAt: vendors.updatedAt })
			.from(vendors)
			.where(eq(vendors.weddingId, wedding.id))
			.orderBy(desc(vendors.updatedAt))
			.limit(1)
			.then((result) => result[0]?.updatedAt || null),
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
	createWeddingData: async ({ request, locals: { supabase } }) => {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) return fail(401, { error: 'Unauthorized' });

		const form = await superValidate(request, valibot(weddingSchema));
		if (!form.valid) return fail(400, { form });

		try {
			const existingWedding = await plannerDb.query.weddings.findFirst({
				where: eq(weddings.userId, user.id),
			});

			if (existingWedding) {
				return fail(400, {
					form,
					error: 'Wedding data already exists. Please update instead.',
				});
			}

			const { groomName, brideName, weddingVenue, weddingDate, weddingBudget } =
				form.data as WeddingData;

			const [newWedding] = await plannerDb
				.insert(weddings)
				.values({
					userId: user.id,
					groomName,
					brideName,
					weddingVenue,
					weddingDate,
					weddingBudget: weddingBudget.toString(),
				})
				.returning();

			return { form, success: true, wedding: newWedding };
		} catch (error) {
			return fail(500, {
				form,
				error: 'Failed to create wedding data. Please try again.',
			});
		}
	},

	updateWeddingData: async ({ request, locals: { supabase } }) => {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) return fail(401, { error: 'Unauthorized' });

		const wedding = await plannerDb.query.weddings.findFirst({
			where: eq(weddings.userId, user.id),
		});

		if (!wedding) return fail(403, { error: 'No wedding data found' });

		const form = await superValidate(request, valibot(weddingSchema));
		if (!form.valid) return fail(400, { form });

		const { groomName, brideName, weddingDate, weddingVenue, weddingBudget } =
			form.data as WeddingData;

		try {
			const [updatedWedding] = await plannerDb
				.update(weddings)
				.set({
					groomName,
					brideName,
					weddingDate,
					weddingVenue,
					weddingBudget: weddingBudget.toString(),
					updatedAt: new Date(),
				})
				.where(eq(weddings.id, wedding.id))
				.returning();

			return { form, success: true, wedding: updatedWedding };
		} catch (error) {
			return fail(500, {
				form,
				error: 'Failed to update wedding data. Please try again.',
			});
		}
	},

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

		const {
			expenseDescription,
			expenseCategory,
			expenseAmount,
			expensePaymentStatus,
			expenseDueDate,
		} = form.data as ExpenseData;
		try {
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
					weddingId: wedding.id,
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
};
