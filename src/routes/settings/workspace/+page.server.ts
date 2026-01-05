import { error, fail } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { valibot } from "sveltekit-superforms/adapters";

import { BETTER_AUTH_URL } from "$env/static/private";

import { getAuth } from "$lib/server/auth";
import { sendEmail } from "$lib/server/email";
import { constructInvitationURL } from "$lib/server/url-utils";
import {
  inviteSchema,
  weddingDetailsSchema,
  workspaceInfoSchema,
} from "$lib/validation/workspace";
import {
  RATE_LIMIT_CONFIGS,
  createRateLimiter,
} from "$lib/server/rate-limiter";
import {
  AuditAction,
  AuditResourceType,
  AuditLogger,
  createAuditLogger,
} from "$lib/server/audit-logger";

import type { Actions, PageServerLoad } from "./$types";

/**
 * Load workspace data including organization details, members, and pending invitations
 */
export const load: PageServerLoad = async ({
  locals,
  platform,
  request,
  plannerDb,
}) => {
  const { session, user, activeWorkspaceId } = locals;

  if (!session) {
    throw error(401, "Authentication required");
  }

  if (!user) {
    throw error(401, "User not found");
  }

  if (!activeWorkspaceId) {
    throw error(403, "No active workspace");
  }

  if (!platform) {
    throw error(500, "Platform not available");
  }

  const auth = getAuth(platform.env.vowsmarry);

  try {
    // Get workspace from database
    const workspace = await plannerDb
      .selectFrom("organization")
      .selectAll()
      .where("id", "=", activeWorkspaceId)
      .executeTakeFirst();

    if (!workspace) {
      throw error(403, "Active workspace not found");
    }

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

    // Initialize workspace info form with current data from workspace
    const workspaceInfoForm = await superValidate(
      {
        workspaceName: workspace.name || "",
        slug: workspace.slug || "",
        groomName: workspace.groomName || "",
        brideName: workspace.brideName || "",
      },
      valibot(workspaceInfoSchema),
    );

    const weddingDetailsForm = await superValidate(
      {
        weddingDate: workspace.weddingDate || "",
        weddingVenue: workspace.weddingVenue || "",
        weddingBudget: workspace.weddingBudget ?? undefined,
      },
      valibot(weddingDetailsSchema),
    );

    return {
      organization,
      invitations: invitations || [],
      inviteForm,
      workspaceInfoForm,
      workspace: {
        id: workspace.id,
        groomName: workspace.groomName || null,
        brideName: workspace.brideName || null,
        weddingDate: workspace.weddingDate || null,
        weddingVenue: workspace.weddingVenue || null,
        weddingBudget: workspace.weddingBudget ?? null,
      },
      weddingDetailsForm,
    };
  } catch (err) {
    console.error("Failed to load workspace data:", err);
    throw error(500, "Failed to load workspace data");
  }
};

