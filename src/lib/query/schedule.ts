import { createQuery } from "@tanstack/svelte-query";

import type { Schedule } from "$lib/types";

type ScheduleStats = {
  totalEvents: number;
  completedEvents: number;
  remainingEvents: number;
  nextEvent: {
    name: string;
    startTime: string;
  } | null;
};

type ScheduleResponse = {
  schedules: Schedule[];
  tasks: unknown[];
  expenses: unknown[];
  stats: ScheduleStats;
  update: Record<string, unknown>;
};

export function useSchedules() {
  return createQuery<ScheduleResponse>(() => ({
    queryKey: ["schedules"],
    queryFn: async () => {
      const response = await fetch("/api/schedules");
      if (!response.ok) {
        throw new Error("Failed to fetch schedules");
      }
      return response.json();
    },
  }));
}
