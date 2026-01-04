import { createQuery } from "@tanstack/svelte-query";

import type { Vendor } from "$lib/types";

type VendorStats = {
  total: number;
  researching: number;
  contacted: number;
  quoted: number;
  booked: number;
};

export type VendorResponse = {
  vendors: Vendor[];
  vendorStats: VendorStats;
  update: {
    total: number | null;
    researching: number | null;
    contacted: number | null;
    quoted: number | null;
    booked: number | null;
  };
};

export function useVendors() {
  return createQuery<VendorResponse>(() => ({
    queryKey: ["vendors"],
    queryFn: async () => {
      const response = await fetch("/api/vendors");
      if (!response.ok) {
        throw new Error("Failed to fetch vendors");
      }
      return response.json();
    },
  }));
}

export function useVendorsStats() {
  return createQuery<VendorStats>(() => ({
    queryKey: ["vendors", "stats"],
    queryFn: async () => {
      const response = await fetch("/api/vendors/stats");
      if (!response.ok) {
        throw new Error("Failed to fetch vendors stats");
      }
      return response.json();
    },
  }));
}
