import { fail } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { valibot } from "sveltekit-superforms/adapters";

import { BETTER_AUTH_URL } from "$env/static/private";

import { getAuth } from "$lib/server/auth";
import { getUser } from "$lib/server/auth-helpers";
import { sendEmail } from "$lib/server/email";
import { parseUserName } from "$lib/utils/user-utils";
import { weddingSchema } from "$lib/validation/planner";
import { inviteSchema, workspaceSchema } from "$lib/validation/workspace";

import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, depends }) => {
  depends("dashboard:data");
  const weddingForm = await superValidate(valibot(weddingSchema));
  const workspaceForm = await superValidate(valibot(workspaceSchema));
  const inviteForm = await superValidate(valibot(inviteSchema));
  const user = await getUser(locals.user);

  const { firstName, lastName } = parseUserName(user.name);

  return {
    user: {
      id: user.id,
      email: user.email || "",
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
function generateSlug(
  groomName: string,
  brideName: string,
  weddingDate: string,
): string {
  // Extract first names (before any spaces)
  const groomFirstName = groomName.split(" ")[0].toLowerCase();
  const brideFirstName = brideName.split(" ")[0].toLowerCase();

  // Extract year from wedding date
  const year = weddingDate.split("-")[0];

  // Combine and sanitize
  const slug = `${groomFirstName}-${brideFirstName}-${year}`
    .replace(/[^a-z0-9-]/g, "-") // Replace non-alphanumeric with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens

  return slug;
}

export const actions: Actions = {
  createWeddingOrganization: async ({ request, platform }) => {
    // Validate wedding form only
    const formData = await request.formData();
    const weddingForm = await superValidate(formData, valibot(weddingSchema));
    if (!weddingForm.valid) {
      return fail(400, { form: weddingForm });
    }

    if (!platform?.env?.vowsmarry) {
      return fail(500, {
        form: weddingForm,
        message: "Database connection not available.",
      });
    }

    const auth = getAuth(platform.env.vowsmarry);

    // Generate temporary name and slug
    const tempName = `Wedding of ${weddingForm.data.groomName} & ${weddingForm.data.brideName}`;
    const tempSlug = generateSlug(
      weddingForm.data.groomName,
      weddingForm.data.brideName,
      weddingForm.data.weddingDate,
    );
    // Create organization with wedding data
    const organization = await auth.api.createOrganization({
      body: {
        name: tempName,
        slug: tempSlug,
        groomName: weddingForm.data.groomName,
        brideName: weddingForm.data.brideName,
        weddingDate: weddingForm.data.weddingDate,
        weddingVenue: weddingForm.data.weddingVenue,
        weddingBudget: weddingForm.data.weddingBudget.toString(),
      },
      headers: request.headers,
    });

    if (!organization) {
      return fail(500, {
        form: weddingForm,
        message: "Failed to save wedding information. Please try again.",
      });
    }

    // Set as active organization
    await auth.api.setActiveOrganization({
      body: { organizationId: organization.id },
      headers: request.headers,
    });
    return { weddingForm, organizationId: organization.id, success: true };
  },
  /**
   * Create workspace organization with wedding data (combined step 2 & 3)
   * Creates organization with wedding metadata directly
   */
  updateOrganizationWorkspace: async ({
    request,
    platform,
    plannerDb,
    locals,
  }) => {
    // Parse both forms from the request
    const formData = await request.formData();
    const workspaceForm = await superValidate(
      formData,
      valibot(workspaceSchema),
    );

    const activeWorkspaceId = locals.activeWorkspaceId;

    if (!workspaceForm.valid) {
      return fail(400, { form: workspaceForm });
    }

    if (!platform?.env?.vowsmarry) {
      return fail(500, {
        form: workspaceForm,
        message: "Database connection not available.",
      });
    }

    try {
      const existingOrg = await plannerDb
        .selectFrom("organization")
        .select("id")
        .where("slug", "=", workspaceForm.data.slug)
        .where("id", "!=", activeWorkspaceId)
        .executeTakeFirst();

      if (existingOrg) {
        return fail(400, {
          form: workspaceForm,
          message: "This slug is already taken. Please choose a different one.",
        });
      }

      await plannerDb
        .updateTable("organization")
        .set({
          name: workspaceForm.data.workspaceName,
          slug: workspaceForm.data.slug,
        })
        .where("id", "=", activeWorkspaceId)
        .execute();
      // Set the newly created organization as active

      return {
        workspaceForm,
        success: true,
      };
    } catch (error) {
      console.error("Error creating workspace:", error);
      return fail(500, {
        form: workspaceForm,
        message: "An error occurred while creating your workspace.",
      });
    }
  },

  /**
   * Invite partner to the wedding workspace with admin role
   */
  invitePartner: async ({ request, platform, locals }) => {
    const { user } = locals;

    if (!user) {
      return fail(401, {
        message: "Authentication required",
      });
    }

    const form = await superValidate(request, valibot(inviteSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    if (!platform?.env?.vowsmarry) {
      return fail(500, {
        form,
        message: "Database connection not available.",
      });
    }

    const auth = getAuth(platform.env.vowsmarry);

    try {
      // Get the active organization ID from locals
      const activeWorkspaceId = locals.activeWorkspaceId;

      if (!activeWorkspaceId) {
        return fail(400, {
          form,
          message:
            "No active workspace found. Please complete the workspace setup first.",
        });
      }

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
        const invitationUrl = `${BETTER_AUTH_URL}/accept-invitation/${invitation.id}`;
        await sendEmail({
          type: "invitation",
          to: form.data.partnerEmail,
          inviterName: user.name || "A user",
          organizationName: organization.name,
          invitationUrl,
          invitationId: invitation.id,
        });
      } catch (emailErr) {
        console.error("Failed to send invitation email:", emailErr);
        // Don't fail the whole operation if email fails
      }

      return { form, success: true };
    } catch (error) {
      console.error("Error inviting partner:", error);
      return fail(500, {
        form,
        message: "Failed to send invitation. Please try again.",
      });
    }
  },
};
