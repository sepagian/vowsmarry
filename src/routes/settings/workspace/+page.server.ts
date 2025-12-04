import { fail, error, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getAuth } from '$lib/server/auth';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import {
	inviteSchema,
	workspaceInfoSchema,
	weddingDetailsSchema,
} from '$lib/validation/workspace';

/**
 * Load workspace data including organization details, members, and pending invitations
 */
export const load: PageServerLoad = async ({ locals, platform, request, plannerDb }) => {
	const { session, user, activeWorkspaceId } = locals;

	// Require authentication
	if (!session || !user) {
		throw error(401, 'Authentication required');
	}

	// Require active workspace
	if (!activeWorkspaceId) {
		throw error(403, 'No active workspace');
	}

	if (!platform) {
		throw error(500, 'Platform not available');
	}

	const auth = getAuth(platform.env.vowsmarry);

	try {
		// Get full organization details with members
		const organization = await auth.api.getFullOrganization({
			headers: request.headers,
			query: {
				organizationId: activeWorkspaceId,
			},
		});

		// Get pending invitations for this organization
		const invitations = await auth.api.listInvitations({
			headers: request.headers,
			query: {
				organizationId: activeWorkspaceId,
			},
		});

		// Fetch wedding data from weddings table using userId
		const weddingData = await plannerDb
			.selectFrom('weddings')
			.selectAll()
			.where('userId', '=', user.id)
			.executeTakeFirst();

		// Debug logging
		console.log('Organization data:', {
			name: organization?.name,
			slug: organization?.slug,
			metadata: organization?.metadata,
		});
		console.log('Wedding data from DB:', weddingData);

		// Initialize forms
		const inviteForm = await superValidate(valibot(inviteSchema));

		// Initialize workspace info form with current data from weddings table
		const workspaceInfoForm = await superValidate(
			{
				workspaceName: organization?.name || '',
				slug: organization?.slug || '',
				groomName: weddingData?.groomName || '',
				brideName: weddingData?.brideName || '',
			},
			valibot(workspaceInfoSchema),
		);

		// Initialize wedding details form with current data from weddings table
		const weddingDetailsForm = await superValidate(
			{
				weddingDate: weddingData?.weddingDate || '',
				weddingVenue: weddingData?.weddingVenue || '',
			},
			valibot(weddingDetailsSchema),
		);

		console.log('Form initial values:', {
			workspaceInfo: workspaceInfoForm.data,
			weddingDetails: weddingDetailsForm.data,
		});

		return {
			organization,
			invitations: invitations || [],
			inviteForm,
			workspaceInfoForm,
			weddingDetailsForm,
			weddingData, // Include wedding data for reference
		};
	} catch (err) {
		console.error('Failed to load workspace data:', err);
		throw error(500, 'Failed to load workspace data');
	}
};

