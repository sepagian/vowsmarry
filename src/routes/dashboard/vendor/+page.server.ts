import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { plannerDb } from '$lib/server/db';
import { vendors, weddings } from '$lib/server/db/schema/planner';
import { eq, and } from 'drizzle-orm';
import { vendorSchema, type VendorData } from '$lib/validation/planner';
import type { Category, VendorStatus, VendorRating } from '$lib/types';

export const load: PageServerLoad = async ({ locals: { supabase }, depends }) => {
	depends('vendor:list');
	const vendorForm = await superValidate(valibot(vendorSchema));

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
			vendorStats: {
				researching: 0,
				contacted: 0,
				quoted: 0,
				booked: 0,
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

	const vendorList = await plannerDb.query.vendors.findMany({
		where: eq(vendors.weddingId, wedding.id),
		orderBy: vendors.vendorName,
	});

	const vendorStats = {
		total: vendorList.length,
		researching: vendorList.filter((vendor) => vendor.vendorStatus === 'researching').length,
		contacted: vendorList.filter((vendor) => vendor.vendorStatus === 'contacted').length,
		quoted: vendorList.filter((vendor) => vendor.vendorStatus === 'quoted').length,
		booked: vendorList.filter((vendor) => vendor.vendorStatus === 'booked').length,
	};

	const [researching, contacted, quoted, booked] = await Promise.all([
		plannerDb
			.select({ updatedAt: vendors.createdAt })
			.from(vendors)
			.where(and(eq(vendors.weddingId, wedding.id), eq(vendors.vendorStatus, 'researching')))
			.then((result) => result[0]?.updatedAt ?? null),

		plannerDb
			.select({ updatedAt: vendors.createdAt })
			.from(vendors)
			.where(and(eq(vendors.weddingId, wedding.id), eq(vendors.vendorStatus, 'contacted')))
			.then((result) => result[0]?.updatedAt ?? null),

		plannerDb
			.select({ updatedAt: vendors.createdAt })
			.from(vendors)
			.where(and(eq(vendors.weddingId, wedding.id), eq(vendors.vendorStatus, 'quoted')))
			.then((result) => result[0]?.updatedAt ?? null),

		plannerDb
			.select({ updatedAt: vendors.createdAt })
			.from(vendors)
			.where(and(eq(vendors.weddingId, wedding.id), eq(vendors.vendorStatus, 'booked')))
			.then((result) => result[0]?.updatedAt ?? null),
	]);

	return {
		vendorForm,
		vendors: vendorList,
		vendorStats,
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

		const form = await superValidate(request, valibot(vendorSchema));
		if (!form.valid) return fail(400, { form });

		const { vendorName, vendorCategory, vendorInstagram, vendorStatus, vendorRating } =
			form.data as VendorData;

		try {
			const newVendor = await plannerDb
				.insert(vendors)
				.values({
					weddingId: wedding.id,
					vendorName,
					vendorCategory,
					vendorInstagram,
					vendorStatus,
					vendorRating,
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

		const form = await superValidate(request, valibot(vendorSchema));
		if (!form.valid) return fail(400, { form });

		const data = await request.formData();
		const vendorId = data.get('id') as string;
		const vendorName = data.get('vendorName') as string;
		const vendorCategory = data.get('vendorCategory') as Category;
		const vendorInstagram = data.get('vendorInstagram') as string;
		const vendorStatus = data.get('vendorStatus') as VendorStatus;
		const vendorRating = data.get('vendorRating') as VendorRating;

		try {
			const updatedVendor = await plannerDb
				.update(vendors)
				.set({
					vendorName,
					vendorCategory,
					vendorInstagram,
					vendorStatus,
					vendorRating,
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
					vendorStatus: newStatus,
					updatedAt: new Date(),
				})
				.where(and(eq(vendors.id, vendorId), eq(vendors.weddingId, wedding.id)))
				.returning();

			if (updatedVendor.length === 0) {
				return fail(404, { error: 'Vendor not found' });
			}

			return { success: true, vendor: updatedVendor[0] };
		} catch (error) {
			console.error('Status update error:', error);
			return fail(500, {
				error: 'Failed to update vendor status.',
			});
		}
	},
};
