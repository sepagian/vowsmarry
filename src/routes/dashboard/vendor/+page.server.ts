import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { plannerDb } from '$lib/server/db';
import { vendors, weddings } from '$lib/server/db/schema/planner';
import { eq, count, and } from 'drizzle-orm';
import { vendorFormSchema } from '$lib/validation/index';
import type { Category, VendorStatus, VendorRating } from '$lib/types';

export const load: PageServerLoad = async ({ locals: { supabase }, depends }) => {
	depends('vendor:list');
	const vendorForm = await superValidate(zod4(vendorFormSchema as any));

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
			vendorForm,
			stats: {
				researchingCount: 0,
				contactedCount: 0,
				quotedCount: 0,
				bookedCount: 0,
			},
			update: {
				researching: null,
				contacted: null,
				quoted: null,
				booked: null,
			},
			vendors: [],
		};
	}

	const [researchingCount, contactedCount, quotedCount, bookedCount, vendorList] =
		await Promise.all([
			plannerDb
				.select({ count: count() })
				.from(vendors)
				.where(and(eq(vendors.weddingId, wedding.id), eq(vendors.status, 'researching')))
				.then((result) => result[0]?.count ?? '0'),

			plannerDb
				.select({ count: count() })
				.from(vendors)
				.where(and(eq(vendors.weddingId, wedding.id), eq(vendors.status, 'contacted')))
				.then((result) => result[0]?.count ?? '0'),

			plannerDb
				.select({ count: count() })
				.from(vendors)
				.where(and(eq(vendors.weddingId, wedding.id), eq(vendors.status, 'quoted')))
				.then((result) => result[0]?.count ?? '0'),

			plannerDb
				.select({ count: count() })
				.from(vendors)
				.where(and(eq(vendors.weddingId, wedding.id), eq(vendors.status, 'booked')))
				.then((result) => result[0]?.count ?? '0'),

			plannerDb.query.vendors.findMany({
				where: eq(vendors.weddingId, wedding.id),
				orderBy: (vendors, { asc }) => [asc(vendors.name)],
			}),
		]);

	const [researching, contacted, quoted, booked] = await Promise.all([
		plannerDb
			.select({ updatedAt: vendors.createdAt })
			.from(vendors)
			.where(and(eq(vendors.weddingId, wedding.id), eq(vendors.status, 'researching')))
			.then((result) => result[0]?.updatedAt ?? null),

		plannerDb
			.select({ updatedAt: vendors.createdAt })
			.from(vendors)
			.where(and(eq(vendors.weddingId, wedding.id), eq(vendors.status, 'contacted')))
			.then((result) => result[0]?.updatedAt ?? null),

		plannerDb
			.select({ updatedAt: vendors.createdAt })
			.from(vendors)
			.where(and(eq(vendors.weddingId, wedding.id), eq(vendors.status, 'quoted')))
			.then((result) => result[0]?.updatedAt ?? null),

		plannerDb
			.select({ updatedAt: vendors.createdAt })
			.from(vendors)
			.where(and(eq(vendors.weddingId, wedding.id), eq(vendors.status, 'booked')))
			.then((result) => result[0]?.updatedAt ?? null),
	]);

	return {
		vendorForm,
		vendors: vendorList,
		stats: { researchingCount, contactedCount, quotedCount, bookedCount },
		update: { researching, contacted, quoted, booked },
	};
};

export const actions: Actions = {
	createVendor: async ({ request, locals: { supabase } }) => {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) return fail(401, { error: 'Unauthorized' });

		const wedding = await plannerDb.query.weddings.findFirst({
			where: eq(weddings.userId, user.id),
		});

		if (!wedding) return fail(403, { error: 'No wedding data found' });

		const form = await superValidate(request, zod4(vendorFormSchema as any));
		if (!form.valid) return fail(400, { form });

		const { name, category, instagram, status, rating } = form.data as any;

		try {
			const newVendor = await plannerDb
				.insert(vendors)
				.values({
					weddingId: wedding.id,
					name,
					category,
					instagram,
					status,
					rating,
				})
				.returning();

			return { form, success: true, vendor: newVendor[0] };
		} catch (error) {
			return fail(500, {
				form,
				error: 'Failed to add new vendor. Please try again.',
			});
		}
	},

	editVendor: async ({ request, locals: { supabase } }) => {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) return fail(401, { error: 'Unauthorized' });

		const wedding = await plannerDb.query.weddings.findFirst({
			where: eq(weddings.userId, user.id),
		});

		if (!wedding) return fail(403, { error: 'No wedding data found' });

		const data = await request.formData();
		const vendorId = data.get('id') as string;
		const name = data.get('name') as string;
		const category = data.get('category') as Category;
		const instagram = data.get('instagram') as string;
		const status = data.get('status') as VendorStatus;
		const rating = data.get('rating') as VendorRating;

		try {
			const updatedVendor = await plannerDb
				.update(vendors)
				.set({
					name,
					category: category as Category,
					instagram,
					status: status as VendorStatus,
					rating: rating as VendorRating,
					updatedAt: new Date(),
				})
				.where(and(eq(vendors.id, vendorId), eq(vendors.weddingId, wedding.id)))
				.returning();

			if (updatedVendor.length === 0) {
				return fail(404, { error: 'Vendor not found' });
			}

			return { success: true, vendor: updatedVendor[0] };
		} catch (error) {
			console.error('Vendor update error:', error);
			return fail(500, {
				error: 'Failed to update vendor. Please try again.',
			});
		}
	},

	deleteVendor: async ({ request, locals: { supabase } }) => {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) return fail(401, { error: 'Unauthorized' });

		const wedding = await plannerDb.query.weddings.findFirst({
			where: eq(weddings.userId, user.id),
		});

		if (!wedding) return fail(403, { error: 'No wedding data found' });

		const data = await request.formData();
		const vendorId = data.get('id') as string;

		try {
			const deletedVendor = await plannerDb
				.delete(vendors)
				.where(and(eq(vendors.id, vendorId), eq(vendors.weddingId, wedding.id)))
				.returning();

			if (deletedVendor.length === 0) {
				return fail(404, { error: 'Vendor not found' });
			}

			return { success: true };
		} catch (error) {
			console.error('Vendor deletion error:', error);
			return fail(500, {
				error: 'Failed to delete vendor. Please try again.',
			});
		}
	},

	updateStatus: async ({ request, locals: { supabase } }) => {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) return fail(401, { error: 'Unauthorized' });

		const wedding = await plannerDb.query.weddings.findFirst({
			where: eq(weddings.userId, user.id),
		});

		if (!wedding) return fail(403, { error: 'No wedding data found' });

		const data = await request.formData();
		const vendorId = data.get('id') as string;
		const newStatus = data.get('status') as VendorStatus;

		try {
			const updatedVendor = await plannerDb
				.update(vendors)
				.set({
					status: newStatus,
					updatedAt: new Date(),
				})
				.where(and(eq(vendors.id, vendorId), eq(vendors.weddingId, wedding.id)))
				.returning();

			if (updatedVendor.length === 0) {
				return fail(404, { error: 'Task not found' });
			}

			return { success: true, vendor: updatedVendor[0] };
		} catch (error) {
			console.error('Status update error:', error);
			return fail(500, {
				error: 'Failed to update task status.',
			});
		}
	},
};
