import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { vendorSchema, type VendorData } from '$lib/validation/planner';
import type { Category, VendorStatus, VendorRating } from '$lib/types';
import { withAuth } from '$lib/server/auth-helpers';

export const load: PageServerLoad = async ({ locals, plannerDb, depends }) => {
	depends('vendor:list');
	const vendorForm = await superValidate(valibot(vendorSchema));

	const { user, activeWorkspaceId } = locals;

	if (!user) redirect(302, '/login');
	if (!activeWorkspaceId) redirect(302, '/onboarding');

	const vendorList = await plannerDb
		.selectFrom('vendors')
		.selectAll()
		.where('organizationId', '=', activeWorkspaceId)
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
			.where('organizationId', '=', activeWorkspaceId)
			.where('vendorStatus', '=', 'researching')
			.executeTakeFirst()
			.then((result) => result?.updatedAt ?? null),

		plannerDb
			.selectFrom('vendors')
			.select('createdAt as updatedAt')
			.where('organizationId', '=', activeWorkspaceId)
			.where('vendorStatus', '=', 'contacted')
			.executeTakeFirst()
			.then((result) => result?.updatedAt ?? null),

		plannerDb
			.selectFrom('vendors')
			.select('createdAt as updatedAt')
			.where('organizationId', '=', activeWorkspaceId)
			.where('vendorStatus', '=', 'quoted')
			.executeTakeFirst()
			.then((result) => result?.updatedAt ?? null),

		plannerDb
			.selectFrom('vendors')
			.select('createdAt as updatedAt')
			.where('organizationId', '=', activeWorkspaceId)
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
	createVendor: withAuth(async ({ organizationId, plannerDb }, { request }) => {
		const form = await superValidate(request, valibot(vendorSchema));
		if (!form.valid) return fail(400, { form });

		const { vendorName, vendorCategory, vendorInstagram, vendorStatus, vendorRating } =
			form.data as VendorData;

		try {
			const newVendor = await plannerDb
				.insertInto('vendors')
				.values({
					id: crypto.randomUUID(),
					organizationId,
					vendorName,
					vendorCategory,
					vendorInstagram,
					vendorEmail: null,
					vendorPhone: null,
					vendorWebsite: null,
					vendorStatus,
					vendorRating,
					vendorTotalCost: null,
					createdAt: Date.now(),
					updatedAt: Date.now(),
				})
				.returningAll()
				.executeTakeFirstOrThrow();

			return { form, success: true, vendor: newVendor };
		} catch (error) {
			console.error('Vendor creation error:', error);
			return fail(500, {
				form,
				error: 'Failed to add new vendor. Please try again.',
			});
		}
	}),

	updateVendor: withAuth(async ({ organizationId, plannerDb }, { request }) => {
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
					updatedAt: Date.now(),
				})
				.where('id', '=', vendorId)
				.where('organizationId', '=', organizationId)
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
	}),

	deleteVendor: withAuth(async ({ organizationId, plannerDb }, { request }) => {
		const data = await request.formData();
		const vendorId = data.get('id') as string;

		try {
			const deletedVendor = await plannerDb
				.deleteFrom('vendors')
				.where('id', '=', vendorId)
				.where('organizationId', '=', organizationId)
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
	}),

	updateVendorStatus: withAuth(async ({ organizationId, plannerDb }, { request }) => {
		const data = await request.formData();
		const vendorId = data.get('id') as string;
		const newStatus = data.get('status') as VendorStatus;

		try {
			const updatedVendor = await plannerDb
				.updateTable('vendors')
				.set({
					vendorStatus: newStatus,
					updatedAt: Date.now(),
				})
				.where('id', '=', vendorId)
				.where('organizationId', '=', organizationId)
				.returningAll()
				.executeTakeFirst();

			if (!updatedVendor) {
				return fail(404, { error: 'Vendor not found' });
			}

			return { success: true, vendor: updatedVendor };
		} catch (error) {
			console.error('Vendor status update error:', error);
			return fail(500, {
				error: 'Failed to update vendor status.',
			});
		}
	}),
};
