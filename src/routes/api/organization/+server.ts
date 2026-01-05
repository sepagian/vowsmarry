import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { getAuth } from "$lib/server/auth";

export const GET: RequestHandler = async ({ locals, platform, request }) => {
  if (!locals.user || !locals.session) {
    return json(null);
  }

  if (!locals.activeWorkspaceId || !platform) {
    return json(null);
  }

  try {
    const auth = getAuth(platform.env.vowsmarry);

    const organization = await auth.api.getFullOrganization({
      headers: request.headers,
      query: {
        organizationId: locals.activeWorkspaceId,
      },
    });

    if (!organization) {
      return json(null);
    }

    const invitations = await auth.api.listInvitations({
      headers: request.headers,
      query: {
        organizationId: locals.activeWorkspaceId,
      },
    });

    return json({
      organization: {
        ...organization,
        weddingBudget: organization.weddingBudget,
      },
      invitations: invitations || [],
    });
  } catch (err) {
    console.error("Failed to load organization data:", err);
    return json(null);
  }
};
