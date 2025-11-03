import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { expenseFormSchema } from '$lib/validation/index';
import { plannerDb } from '$lib/server/db';
import { expenseItems, weddings, expenseCategories } from '$lib/server/db/schema/planner';
import { eq, and } from 'drizzle-orm';
import type { ExpenseStatus } from '$lib/types';

export const load: PageServerLoad = async () => {
	const expenseForm = await superValidate(zod4(expenseFormSchema as any));
	return { expenseForm };
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
};
