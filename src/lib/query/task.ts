import { createQuery } from "@tanstack/svelte-query";

import type { Task } from "$lib/types";

type TaskStats = {
  total: number;
  pending: number;
  onProgress: number;
  completed: number;
};

export type TaskResponse = {
  tasks: Task[];
  taskStats: TaskStats;
  update: {
    total: number | null;
    pending: number | null;
    onProgress: number | null;
    completed: number | null;
  };
};

export function useTasks() {
  return createQuery<TaskResponse>(() => ({
    queryKey: ["tasks"],
    queryFn: async () => {
      const response = await fetch("/api/tasks");
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }
      return response.json();
    },
  }));
}

export function useTaskStats() {
  return createQuery(() => ({
    queryKey: ["tasks", "stats"],
    queryFn: async () => {
      const response = await fetch("/api/tasks/stats");
      if (!response.ok) {
        throw new Error("Failed to fetch task stats");
      }
      return response.json();
    },
  }));
}
