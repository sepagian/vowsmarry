import { createQuery } from "@tanstack/svelte-query";

export type User = {
  id: string;
  name: string | null;
  email: string;
  emailVerified: boolean;
  image: string | null;
};

export type Session = {
  id: string;
  createdAt: number;
  ipAddress: string | null;
  userAgent: string | null;
  expiresAt: number;
};

export function useUser() {
  return createQuery<User | null>(() => ({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await fetch("/api/user");
      return res.ok ? res.json() : null;
    },
  }));
}

export function useSessions() {
  return createQuery<Session[]>(() => ({
    queryKey: ["sessions"],
    queryFn: async () => {
      const res = await fetch("/api/sessions");
      return res.ok ? res.json() : [];
    },
    staleTime: 30_000,
  }));
}
