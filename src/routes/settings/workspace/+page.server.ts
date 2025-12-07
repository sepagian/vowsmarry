import { fail, error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getAuth } from '$lib/server/auth';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { inviteSchema, workspaceInfoSchema, weddingDetailsSchema } from '$lib/validation/workspace';
import { sendInvitationEmail } from '$lib/server/email/send-invitation';
import { BETTER_AUTH_URL } from '$env/static/private';

/**
 * Load workspace data including organization details, members, and pending invitations
 */
export const load: PageServerLoad = async ({ locals, platform, request }) => {
	const { session, user, activeWorkspaceId, activeWorkspace } = locals;

	// Require authentication
	if (!session || !user) {
		throw error(401, 'Authentication required');
	}

	// Require active workspace
	if (!activeWorkspaceId || !activeWorkspace) {
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

		// Initialize forms
		const inviteForm = await superValidate(valibot(inviteSchema));

		// Initialize workspace info form with current data from activeWorkspace
		const workspaceInfoForm = await superValidate(
			{
				workspaceName: activeWorkspace.name || '',
				slug: activeWorkspace.slug || '',
				groomName: activeWorkspace.groomName || '',
				brideName: activeWorkspace.brideName || '',
			},
			valibot(workspaceInfoSchema),
		);

		// Initialize wedding details form with current data from activeWorkspace
		const weddingDetailsForm = await superValidate(
			{
				weddingDate: activeWorkspace.weddingDate || '',
				weddingVenue: activeWorkspace.weddingVenue || '',
				weddingBudget: activeWorkspace.weddingBudget || '',
			},
			valibot(weddingDetailsSchema),
		);

		return {
			organization,
			invitations: invitations || [],
			inviteForm,
			workspaceInfoForm,
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
			weddingDetailsForm,
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
	updateWorkspaceInfo: async ({ request, locals, platform }) => {
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
			// Update organization with name, slug, and couple names in Better Auth
			await auth.api.updateOrganization({
				body: {
					data: {
						name: form.data.workspaceName,
						slug: form.data.slug,
						groomName: form.data.groomName,
						brideName: form.data.brideName,
					},
				},
				query: {
					organizationId: activeWorkspaceId,
				},
				headers: request.headers,
			});

			return {
				form,
				success: true,
				message: 'Workspace information updated successfully',
			};
		} catch (err) {
			console.error('Failed to update workspace info:', err);

			const errorMessage = err instanceof Error ? err.message : String(err);

			if (errorMessage.includes('slug') || errorMessage.includes('UNIQUE constraint')) {
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
	 * Update wedding details (date, venue, and budget)
	 */
	updateWeddingDetails: async ({ request, locals, platform }) => {
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

		if (!platform) {
			return fail(500, { form, message: 'Platform not available' });
		}

		const auth = getAuth(platform.env.vowsmarry);

		try {
			// Prepare update data
			const updateData: {
				weddingDate: string;
				weddingVenue: string;
				weddingBudget?: string;
			} = {
				weddingDate: form.data.weddingDate,
				weddingVenue: form.data.weddingVenue,
			};

			// Only include weddingBudget if provided
			if (form.data.weddingBudget) {
				updateData.weddingBudget = form.data.weddingBudget;
			}

			// Update wedding details in organization
			await auth.api.updateOrganization({
				body: {
					data: updateData,
				},
				query: {
					organizationId: activeWorkspaceId,
				},
				headers: request.headers,
			});

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
			// Get organization details for email
			const organization = await auth.api.getFullOrganization({
				headers: request.headers,
				query: {
					organizationId: activeWorkspaceId,
				},
			});

			if (!organization) {
				return fail(500, {
					form,
					message: 'Organization not found',
				});
			}

			// Create invitation in Better Auth
			const invitation = await auth.api.createInvitation({
				body: {
					email: form.data.partnerEmail,
					role: 'admin',
					organizationId: activeWorkspaceId,
				},
				headers: request.headers,
			});

			// Send invitation email
			try {
				await sendInvitationEmail({
					inviteeEmail: form.data.partnerEmail,
					inviterName: user.name,
					organizationName: organization.name,
					invitationId: invitation.id,
					baseUrl: BETTER_AUTH_URL,
				});
			} catch (emailErr) {
				console.error('Failed to send invitation email:', emailErr);
				// Don't fail the whole operation if email fails
				// The invitation is still created in the database
			}

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

			// Clear the active workspace from locals
			locals.activeWorkspaceId = null;
			locals.activeWorkspace = null;

			return {
				success: true,
				message: 'Successfully left workspace',
				redirect: '/onboarding',
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
	 * Resend an invitation email
	 */
	resendInvitation: async ({ request, locals, platform }) => {
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
			// Get invitation details
			const invitation = await auth.api.getInvitation({
				query: {
					id: invitationId,
				},
				headers: request.headers,
			});

			if (!invitation) {
				return fail(404, { message: 'Invitation not found' });
			}

			if (invitation.status !== 'pending') {
				return fail(400, { message: 'Can only resend pending invitations' });
			}

			// Get organization details
			const organization = await auth.api.getFullOrganization({
				headers: request.headers,
				query: {
					organizationId: activeWorkspaceId,
				},
			});

			if (!organization) {
				return fail(500, { message: 'Organization not found' });
			}

			// Resend invitation email
			try {
				await sendInvitationEmail({
					inviteeEmail: invitation.email,
					inviterName: user.name,
					organizationName: organization.name,
					invitationId: invitation.id,
					baseUrl: BETTER_AUTH_URL,
				});

				return {
					success: true,
					message: 'Invitation email resent successfully',
				};
			} catch (emailErr) {
				console.error('Failed to resend invitation email:', emailErr);
				return fail(500, {
					message: 'Failed to send invitation email',
				});
			}
		} catch (err) {
			console.error('Failed to resend invitation:', err);

			return fail(500, {
				message: 'Failed to resend invitation',
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
