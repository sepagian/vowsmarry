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

  const data: { partnerEmail: string } = await request.json();
  const auth = getAuth(platform.env.vowsmarry);

  try {
    await (auth.api as any).createInvitation({
      body: {
        email: data.partnerEmail,
        role: "admin",
        organizationId: locals.activeWorkspaceId,
      },
      headers: request.headers,
    });

    return json({ success: true });
  } catch (err) {
    console.error("Failed to invite member:", err);
    const message = err instanceof Error ? err.message : String(err);

    if (message.includes("already") || message.includes("UNIQUE constraint")) {
      return json(
        {
          success: false,
          message: "User is already a member or has a pending invitation",
        },
        { status: 400 }
      );
    }

    return json(
      { success: false, message: "Failed to send invitation" },
      { status: 500 }
    );
  }
};
