import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { getAuth } from "$lib/server/auth";

export const POST: RequestHandler = async ({ request, locals, platform }) => {
  if (!locals.user) {
    return json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  if (!platform?.env?.vowsmarry) {
    return json(
      { success: false, message: "Database connection not available" },
      { status: 500 }
    );
  }

  const data: { oldPassword: string; newPassword: string } =
    await request.json();
  const auth = getAuth(platform.env.vowsmarry);

  try {
    await auth.api.changePassword({
      body: {
        newPassword: data.newPassword,
        currentPassword: data.oldPassword,
        revokeOtherSessions: false,
      },
      headers: request.headers,
    });

    return json({ success: true });
  } catch (error) {
    console.error("Password change error:", error);

    const err = error as { status?: number; message?: string };
    return json(
      { success: false, message: err.message || "Failed to change password" },
      { status: err.status || 500 }
    );
  }
};
