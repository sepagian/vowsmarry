import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ locals, plannerDb }) => {
  const orgId = locals.activeWorkspaceId;
  if (!orgId) return json(null);

  const workspace = await plannerDb
    .selectFrom("organization")
    .selectAll()
    .where("id", "=", orgId)
    .executeTakeFirst();

  return json(workspace ?? null);
};
