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

  const data: { memberId: string } = await request.json();
  const auth = getAuth(platform.env.vowsmarry);

  try {
    await (auth.api as any).removeMember({
      body: {
        memberIdOrEmail: data.memberId,
        organizationId: locals.activeWorkspaceId,
      },
      headers: request.headers,
    });

    return json({ success: true });
  } catch (err) {
    console.error("Failed to remove member:", err);
    const message = err instanceof Error ? err.message : String(err);

    if (message.includes("permission")) {
      return json(
        {
          success: false,
          message: "You do not have permission to remove members",
        },
        { status: 403 }
      );
    }

    if (message.includes("owner")) {
      return json(
        { success: false, message: "Cannot remove the last owner" },
        { status: 400 }
      );
    }

    return json(
      { success: false, message: "Failed to remove member" },
      { status: 500 }
    );
  }
};
