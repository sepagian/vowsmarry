import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { getTableCount } from "$lib/server/db/query-helpers";
import { TABLES } from "$lib/constants/database";

export const load: LayoutServerLoad = async ({ locals, plannerDb }) => {
  const { user, activeWorkspaceId } = locals;

  if (!user) {
    redirect(302, "/login");
  }

  if (!activeWorkspaceId) {
    redirect(302, "/onboarding");
  }

  const workspace = await plannerDb
    .selectFrom("organization")
    .selectAll()
    .where("id", "=", activeWorkspaceId)
    .executeTakeFirst();

  if (!workspace) {
    redirect(302, "/onboarding");
  }

  const [taskCount, documentCount, vendorCount] = await Promise.all([
    getTableCount(plannerDb, TABLES.TASKS, activeWorkspaceId),
    getTableCount(plannerDb, TABLES.DOCUMENTS, activeWorkspaceId),
    getTableCount(plannerDb, TABLES.VENDORS, activeWorkspaceId),
  ]);

  const expensePaidAmount = await plannerDb
    .selectFrom(TABLES.EXPENSES)
    .select((eb) => eb.fn.sum<number>("expenseAmount").as("total"))
    .where("organizationId", "=", activeWorkspaceId)
    .executeTakeFirst()
    .then((result) => (result?.total ? Number(result.total) : 0));

  return {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.name || null,
      lastName: null,
    },
    workspace: {
      id: workspace.id,
      name: workspace.name,
      slug: workspace.slug,
      groomName: workspace.groomName || null,
      brideName: workspace.brideName || null,
      weddingDate: workspace.weddingDate || null,
      weddingVenue: workspace.weddingVenue || null,
      weddingBudget: workspace.weddingBudget ?? null,
    },
    hasWeddingData: true,
    stats: {
      taskCount,
      expensePaidAmount,
      documentCount,
      vendorCount,
    },
  };
};
