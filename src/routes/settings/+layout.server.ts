import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

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
  };
};
