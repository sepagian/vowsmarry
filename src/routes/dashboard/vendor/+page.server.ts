import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { vendorSchema, type VendorData } from '$lib/validation/planner';
import type { Category, VendorStatus, VendorRating } from '$lib/types';

export const load: PageServerLoad = async ({ locals: { supabase }, plannerDb, depends }) => {
	depends('vendor:list');
	const vendorForm = await superValidate(valibot(vendorSchema));

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

	const vendorList = await plannerDb
		.selectFrom('vendors')
		.selectAll()
		.where('weddingId', '=', wedding.id)
		.orderBy('vendorName', 'asc')
		.execute();

	const vendorStats = {
		total: vendorList.length,
		researching: vendorList.filter((vendor) => vendor.vendorStatus === 'researching').length,
		contacted: vendorList.filter((vendor) => vendor.vendorStatus === 'contacted').length,
		quoted: vendorList.filter((vendor) => vendor.vendorStatus === 'quoted').length,
		booked: vendorList.filter((vendor) => vendor.vendorStatus === 'booked').length,
	};

	const [researching, contacted, quoted, booked] = await Promise.all([
		plannerDb
			.selectFrom('vendors')
			.select('createdAt as updatedAt')
			.where('weddingId', '=', wedding.id)
			.where('vendorStatus', '=', 'researching')
			.executeTakeFirst()
			.then((result) => result?.updatedAt ?? null),

		plannerDb
			.selectFrom('vendors')
			.select('createdAt as updatedAt')
			.where('weddingId', '=', wedding.id)
			.where('vendorStatus', '=', 'contacted')
			.executeTakeFirst()
			.then((result) => result?.updatedAt ?? null),

		plannerDb
			.selectFrom('vendors')
			.select('createdAt as updatedAt')
			.where('weddingId', '=', wedding.id)
			.where('vendorStatus', '=', 'quoted')
			.executeTakeFirst()
			.then((result) => result?.updatedAt ?? null),

		plannerDb
			.selectFrom('vendors')
			.select('createdAt as updatedAt')
			.where('weddingId', '=', wedding.id)
			.where('vendorStatus', '=', 'booked')
			.executeTakeFirst()
			.then((result) => result?.updatedAt ?? null),
	]);

	return {
		vendorForm,
		vendors: vendorList,
		vendorStats,
		update: { researching, contacted, quoted, booked },
	};
};

export const actions: Actions = {
	createVendor: async ({ request, locals: { supabase }, plannerDb }) => {
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

		const form = await superValidate(request, valibot(vendorSchema));
		if (!form.valid) return fail(400, { form });

		const { vendorName, vendorCategory, vendorInstagram, vendorStatus, vendorRating } =
			form.data as VendorData;

		try {
			const newVendor = await plannerDb
				.insertInto('vendors')
				.values({
					id: crypto.randomUUID(),
					weddingId: wedding.id,
					vendorName,
					vendorCategory,
					vendorInstagram,
					vendorEmail: null,
					vendorPhone: null,
					vendorWebsite: null,
					vendorStatus,
					vendorRating,
					vendorTotalCost: null,
					createdAt: new Date(),
					updatedAt: new Date(),
				})
				.returningAll()
				.executeTakeFirstOrThrow();

			return { form, success: true, vendor: newVendor };
		} catch (error) {
			return fail(500, {
				form,
				error: 'Failed to add new vendor. Please try again.',
			});
		}
	},

	editVendor: async ({ request, locals: { supabase }, plannerDb }) => {
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
				.updateTable('vendors')
				.set({
					vendorName,
					vendorCategory,
					vendorInstagram,
					vendorStatus,
					vendorRating,
					updatedAt: new Date(),
				})
				.where('id', '=', vendorId)
				.where('weddingId', '=', wedding.id)
				.returningAll()
				.executeTakeFirst();

			if (!updatedVendor) {
				return fail(404, { error: 'Vendor not found' });
			}

			return { success: true, vendor: updatedVendor };
		} catch (error) {
			console.error('Vendor update error:', error);
			return fail(500, {
				error: 'Failed to update vendor. Please try again.',
			});
		}
	},

	deleteVendor: async ({ request, locals: { supabase }, plannerDb }) => {
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
		const vendorId = data.get('id') as string;

		try {
			const deletedVendor = await plannerDb
				.deleteFrom('vendors')
				.where('id', '=', vendorId)
				.where('weddingId', '=', wedding.id)
				.returningAll()
				.executeTakeFirst();

			if (!deletedVendor) {
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

	updateStatus: async ({ request, locals: { supabase }, plannerDb }) => {
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
		const vendorId = data.get('id') as string;
		const newStatus = data.get('status') as VendorStatus;

		try {
			const updatedVendor = await plannerDb
				.updateTable('vendors')
				.set({
					vendorStatus: newStatus,
					updatedAt: new Date(),
				})
				.where('id', '=', vendorId)
				.where('weddingId', '=', wedding.id)
				.returningAll()
				.executeTakeFirst();

			if (!updatedVendor) {
				return fail(404, { error: 'Vendor not found' });
			}

			return { success: true, vendor: updatedVendor };
		} catch (error) {
			console.error('Status update error:', error);
			return fail(500, {
				error: 'Failed to update vendor status.',
			});
		}
	},
};
