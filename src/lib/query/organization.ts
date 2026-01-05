import { createQuery } from "@tanstack/svelte-query";

export type OrganizationMember = {
  userId: string;
  role: string;
  createdAt: number;
  user?: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
};

export type OrganizationInvitation = {
  id: string;
  email: string;
  role: string;
  status: string;
  expiresAt: number;
  createdAt: number;
};

export type OrganizationResponse = {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  metadata: string | null;
  createdAt: number;
  groomName?: string | null;
  brideName?: string | null;
  weddingDate?: string | null;
  weddingVenue?: string | null;
  weddingBudget?: number | null;
  members?: OrganizationMember[];
} | null;

export type OrganizationDetailsResponse = {
  organization: OrganizationResponse;
  invitations: OrganizationInvitation[];
} | null;

export function useOrganization() {
  return createQuery<OrganizationDetailsResponse>(() => ({
    queryKey: ["organization"],
    queryFn: async () => {
      const res = await fetch("/api/organization");
      return res.ok ? res.json() : null;
    },
    staleTime: 30_000,
  }));
}
