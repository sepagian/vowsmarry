import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { sql } from "kysely";

export const GET: RequestHandler = async ({ locals, plannerDb }) => {
  const { activeWorkspaceId } = locals;

  if (!activeWorkspaceId) {
    return json({ error: "No workspace" }, { status: 400 });
  }

  const [
    rundownList,
    totalEvents,
    completedEventsCount,
    nextEvent,
    tasksList,
    expensesList,
  ] = await Promise.all([
    plannerDb
      .selectFrom("schedules")
      .selectAll()
      .where("organizationId", "=", activeWorkspaceId)
      .orderBy("scheduleDate", "asc")
      .orderBy("scheduleStartTime", "asc")
      .execute(),

    plannerDb
      .selectFrom("schedules")
      .select((eb) => eb.fn.countAll<number>().as("count"))
      .where("organizationId", "=", activeWorkspaceId)
      .executeTakeFirst()
      .then((r) => r?.count ?? 0),

    plannerDb
      .selectFrom("schedules")
      .select((eb) => eb.fn.countAll<number>().as("count"))
      .where("organizationId", "=", activeWorkspaceId)
      .where(
        sql`datetime(schedule_date || ' ' || schedule_end_time)`,
        "<",
        sql`datetime('now')`,
      )
      .executeTakeFirst()
      .then((r) => r?.count ?? 0),

    plannerDb
      .selectFrom("schedules")
      .selectAll()
      .where("organizationId", "=", activeWorkspaceId)
      .where(
        sql`datetime(schedule_date || ' ' || schedule_start_time)`,
        ">",
        sql`datetime('now')`,
      )
      .orderBy("scheduleDate", "asc")
      .orderBy("scheduleStartTime", "asc")
      .executeTakeFirst(),

    plannerDb
      .selectFrom("tasks")
      .selectAll()
      .where("organizationId", "=", activeWorkspaceId)
      .orderBy("taskDueDate", "asc")
      .execute(),

    plannerDb
      .selectFrom("expense_items")
      .selectAll()
      .where("organizationId", "=", activeWorkspaceId)
      .orderBy("expenseDueDate", "asc")
      .execute(),
  ]);

  const remainingEventsCount = totalEvents - completedEventsCount;

  return json({
    schedules: rundownList,
    tasks: tasksList,
    expenses: expensesList,
    stats: {
      totalEvents,
      completedEvents: completedEventsCount,
      remainingEvents: remainingEventsCount,
      nextEvent: nextEvent
        ? {
            name: nextEvent.scheduleName,
            startTime: nextEvent.scheduleStartTime,
          }
        : null,
    },
    update: {},
  });
};
