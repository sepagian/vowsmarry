import type { PageServerLoad, Actions } from './$types';
import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { plannerDb } from '$lib/server/db';
import { tasks, expenseItems, documents, vendors, weddings } from '$lib/server/db/schema/planner';
import { eq, count, sum, and } from 'drizzle-orm';
import { taskFormSchema, expenseFormSchema } from '$lib/validation/index';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const taskForm = await superValidate(zod4(taskFormSchema as any));
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
			user: {
				id: user.id,
				email: user.email,
				firstName: user.user_metadata?.first_name,
				lastName: user.user_metadata?.last_name,
			},
			taskForm,
			expenseForm,
			stats: {
				taskCount: 0,
				expensePaidAmount: '0',
				documentCount: 0,
				vendorCount: 0,
			},
			expenses: [],
		};
	}

	const [taskCount, expensePaidAmount, documentCount, vendorCount, expenseList] = await Promise.all([
		plannerDb
			.select({ count: count() })
			.from(tasks)
			.where(eq(tasks.weddingId, wedding.id))
			.then((result) => result[0]?.count ?? 0),

		plannerDb
			.select({ total: sum(expenseItems.amount) })
			.from(expenseItems)
			.where(and(eq(expenseItems.weddingId, wedding.id), eq(expenseItems.paymentStatus, 'paid')))
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
			orderBy: (expenseItems, { desc }) => [desc(expenseItems.dueDate)],
		}),
	]);

	return {
		user: {
			id: user.id,
			email: user.email || '',
			firstName: user.user_metadata?.first_name || '',
			lastName: user.user_metadata?.last_name || '',
		},
		weddings: wedding,
		taskForm,
		expenseForm,
		stats: {
			taskCount,
			expensePaidAmount,
			documentCount,
			vendorCount,
		},
		expenses: expenseList,
	};
};

export const actions: Actions = {
	default: async ({ request }) => {
		const taskForm = await superValidate(request, zod4(taskFormSchema as any));
		const expenseForm = await superValidate(request, zod4(expenseFormSchema as any));
		return { taskForm, expenseForm };
	},
};
