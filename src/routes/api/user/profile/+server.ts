import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const PATCH: RequestHandler = async ({ request, locals, plannerDb }) => {
  if (!locals.user) {
    return json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const userId = locals.user.id;
  const data: {
    userName: string;
    userEmail: string;
    userAvatarUrl?: string;
  } = await request.json();

  try {
    await plannerDb
      .updateTable("user")
      .set({
        name: data.userName,
        email: data.userEmail,
        image: data.userAvatarUrl || null,
        updatedAt: Date.now(),
      })
      .where("id", "=", userId)
      .execute();

    return json({ success: true });
  } catch (error) {
    console.error("Profile update error:", error);
    return json(
      { success: false, message: "Failed to update profile" },
      { status: 500 }
    );
  }
};
