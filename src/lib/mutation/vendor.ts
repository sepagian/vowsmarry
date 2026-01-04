import { createMutation, useQueryClient } from "@tanstack/svelte-query";

import { broadcastInvalidate } from "$lib/utils/broadcast";
import type { Vendor, VendorStatus } from "$lib/types";

export function useCreateVendor() {
  const queryClient = useQueryClient();

  return createMutation(() => ({
    mutationFn: async (
      vendorData: Omit<
        Vendor,
        "id" | "createdAt" | "updatedAt" | "organizationId"
      >
    ) => {
      const response = await fetch("/api/vendors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(vendorData),
      });
      if (!response.ok) {
        throw new Error("Failed to create vendor");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      broadcastInvalidate(["vendors", "dashboard"]);
    },
  }));
}

export const useUpdateVendor = () => {
  const queryClient = useQueryClient();
  return createMutation(() => ({
    mutationFn: async ({
      id,
      ...updates
    }: { id: string } & Partial<Vendor>) => {
      const response = await fetch(`/api/vendors/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        throw new Error("Failed to update vendor");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      broadcastInvalidate(["vendors", "dashboard"]);
    },
  }));
};

export const useDeleteVendor = () => {
  const queryClient = useQueryClient();
  return createMutation(() => ({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/vendors/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete vendor");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      broadcastInvalidate(["vendors", "dashboard"]);
    },
  }));
};

export const useUpdateVendorStatus = () => {
  const queryClient = useQueryClient();
  return createMutation(() => ({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: VendorStatus;
    }) => {
      const response = await fetch("/api/vendors", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!response.ok) {
        throw new Error("Failed to update vendor status");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      broadcastInvalidate(["vendors", "dashboard"]);
    },
  }));
};
