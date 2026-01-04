import { json } from "@sveltejs/kit";

import { TABLES } from "$lib/constants/database";
import type { Vendor, VendorStatus } from "$lib/types";

import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ locals, plannerDb }) => {
  const { activeWorkspaceId } = locals;

  if (!activeWorkspaceId) {
    return json({ error: "No workspace" }, { status: 400 });
  }

  const [vendorStats, vendorList] = await Promise.all([
    plannerDb
      .selectFrom(TABLES.VENDORS)
      .select((eb) => [
        eb.fn.countAll<number>().as("total"),
        eb.fn
          .countAll<number>()
          .filterWhere("vendorStatus", "=", "researching")
          .as("researching"),
        eb.fn
          .countAll<number>()
          .filterWhere("vendorStatus", "=", "contacted")
          .as("contacted"),
        eb.fn
          .countAll<number>()
          .filterWhere("vendorStatus", "=", "quoted")
          .as("quoted"),
        eb.fn
          .countAll<number>()
          .filterWhere("vendorStatus", "=", "booked")
          .as("booked"),
      ])
      .where("organizationId", "=", activeWorkspaceId)
      .executeTakeFirst(),

    plannerDb
      .selectFrom(TABLES.VENDORS)
      .selectAll()
      .where("organizationId", "=", activeWorkspaceId)
      .orderBy("vendorName", "asc")
      .execute(),
  ]);

  const getLatestUpdate = (status: string) =>
    plannerDb
      .selectFrom(TABLES.VENDORS)
      .select("updatedAt")
      .where("organizationId", "=", activeWorkspaceId)
      .where("vendorStatus", "=", status as VendorStatus)
      .orderBy("updatedAt", "desc")
      .limit(1)
      .executeTakeFirst()
      .then((r) => r?.updatedAt ?? null);

  const [researching, contacted, quoted, booked] = await Promise.all([
    getLatestUpdate("researching"),
    getLatestUpdate("contacted"),
    getLatestUpdate("quoted"),
    getLatestUpdate("booked"),
  ]);

  return json({
    vendors: vendorList,
    vendorStats,
    update: { researching, contacted, quoted, booked },
  });
};

export const POST: RequestHandler = async ({ request, locals, plannerDb }) => {
  const { activeWorkspaceId } = locals;
  const data = (await request.json()) as Vendor;

  const newVendor = await plannerDb
    .insertInto(TABLES.VENDORS)
    .values({
      ...data,
      id: crypto.randomUUID(),
      organizationId: activeWorkspaceId as string,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })
    .returningAll()
    .executeTakeFirst();

  return json({ success: true, vendor: newVendor });
};

export const PATCH: RequestHandler = async ({ request, locals, plannerDb }) => {
  const { activeWorkspaceId } = locals;
  const { id, status }: { id: string; status: VendorStatus } =
    await request.json();

  const updatedVendor = await plannerDb
    .updateTable(TABLES.VENDORS)
    .set({
      vendorStatus: status,
      updatedAt: Date.now(),
    })
    .where("id", "=", id)
    .where("organizationId", "=", activeWorkspaceId)
    .returningAll()
    .executeTakeFirst();

  return json({ success: true, updatedVendor });
};
