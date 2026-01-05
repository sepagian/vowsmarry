import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { getAuth } from "$lib/server/auth";

export const POST: RequestHandler = async ({ request, locals, platform }) => {
  if (!locals.user || !locals.session) {
    return json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  if (!locals.activeWorkspaceId || !platform) {
    return json(
      { success: false, message: "No active workspace" },
      { status: 403 }
    );
  }

  const auth = getAuth(platform.env.vowsmarry);

  try {
    await (auth.api as any).leaveOrganization({
      body: {
        organizationId: locals.activeWorkspaceId,
      },
      headers: request.headers,
    });

    return json({ success: true, redirect: "/onboarding" });
  } catch (err) {
    console.error("Failed to leave workspace:", err);
    const message = err instanceof Error ? err.message : String(err);

    if (message.includes("owner")) {
      return json(
        {
          success: false,
          message:
            "Cannot leave workspace as the only owner. Transfer ownership first.",
        },
        { status: 400 }
      );
    }

    return json(
      { success: false, message: "Failed to leave workspace" },
      { status: 500 }
    );
  }
};
