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

  const data: { invitationId: string } = await request.json();
  const auth = getAuth(platform.env.vowsmarry);

  try {
    await (auth.api as any).cancelInvitation({
      body: {
        invitationId: data.invitationId,
      },
      headers: request.headers,
    });

    return json({ success: true });
  } catch (err) {
    console.error("Failed to cancel invitation:", err);
    return json(
      { success: false, message: "Failed to cancel invitation" },
      { status: 500 }
    );
  }
};
