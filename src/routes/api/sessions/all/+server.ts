import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const DELETE: RequestHandler = async ({
  request,
  locals,
  plannerDb,
}) => {
  if (!locals.user) {
    return json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const data: { currentSessionId: string } = await request.json();
  const currentSessionId = data.currentSessionId;

  if (!currentSessionId) {
    return json(
      { success: false, message: "Current session ID is required" },
      { status: 400 }
    );
  }

  try {
    await plannerDb
      .deleteFrom("session")
      .where("userId", "=", locals.user.id)
      .where("id", "!=", currentSessionId)
      .execute();

    return json({ success: true });
  } catch (error) {
    console.error("Sessions deletion error:", error);
    return json(
      { success: false, message: "Failed to delete sessions" },
      { status: 500 }
    );
  }
};
