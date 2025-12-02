import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { weddingSchema } from '$lib/validation/planner';
import { workspaceSchema, inviteSchema } from '$lib/validation/workspace';
import { getUser } from '$lib/server/auth-helpers';
import { parseUserName } from '$lib/utils/user-utils';
import { getAuth } from '$lib/server/auth';

export const load: PageServerLoad = async ({ locals, depends }) => {
	depends('dashboard:data');
	const weddingForm = await superValidate(valibot(weddingSchema));
	const workspaceForm = await superValidate(valibot(workspaceSchema));
	const inviteForm = await superValidate(valibot(inviteSchema));
	const user = await getUser(locals.user);

	const { firstName, lastName } = parseUserName(user.name);

	return {
		user: {
			id: user.id,
			email: user.email || '',
			firstName,
			lastName,
		},
		weddingForm,
		workspaceForm,
		inviteForm,
	};
};

/**
 * Generate a URL-safe slug from couple names and wedding date
 * @param groomName - Groom's name
 * @param brideName - Bride's name
 * @param weddingDate - Wedding date in ISO format
 * @returns URL-safe slug
 */
function generateSlug(groomName: string, brideName: string, weddingDate: string): string {
	// Extract first names (before any spaces)
	const groomFirstName = groomName.split(' ')[0].toLowerCase();
	const brideFirstName = brideName.split(' ')[0].toLowerCase();
	
	// Extract year from wedding date
	const year = weddingDate.split('-')[0];
	
	// Combine and sanitize
	const slug = `${groomFirstName}-${brideFirstName}-${year}`
		.replace(/[^a-z0-9-]/g, '-') // Replace non-alphanumeric with hyphens
		.replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
		.replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
	
	return slug;
}

export const actions: Actions = {
	/**
	 * Store wedding data temporarily (step 2)
	 * This data will be used later when creating the workspace organization
	 */
	createWeddingData: async ({ request, locals, plannerDb }) => {
		const form = await superValidate(request, valibot(weddingSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const user = await getUser(locals.user);

		try {
			// Check if wedding already exists
			const existingWedding = await plannerDb
				.selectFrom('weddings')
				.selectAll()
				.where('userId', '=', user.id)
				.executeTakeFirst();

			const now = Date.now();

			if (existingWedding) {
				// Update existing wedding
				await plannerDb
					.updateTable('weddings')
					.set({
						groomName: form.data.groomName,
						brideName: form.data.brideName,
						weddingDate: form.data.weddingDate,
						weddingVenue: form.data.weddingVenue,
						weddingBudget: form.data.weddingBudget,
						updatedAt: now,
					})
					.where('userId', '=', user.id)
					.execute();
			} else {
				// Create new wedding
				await plannerDb
					.insertInto('weddings')
					.values({
						id: crypto.randomUUID(),
						userId: user.id,
						groomName: form.data.groomName,
						brideName: form.data.brideName,
						weddingDate: form.data.weddingDate,
						weddingVenue: form.data.weddingVenue,
						weddingBudget: form.data.weddingBudget,
						createdAt: now,
						updatedAt: now,
					})
					.execute();
			}

			return { form, success: true };
		} catch (error) {
			console.error('Error creating wedding data:', error);
			return fail(500, { form });
		}
	},

	/**
	 * Create workspace organization with wedding metadata (step 3)
	 * Uses the wedding data stored in step 2 to populate organization metadata
	 */
	createWorkspace: async ({ request, platform, locals, plannerDb }) => {
		const workspaceForm = await superValidate(request, valibot(workspaceSchema));

		if (!workspaceForm.valid) {
			return fail(400, { form: workspaceForm });
		}

		if (!platform?.env?.vowsmarry) {
			return fail(500, {
				form: workspaceForm,
				message: 'Database connection not available.',
			});
		}

		const auth = getAuth(platform.env.vowsmarry);
		const user = await getUser(locals.user);

		try {
			// Get the wedding data for this user (created in step 2)
			const wedding = await plannerDb
				.selectFrom('weddings')
				.selectAll()
				.where('userId', '=', user.id)
				.executeTakeFirst();

			if (!wedding) {
				return fail(400, {
					form: workspaceForm,
					message: 'Wedding data not found. Please complete step 2 first.',
				});
			}

			// Generate slug from couple names and wedding date if not provided
			let slug = workspaceForm.data.slug;
			if (!slug) {
				slug = generateSlug(
					wedding.groomName ?? 'groom',
					wedding.brideName ?? 'bride',
					wedding.weddingDate ?? new Date().toISOString().split('T')[0]
				);
			}

			// Validate slug uniqueness by querying the organization table directly
			const existingOrg = await plannerDb
				.selectFrom('organization')
				.select('id')
				.where('slug', '=', slug)
				.executeTakeFirst();

			if (existingOrg) {
				return fail(400, {
					form: workspaceForm,
					message: 'This slug is already taken. Please choose a different one.',
				});
			}

			// Create organization with only name and slug
			const organization = await auth.api.createOrganization({
				body: {
					name: workspaceForm.data.workspaceName,
					slug: slug,
				},
				headers: request.headers,
			});

			if (!organization) {
				return fail(500, {
					form: workspaceForm,
					message: 'Failed to create workspace. Please try again.',
				});
			}

			// Set the newly created organization as active
			await auth.api.setActiveOrganization({
				body: {
					organizationId: organization.id,
				},
				headers: request.headers,
			});

			return { form: workspaceForm, organizationId: organization.id, success: true };
		} catch (error) {
			console.error('Error creating workspace:', error);
			return fail(500, {
				form: workspaceForm,
				message: 'An error occurred while creating your workspace.',
			});
		}
	},

	/**
	 * Invite partner to the wedding workspace with admin role
	 */
	invitePartner: async ({ request, platform, locals }) => {
		const form = await superValidate(request, valibot(inviteSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		if (!platform?.env?.vowsmarry) {
			return fail(500, {
				form,
				message: 'Database connection not available.',
			});
		}

		const auth = getAuth(platform.env.vowsmarry);

		try {
			// Get the active organization ID from locals
			const activeWorkspaceId = locals.activeWorkspaceId;

			if (!activeWorkspaceId) {
				return fail(400, {
					form,
					message: 'No active workspace found. Please complete the workspace setup first.',
				});
			}

			// Invite partner with admin role (co-owner equivalent) using Better Auth API
			await auth.api.createInvitation({
				body: {
					email: form.data.partnerEmail,
					role: 'admin',
					organizationId: activeWorkspaceId,
				},
				headers: request.headers,
			});

			return { form, success: true };
		} catch (error) {
			console.error('Error inviting partner:', error);
			return fail(500, {
				form,
				message: 'Failed to send invitation. Please try again.',
			});
		}
	},
};
