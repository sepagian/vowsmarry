import { json } from "@sveltejs/kit";

import type { RequestHandler } from "./$types";
import type { Vendor } from "$lib/types";

import { TABLES } from "$lib/constants/database";

export const DELETE: RequestHandler = async ({ locals, plannerDb, params }) => {
  const { activeWorkspaceId } = locals;
  const { id } = params;

  if (!id) {
    return json({ error: "Vendor ID required" }, { status: 400 });
  }

  const deletedVendor = await plannerDb
    .deleteFrom(TABLES.VENDORS)
    .where("id", "=", id)
    .where("organizationId", "=", activeWorkspaceId)
    .returningAll()
    .executeTakeFirst();

  if (!deletedVendor) {
    return json({ error: "Vendor not found" }, { status: 404 });
  }

  await plannerDb.deleteFrom(TABLES.VENDORS).where("id", "=", id).execute();

  return json({ success: true, message: "Vendor deleted" });
};

export const PUT: RequestHandler = async ({
  locals,
  plannerDb,
  params,
  request,
}) => {
  const { activeWorkspaceId } = locals;
  const { id } = params;

  if (!id) {
    return json({ error: "Task ID required" }, { status: 400 });
  }

  const data = (await request.json()) as Vendor;

  const updatedVendor = await plannerDb
    .updateTable(TABLES.VENDORS)
    .set({
      ...data,
    })
    .where("id", "=", id)
    .where("organizationId", "=", activeWorkspaceId)
    .returningAll()
    .executeTakeFirst();

  if (!updatedVendor) {
    return json({ error: "Vendor not found" }, { status: 404 });
  }

  return json({ success: true, message: "Vendor updated" });
};
