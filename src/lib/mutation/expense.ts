import { createMutation, useQueryClient } from "@tanstack/svelte-query";

import { broadcastInvalidate } from "$lib/utils/broadcast";
import type { Expense } from "$lib/types";

export function useCreateExpense() {
  const queryClient = useQueryClient();

  return createMutation(() => ({
    mutationFn: async (
      expenseData: Omit<
        Expense,
        "id" | "createdAt" | "updatedAt" | "organizationId"
      >
    ) => {
      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expenseData),
      });
      if (!response.ok) {
        throw new Error("Failed to create expense");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      broadcastInvalidate(["expenses", "dashboard"]);
    },
  }));
}

export function useUpdatePaymentStatus() {
  const queryClient = useQueryClient();

  return createMutation(() => ({
    mutationFn: async ({
      id,
      paymentStatus,
    }: {
      id: string;
      paymentStatus: Expense["expensePaymentStatus"];
    }) => {
      const response = await fetch("/api/expenses", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: paymentStatus }),
      });
      if (!response.ok) {
        throw new Error("Failed to update payment status");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      broadcastInvalidate(["expenses", "dashboard"]);
    },
  }));
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();

  return createMutation(() => ({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/expenses/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete expense");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      broadcastInvalidate(["expenses", "dashboard"]);
    },
  }));
}

export function useUpdateExpense() {
  const queryClient = useQueryClient();

  return createMutation(() => ({
    mutationFn: async ({
      id,
      ...updates
    }: { id: string } & Partial<Expense>) => {
      const response = await fetch(`/api/expenses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        throw new Error("Failed to update expense");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      broadcastInvalidate(["expenses", "dashboard"]);
    },
  }));
}