export const actions: Actions = {
  /**
   * Update workspace information (name, slug, couple names)
   */
  updateWorkspaceInfo: async ({
    request,
    locals,
    platform,
  }: Parameters<Actions["updateWorkspaceInfo"]>[0]) => {
    const { session, user, activeWorkspaceId } = locals;

    if (!session) {
      return fail(401, { message: "Authentication required" });
    }

    if (!user) {
      return fail(401, { message: "User not found" });
    }

    if (!activeWorkspaceId) {
      return fail(403, { message: "No active workspace" });
    }

    const form = await superValidate(request, valibot(workspaceInfoSchema));

    if (!platform) {
      return fail(500, { form, message: "Platform not available" });
    }

    if (!form.valid) {
      return fail(400, { form });
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
        message: "Workspace information updated successfully",
      };
    } catch (err) {
      console.error("Failed to update workspace info:", err);

      const errorMessage = err instanceof Error ? err.message : String(err);

      if (
        errorMessage.includes("slug") ||
        errorMessage.includes("UNIQUE constraint")
      ) {
        return fail(400, {
          form,
          message: "This slug is already taken. Please choose a different one.",
        });
      }

      return fail(500, {
        form,
        message: "Failed to update workspace information",
      });
    }
  },

  /**
   * Update wedding details (date, venue, and budget)
   */
  updateWeddingDetails: async ({ request, locals, platform }) => {
    const { session, user, activeWorkspaceId } = locals;

    if (!session) {
      return fail(401, { message: "Authentication required" });
    }

    if (!user) {
      return fail(401, { message: "User not found" });
    }

    if (!activeWorkspaceId) {
      return fail(403, { message: "No active workspace" });
    }

    const form = await superValidate(request, valibot(weddingDetailsSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    if (!platform) {
      return fail(500, { form, message: "Platform not available" });
    }

    const auth = getAuth(platform.env.vowsmarry);

    try {
      // Prepare update data
      const updateData: {
        weddingDate: string;
        weddingVenue: string;
        weddingBudget?: number;
      } = {
        weddingDate: form.data.weddingDate,
        weddingVenue: form.data.weddingVenue,
      };

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
        message: "Wedding details updated successfully",
      };
    } catch (err) {
      console.error("Failed to update wedding details:", err);

      return fail(500, {
        form,
        message: "Failed to update wedding details",
      });
    }
  },

  /**
   * Invite a partner to the workspace with admin role (co-owner equivalent)
   */
  inviteMember: async ({ request, locals, platform, plannerDb }) => {
    const requestHeaders = request.headers;
    const { session, user, activeWorkspaceId } = locals;

    if (!session) {
      return fail(401, { message: "Authentication required" });
    }

    if (!user) {
      return fail(401, { message: "User not found" });
    }

    if (!activeWorkspaceId) {
      return fail(403, { message: "No active workspace" });
    }

    const form = await superValidate(request, valibot(inviteSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    if (!platform) {
      return fail(500, { form, message: "Platform not available" });
    }

    if (!plannerDb) {
      return fail(500, { form, message: "Database not available" });
    }

    // Check rate limit for inviting members
    const limiter = createRateLimiter(plannerDb);
    const rateLimitResult = await limiter.checkLimit(
      user.id,
      activeWorkspaceId,
      RATE_LIMIT_CONFIGS.INVITE_EMAIL,
    );

    if (!rateLimitResult.allowed) {
      const retryAfterSeconds = Math.ceil(
        (rateLimitResult.retryAfterMs || 0) / 1000,
      );
      return fail(429, {
        form,
        message: `Too many invitations sent. Please try again in ${retryAfterSeconds} seconds.`,
        retryAfter: retryAfterSeconds,
      });
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
          message: "Organization not found",
        });
      }

      // Create invitation in Better Auth
      const invitation = await auth.api.createInvitation({
        body: {
          email: form.data.partnerEmail,
          role: "admin",
          organizationId: activeWorkspaceId,
        },
        headers: request.headers,
      });

      // Send invitation email using unified email service
      try {
        const invitationUrl = constructInvitationURL(
          BETTER_AUTH_URL,
          invitation.id,
        );
        await sendEmail({
          type: "invitation",
          to: form.data.partnerEmail,
          baseUrl: BETTER_AUTH_URL,
          inviterName: user.name || "A user",
          organizationName: organization.name,
          invitationUrl,
          invitationId: invitation.id,
        });
      } catch (emailErr) {
        console.error("Failed to send invitation email:", emailErr);
        // Don't fail the whole operation if email fails
        // The invitation is still created in the database
      }

      // Log successful invitation
      if (plannerDb) {
        const auditLog = createAuditLogger(plannerDb);
        auditLog.logAsync({
          organizationId: activeWorkspaceId,
          userId: user.id,
          actionType: AuditAction.MEMBER_INVITED,
          resourceType: AuditResourceType.INVITATION,
          resourceId: invitation.id,
          description: `Member invited: ${form.data.partnerEmail}`,
          changes: {
            invitedEmail: form.data.partnerEmail,
            invitationId: invitation.id,
            role: "admin",
            timestamp: new Date().toISOString(),
          },
          ipAddress: AuditLogger.extractIpAddress(requestHeaders) ?? undefined,
          userAgent: AuditLogger.extractUserAgent(requestHeaders) ?? undefined,
          status: "success",
        });
      }

      return {
        form,
        success: true,
        message: "Invitation sent successfully",
      };
    } catch (err) {
      console.error("Failed to invite member:", err);

      const errorMessage = err instanceof Error ? err.message : String(err);

      // Log failed invitation attempt
      if (plannerDb && activeWorkspaceId) {
        const auditLog = createAuditLogger(plannerDb);
        auditLog.logAsync({
          organizationId: activeWorkspaceId,
          userId: user.id,
          actionType: AuditAction.MEMBER_INVITED,
          resourceType: AuditResourceType.INVITATION,
          description: `Failed to invite member: ${form.data.partnerEmail}`,
          changes: {
            attemptedEmail: form.data.partnerEmail,
            timestamp: new Date().toISOString(),
          },
          ipAddress: AuditLogger.extractIpAddress(requestHeaders) ?? undefined,
          userAgent: AuditLogger.extractUserAgent(requestHeaders) ?? undefined,
          status: "failure",
          errorMessage: errorMessage,
        });
      }

      // Handle duplicate invitation (UNIQUE constraint on email per organization)
      if (
        errorMessage.includes("already") ||
        errorMessage.includes("UNIQUE constraint failed") ||
        errorMessage.includes("invitation.email")
      ) {
        return fail(400, {
          form,
          message: "This user is already a member or has a pending invitation",
        });
      }

      return fail(500, {
        form,
        message: "Failed to send invitation",
      });
    }
  },

  /**
   * Leave the current workspace
   */
  leaveWorkspace: async ({ request, locals, platform }) => {
    const { session, user, activeWorkspaceId } = locals;

    if (!session) {
      return fail(401, { message: "Authentication required" });
    }

    if (!user) {
      return fail(401, { message: "User not found" });
    }

    if (!activeWorkspaceId) {
      return fail(403, { message: "No active workspace" });
    }

    if (!platform) {
      return fail(500, { message: "Platform not available" });
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

      return {
        success: true,
        message: "Successfully left workspace",
        redirect: "/onboarding",
      };
    } catch (err) {
      console.error("Failed to leave workspace:", err);

      const errorMessage = err instanceof Error ? err.message : String(err);

      if (errorMessage.includes("owner")) {
        return fail(400, {
          message:
            "Cannot leave workspace as the only owner. Transfer ownership first.",
        });
      }

      return fail(500, {
        message: "Failed to leave workspace",
      });
    }
  },

  /**
   * Remove a member from the workspace (owner only)
   */
  removeMember: async ({ request, locals, platform, plannerDb }) => {
    const { session, user, activeWorkspaceId } = locals;

    if (!session) {
      return fail(401, { message: "Authentication required" });
    }

    if (!user) {
      return fail(401, { message: "User not found" });
    }

    if (!activeWorkspaceId) {
      return fail(403, { message: "No active workspace" });
    }

    const formData = await request.formData();
    const memberId = (formData.get("memberId") as string)?.trim();

    if (!memberId) {
      return fail(400, { message: "Member ID is required" });
    }

    if (!platform) {
      return fail(500, { message: "Platform not available" });
    }

    const auth = getAuth(platform.env.vowsmarry);

    try {
      // Get the organization to verify current user permissions and member existence
      const organization = await auth.api.getFullOrganization({
        headers: request.headers,
        query: {
          organizationId: activeWorkspaceId,
        },
      });

      if (!organization) {
        return fail(403, { message: "Workspace not found" });
      }

      // Verify current user is an owner
      const currentUserMember = organization.members?.find(
        (m: any) => m.userId === user.id,
      );

      if (!currentUserMember) {
        return fail(403, {
          message: "You are not a member of this workspace",
        });
      }

      if (currentUserMember.role !== "owner") {
        return fail(403, {
          message: "You do not have permission to remove members",
        });
      }

      // Verify the member being removed exists in the organization
      const memberToRemove = organization.members?.find(
        (m: any) => m.userId === memberId,
      );

      if (!memberToRemove) {
        return fail(404, {
          message: "Member not found in this workspace",
        });
      }

      // Prevent user from removing themselves
      if (memberId === user.id) {
        return fail(400, {
          message:
            "You cannot remove yourself from the workspace. Use 'Leave Workspace' instead.",
        });
      }

      // Prevent removal of the last owner
      const ownerCount =
        organization.members?.filter((m: any) => m.role === "owner").length ||
        0;

      if (memberToRemove.role === "owner" && ownerCount === 1) {
        return fail(400, {
          message: "Cannot remove the last owner",
        });
      }

      // Remove the member using Better Auth
      await auth.api.removeMember({
        body: {
          memberIdOrEmail: memberId,
          organizationId: activeWorkspaceId,
        },
        headers: request.headers,
      });

      // Log successful member removal
      if (plannerDb) {
        const auditLog = createAuditLogger(plannerDb);
        auditLog.logAsync({
          organizationId: activeWorkspaceId,
          userId: user.id,
          actionType: AuditAction.MEMBER_REMOVED,
          resourceType: AuditResourceType.MEMBER,
          resourceId: memberId,
          description: `Member ${memberId} removed from workspace`,
          changes: {
            memberIdRemoved: memberId,
            timestamp: new Date().toISOString(),
          },
          ipAddress: AuditLogger.extractIpAddress(request.headers) ?? undefined,
          userAgent: AuditLogger.extractUserAgent(request.headers) ?? undefined,
          status: "success",
        });
      }

      return {
        success: true,
        message: "Member removed successfully",
      };
    } catch (err) {
      console.error("Failed to remove member:", err);

      const errorMessage = err instanceof Error ? err.message : String(err);

      // Log failed member removal attempt
      if (plannerDb) {
        const auditLog = createAuditLogger(plannerDb);
        auditLog.logAsync({
          organizationId: activeWorkspaceId,
          userId: user.id,
          actionType: AuditAction.MEMBER_REMOVED,
          resourceType: AuditResourceType.MEMBER,
          resourceId: memberId,
          description: `Failed to remove member ${memberId}`,
          ipAddress: AuditLogger.extractIpAddress(request.headers) ?? undefined,
          userAgent: AuditLogger.extractUserAgent(request.headers) ?? undefined,
          status: "failure",
          errorMessage: errorMessage,
        });
      }

      if (errorMessage.includes("permission")) {
        return fail(403, {
          message: "You do not have permission to remove members",
        });
      }

      if (errorMessage.includes("owner")) {
        return fail(400, {
          message: "Cannot remove the last owner",
        });
      }

      return fail(500, {
        message: "Failed to remove member",
      });
    }
  },

  /**
   * Resend an invitation email
   */
  resendInvitation: async ({ request, locals, platform, plannerDb }) => {
    const { session, user, activeWorkspaceId } = locals;
    const requestHeaders = request.headers;

    if (!session) {
      return fail(401, { message: "Authentication required" });
    }

    if (!user) {
      return fail(401, { message: "User not found" });
    }

    if (!activeWorkspaceId) {
      return fail(403, { message: "No active workspace" });
    }

    const formData = await request.formData();
    const invitationId = (formData.get("invitationId") as string)?.trim();

    if (!invitationId) {
      return fail(400, { message: "Invitation ID is required" });
    }

    if (!platform) {
      return fail(500, { message: "Platform not available" });
    }

    if (!plannerDb) {
      return fail(500, { message: "Database not available" });
    }

    // Check rate limit for resending invitations
    const limiter = createRateLimiter(plannerDb);
    const rateLimitResult = await limiter.checkLimit(
      user.id,
      invitationId,
      RATE_LIMIT_CONFIGS.RESEND_INVITATION,
    );

    if (!rateLimitResult.allowed) {
      const retryAfterSeconds = Math.ceil(
        (rateLimitResult.retryAfterMs || 0) / 1000,
      );
      return fail(429, {
        message: `Too many resend attempts. Please try again in ${retryAfterSeconds} seconds.`,
        retryAfter: retryAfterSeconds,
      });
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
        return fail(404, { message: "Invitation not found" });
      }

      if (invitation.status !== "pending") {
        return fail(400, { message: "Can only resend pending invitations" });
      }

      // Get organization details
      const organization = await auth.api.getFullOrganization({
        headers: request.headers,
        query: {
          organizationId: activeWorkspaceId,
        },
      });

      if (!organization) {
        return fail(500, { message: "Organization not found" });
      }

      // Resend invitation email using unified email service
      try {
        const invitationUrl = constructInvitationURL(
          BETTER_AUTH_URL,
          invitation.id,
        );
        await sendEmail({
          type: "invitation",
          to: invitation.email,
          baseUrl: BETTER_AUTH_URL,
          inviterName: user.name || "A user",
          organizationName: organization.name,
          invitationUrl,
          invitationId: invitation.id,
        });

        // Log successful invitation resend
        if (plannerDb) {
          const auditLog = createAuditLogger(plannerDb);
          auditLog.logAsync({
            organizationId: activeWorkspaceId,
            userId: user.id,
            actionType: AuditAction.INVITATION_RESENT,
            resourceType: AuditResourceType.INVITATION,
            resourceId: invitationId,
            description: `Invitation resent to: ${invitation.email}`,
            changes: {
              invitationId: invitationId,
              recipientEmail: invitation.email,
              timestamp: new Date().toISOString(),
            },
            ipAddress:
              AuditLogger.extractIpAddress(requestHeaders) ?? undefined,
            userAgent:
              AuditLogger.extractUserAgent(requestHeaders) ?? undefined,
            status: "success",
          });
        }

        return {
          success: true,
          message: "Invitation email resent successfully",
        };
      } catch (emailErr) {
        console.error("Failed to resend invitation email:", emailErr);

        // Log failed invitation resend
        if (plannerDb) {
          const auditLog = createAuditLogger(plannerDb);
          auditLog.logAsync({
            organizationId: activeWorkspaceId,
            userId: user.id,
            actionType: AuditAction.INVITATION_RESENT,
            resourceType: AuditResourceType.INVITATION,
            resourceId: invitationId,
            description: `Failed to resend invitation to: ${invitation.email}`,
            ipAddress:
              AuditLogger.extractIpAddress(requestHeaders) ?? undefined,
            userAgent:
              AuditLogger.extractUserAgent(requestHeaders) ?? undefined,
            status: "failure",
            errorMessage: String(emailErr),
          });
        }

        return fail(500, {
          message: "Failed to send invitation email",
        });
      }
    } catch (err) {
      console.error("Failed to resend invitation:", err);

      // Log failed invitation lookup
      if (plannerDb) {
        const auditLog = createAuditLogger(plannerDb);
        auditLog.logAsync({
          organizationId: activeWorkspaceId,
          userId: user.id,
          actionType: AuditAction.INVITATION_RESENT,
          resourceType: AuditResourceType.INVITATION,
          resourceId: invitationId,
          description: `Failed to resend invitation (lookup error)`,
          ipAddress: AuditLogger.extractIpAddress(requestHeaders) ?? undefined,
          userAgent: AuditLogger.extractUserAgent(requestHeaders) ?? undefined,
          status: "failure",
          errorMessage: err instanceof Error ? err.message : String(err),
        });
      }

      return fail(500, {
        message: "Failed to resend invitation",
      });
    }
  },

  /**
   * Cancel a pending invitation
   */
  cancelInvitation: async ({ request, locals, platform, plannerDb }) => {
    const { session, user, activeWorkspaceId } = locals;
    const requestHeaders = request.headers;

    if (!session) {
      return fail(401, { message: "Authentication required" });
    }

    if (!user) {
      return fail(403, { message: "User not found" });
    }

    if (!activeWorkspaceId) {
      return fail(403, { message: "No active workspace" });
    }

    const formData = await request.formData();
    const invitationId = formData.get("invitationId") as string;

    if (!invitationId) {
      return fail(400, { message: "Invitation ID is required" });
    }

    if (!platform) {
      return fail(500, { message: "Platform not available" });
    }

    const auth = getAuth(platform.env.vowsmarry);

    try {
      await auth.api.cancelInvitation({
        body: {
          invitationId,
        },
        headers: request.headers,
      });

      // Log successful invitation cancellation
      if (plannerDb && user) {
        const auditLog = createAuditLogger(plannerDb);
        auditLog.logAsync({
          organizationId: activeWorkspaceId,
          userId: user.id,
          actionType: AuditAction.INVITATION_CANCELLED,
          resourceType: AuditResourceType.INVITATION,
          resourceId: invitationId,
          description: `Invitation cancelled: ${invitationId}`,
          changes: {
            invitationId: invitationId,
            timestamp: new Date().toISOString(),
          },
          ipAddress: AuditLogger.extractIpAddress(requestHeaders) ?? undefined,
          userAgent: AuditLogger.extractUserAgent(requestHeaders) ?? undefined,
          status: "success",
        });
      }

      return {
        success: true,
        message: "Invitation cancelled successfully",
      };
    } catch (err) {
      console.error("Failed to cancel invitation:", err);

      // Log failed invitation cancellation
      if (plannerDb && user) {
        const auditLog = createAuditLogger(plannerDb);
        auditLog.logAsync({
          organizationId: activeWorkspaceId,
          userId: user.id,
          actionType: AuditAction.INVITATION_CANCELLED,
          resourceType: AuditResourceType.INVITATION,
          resourceId: invitationId,
          description: `Failed to cancel invitation: ${invitationId}`,
          ipAddress: AuditLogger.extractIpAddress(requestHeaders) ?? undefined,
          userAgent: AuditLogger.extractUserAgent(requestHeaders) ?? undefined,
          status: "failure",
          errorMessage: err instanceof Error ? err.message : String(err),
        });
      }

      return fail(500, {
        message: "Failed to cancel invitation",
      });
    }
  },
};