export const actions: Actions = {
	/**
	 * Update workspace information (name, slug, couple names)
	 */
	updateWorkspaceInfo: async ({ request, locals, platform, plannerDb }) => {
		const { session, user, activeWorkspaceId } = locals;

		if (!session || !user) {
			return fail(401, { message: 'Authentication required' });
		}

		if (!activeWorkspaceId) {
			return fail(403, { message: 'No active workspace' });
		}

		const form = await superValidate(request, valibot(workspaceInfoSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		if (!platform) {
			return fail(500, { form, message: 'Platform not available' });
		}

		const auth = getAuth(platform.env.vowsmarry);

		try {
			// Update organization name and slug in Better Auth
			await auth.api.updateOrganization({
				body: {
					data: {
						name: form.data.workspaceName,
						slug: form.data.slug,
					},
				},
				query: {
					organizationId: activeWorkspaceId,
				},
				headers: request.headers,
			});

			// Update couple names in weddings table
			await plannerDb
				.updateTable('weddings')
				.set({
					groomName: form.data.groomName,
					brideName: form.data.brideName,
					updatedAt: Date.now(), // Use timestamp instead of Date object
				})
				.where('userId', '=', user.id)
				.execute();

			return {
				form,
				success: true,
				message: 'Workspace information updated successfully',
			};
		} catch (err) {
			console.error('Failed to update workspace info:', err);

			const errorMessage = err instanceof Error ? err.message : String(err);

			if (errorMessage.includes('slug')) {
				return fail(400, {
					form,
					message: 'This slug is already taken. Please choose a different one.',
				});
			}

			return fail(500, {
				form,
				message: 'Failed to update workspace information',
			});
		}
	},

	/**
	 * Update wedding details (date and venue)
	 */
	updateWeddingDetails: async ({ request, locals, plannerDb }) => {
		const { session, user, activeWorkspaceId } = locals;

		if (!session || !user) {
			return fail(401, { message: 'Authentication required' });
		}

		if (!activeWorkspaceId) {
			return fail(403, { message: 'No active workspace' });
		}

		const form = await superValidate(request, valibot(weddingDetailsSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			// Update wedding details in weddings table
			await plannerDb
				.updateTable('weddings')
				.set({
					weddingDate: form.data.weddingDate,
					weddingVenue: form.data.weddingVenue,
					updatedAt: Date.now(), // Use timestamp instead of Date object
				})
				.where('userId', '=', user.id)
				.execute();

			return {
				form,
				success: true,
				message: 'Wedding details updated successfully',
			};
		} catch (err) {
			console.error('Failed to update wedding details:', err);

			return fail(500, {
				form,
				message: 'Failed to update wedding details',
			});
		}
	},

	/**
	 * Invite a partner to the workspace with admin role (co-owner equivalent)
	 */
	inviteMember: async ({ request, locals, platform }) => {
		const { session, user, activeWorkspaceId } = locals;

		if (!session || !user) {
			return fail(401, { message: 'Authentication required' });
		}

		if (!activeWorkspaceId) {
			return fail(403, { message: 'No active workspace' });
		}

		const form = await superValidate(request, valibot(inviteSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		if (!platform) {
			return fail(500, { form, message: 'Platform not available' });
		}

		const auth = getAuth(platform.env.vowsmarry);

		try {
			// Invite member with admin role (co-owner equivalent)
			await auth.api.createInvitation({
				body: {
					email: form.data.partnerEmail,
					role: 'admin',
					organizationId: activeWorkspaceId,
				},
				headers: request.headers,
			});

			return {
				form,
				success: true,
				message: 'Invitation sent successfully',
			};
		} catch (err) {
			console.error('Failed to invite member:', err);

			const errorMessage = err instanceof Error ? err.message : String(err);

			// Better Auth automatically prevents duplicate invitations
			if (errorMessage.includes('already')) {
				return fail(400, {
					form,
					message: 'This user is already a member or has a pending invitation',
				});
			}

			return fail(500, {
				form,
				message: 'Failed to send invitation',
			});
		}
	},

	/**
	 * Leave the current workspace
	 */
	leaveWorkspace: async ({ request, locals, platform }) => {
		const { session, user, activeWorkspaceId } = locals;

		if (!session || !user) {
			return fail(401, { message: 'Authentication required' });
		}

		if (!activeWorkspaceId) {
			return fail(403, { message: 'No active workspace' });
		}

		if (!platform) {
			return fail(500, { message: 'Platform not available' });
		}

		const auth = getAuth(platform.env.vowsmarry);

		try {
			// Better Auth handles ownership transfer and prevents owner from leaving without other admin
			await auth.api.leaveOrganization({
				body: {
					organizationId: activeWorkspaceId,
				},
				headers: request.headers,
			});

			return {
				success: true,
				message: 'Successfully left workspace',
			};
		} catch (err) {
			console.error('Failed to leave workspace:', err);

			const errorMessage = err instanceof Error ? err.message : String(err);

			if (errorMessage.includes('owner')) {
				return fail(400, {
					message: 'Cannot leave workspace as the only owner. Transfer ownership first.',
				});
			}

			return fail(500, {
				message: 'Failed to leave workspace',
			});
		}
	},

	/**
	 * Remove a member from the workspace (owner only)
	 */
	removeMember: async ({ request, locals, platform }) => {
		const { session, user, activeWorkspaceId } = locals;

		if (!session || !user) {
			return fail(401, { message: 'Authentication required' });
		}

		if (!activeWorkspaceId) {
			return fail(403, { message: 'No active workspace' });
		}

		const formData = await request.formData();
		const memberIdOrEmail = formData.get('memberIdOrEmail') as string;

		if (!memberIdOrEmail) {
			return fail(400, { message: 'Member ID or email is required' });
		}

		if (!platform) {
			return fail(500, { message: 'Platform not available' });
		}

		const auth = getAuth(platform.env.vowsmarry);

		try {
			// Better Auth handles role checks and prevents removal of last owner
			await auth.api.removeMember({
				body: {
					memberIdOrEmail,
					organizationId: activeWorkspaceId,
				},
				headers: request.headers,
			});

			return {
				success: true,
				message: 'Member removed successfully',
			};
		} catch (err) {
			console.error('Failed to remove member:', err);

			const errorMessage = err instanceof Error ? err.message : String(err);

			if (errorMessage.includes('permission')) {
				return fail(403, {
					message: 'You do not have permission to remove members',
				});
			}

			if (errorMessage.includes('owner')) {
				return fail(400, {
					message: 'Cannot remove the last owner',
				});
			}

			return fail(500, {
				message: 'Failed to remove member',
			});
		}
	},

	/**
	 * Cancel a pending invitation
	 */
	cancelInvitation: async ({ request, locals, platform }) => {
		const { session, user, activeWorkspaceId } = locals;

		if (!session || !user) {
			return fail(401, { message: 'Authentication required' });
		}

		if (!activeWorkspaceId) {
			return fail(403, { message: 'No active workspace' });
		}

		const formData = await request.formData();
		const invitationId = formData.get('invitationId') as string;

		if (!invitationId) {
			return fail(400, { message: 'Invitation ID is required' });
		}

		if (!platform) {
			return fail(500, { message: 'Platform not available' });
		}

		const auth = getAuth(platform.env.vowsmarry);

		try {
			// Cancel the invitation by rejecting it
			await auth.api.rejectInvitation({
				body: {
					invitationId,
				},
				headers: request.headers,
			});

			return {
				success: true,
				message: 'Invitation cancelled successfully',
			};
		} catch (err) {
			console.error('Failed to cancel invitation:', err);

			return fail(500, {
				message: 'Failed to cancel invitation',
			});
		}
	},
};
