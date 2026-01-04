import { createMutation, useQueryClient } from "@tanstack/svelte-query";

import { broadcastInvalidate } from "$lib/utils/broadcast";
import type { Task } from "$lib/types";

export function useCreateTask() {
  const queryClient = useQueryClient();

  return createMutation(() => ({
    mutationFn: async (
      taskData: Omit<
        Task,
        | "id"
        | "createdAt"
        | "updatedAt"
        | "completedAt"
        | "assignedTo"
        | "organizationId"
        | "createdBy"
      >
    ) => {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });
      if (!response.ok) {
        throw new Error("Failed to create task");
      }
      return response.json();
    },
    onSuccess: () => {
      console.log("[Mutation] onSuccess called for createTask");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      console.log("[Mutation] Calling broadcastInvalidate");
      broadcastInvalidate(["tasks", "dashboard"]);
      console.log("[Mutation] broadcastInvalidate completed");
    },
  }));
}

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();
  return createMutation(() => ({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await fetch("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!response.ok) {
        throw new Error("Failed to update task status");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      broadcastInvalidate(["tasks", "dashboard"]);
    },
  }));
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return createMutation(() => ({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error("Failed to delete task");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      broadcastInvalidate(["tasks", "dashboard"]);
    },
  }));
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return createMutation(() => ({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<Task>) => {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        throw new Error("Failed to update task");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      broadcastInvalidate(["tasks", "dashboard"]);
    },
  }));
}
