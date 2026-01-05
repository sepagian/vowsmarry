import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ locals, plannerDb }) => {
  if (!locals.user) {
    return json([]);
  }

  const userId = locals.user.id;

  const sessions = await plannerDb
    .selectFrom("session")
    .select(["id", "createdAt", "ipAddress", "userAgent", "expiresAt"])
    .where("userId", "=", userId)
    .orderBy("createdAt", "desc")
    .execute();

  return json(
    sessions.map((s) => ({
      id: s.id,
      createdAt: s.createdAt,
      ipAddress: s.ipAddress,
      userAgent: s.userAgent,
      expiresAt: s.expiresAt,
    }))
  );
};

export const DELETE: RequestHandler = async ({
  request,
  locals,
  plannerDb,
}) => {
  if (!locals.user) {
    return json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const data: { sessionId: string } = await request.json();
  const sessionId = data.sessionId;

  if (!sessionId) {
    return json(
      { success: false, message: "Session ID is required" },
      { status: 400 }
    );
  }

  try {
    const [sessionToDelete] = await plannerDb
      .selectFrom("session")
      .selectAll()
      .where("id", "=", sessionId)
      .limit(1)
      .execute();

    if (!sessionToDelete || sessionToDelete.userId !== locals.user.id) {
      return json(
        { success: false, message: "Unauthorized to delete this session" },
        { status: 403 }
      );
    }

    await plannerDb.deleteFrom("session").where("id", "=", sessionId).execute();

    return json({ success: true });
  } catch (error) {
    console.error("Session deletion error:", error);
    return json(
      { success: false, message: "Failed to delete session" },
      { status: 500 }
    );
  }
};
