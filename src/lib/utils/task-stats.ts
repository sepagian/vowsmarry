import type { Task } from "$lib/types";

export function getTaskStats(tasks: Task[]) {
  const now = new Date();
  const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  return {
    total: tasks.length,
    pending: tasks.filter((t) => t.taskStatus === "pending").length,
    inProgress: tasks.filter((t) => t.taskStatus === "on_progress").length,
    completed: tasks.filter((t) => t.taskStatus === "completed").length,
    overdue: tasks.filter((t) => {
      if (t.taskStatus === "completed") {
        return false;
      }
      return new Date(t.taskDueDate) < now;
    }).length,
    dueSoon: tasks.filter((t) => {
      if (t.taskStatus === "completed") {
        return false;
      }
      const dueDate = new Date(t.taskDueDate);
      return dueDate >= now && dueDate <= weekFromNow;
    }).length,
    highPriority: tasks.filter((t) => t.taskPriority === "high").length,
  };
}
