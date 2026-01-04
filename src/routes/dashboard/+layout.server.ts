import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { getTableCount } from "$lib/server/db/query-helpers";
import { TABLES } from "$lib/constants/database";

export const load: LayoutServerLoad = async ({ locals, plannerDb }) => {
  const { user, activeWorkspace, activeWorkspaceId } = locals;

  if (!user) {
    redirect(302, "/login");
  }

  if (!activeWorkspace) {
    redirect(302, "/onboarding");
  }

  if (!activeWorkspaceId) {
    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.name || null,
        lastName: null,
      },
      workspace: {
        id: activeWorkspace.id,
        name: activeWorkspace.name,
        slug: activeWorkspace.slug,
        groomName: activeWorkspace.groomName || null,
        brideName: activeWorkspace.brideName || null,
        weddingDate: activeWorkspace.weddingDate || null,
        weddingVenue: activeWorkspace.weddingVenue || null,
        weddingBudget: activeWorkspace.weddingBudget
          ? Number.parseFloat(activeWorkspace.weddingBudget)
          : null,
      },
      hasWeddingData: true,
      stats: {
        taskCount: 0,
        expensePaidAmount: 0,
        documentCount: 0,
        vendorCount: 0,
      },
    };
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
      id: activeWorkspace.id,
      name: activeWorkspace.name,
      slug: activeWorkspace.slug,
      groomName: activeWorkspace.groomName || null,
      brideName: activeWorkspace.brideName || null,
      weddingDate: activeWorkspace.weddingDate || null,
      weddingVenue: activeWorkspace.weddingVenue || null,
      weddingBudget: activeWorkspace.weddingBudget
        ? Number.parseFloat(activeWorkspace.weddingBudget)
        : null,
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
