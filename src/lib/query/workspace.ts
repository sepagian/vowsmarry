import { createQuery } from "@tanstack/svelte-query";

type WorkspaceResponse = {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  metadata: string | null;
  createdAt: Date;
  groomName?: string | null;
  brideName?: string | null;
  weddingDate?: string | null;
  weddingVenue?: string | null;
  weddingBudget?: number | null;
} | null;

export function useWorkspace() {
  return createQuery<WorkspaceResponse>(() => ({
    queryKey: ["workspace"],
    queryFn: async () => {
      const res = await fetch("/api/workspace");
      return res.ok ? res.json() : null;
    },
  }));
}
