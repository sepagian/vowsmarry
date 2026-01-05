import type { PageServerLoad, Actions } from "./$types";
import { fail, error } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { valibot } from "sveltekit-superforms/adapters";
import { scheduleSchema, type ScheduleData } from "$lib/validation/planner";

export const load: PageServerLoad = async () => {
  const scheduleForm = await superValidate(valibot(scheduleSchema));

  return {
    scheduleForm,
  };
};

export const actions: Actions = {
  createSchedule: async ({ locals, request, plannerDb }) => {
    const { activeWorkspaceId } = locals;

    if (!activeWorkspaceId) {
      throw error(404, "No active workspace found");
    }

    const form = await superValidate(request, valibot(scheduleSchema));
    if (!form.valid) {
      return fail(400, { form });
    }

    const {
      scheduleName,
      scheduleCategory,
      scheduleDate,
      scheduleStartTime,
      scheduleEndTime,
      scheduleLocation,
      scheduleVenue,
      scheduleAttendees,
      isPublic,
    } = form.data as ScheduleData;

    try {
      const newSchedule = await plannerDb
        .insertInto("schedules")
        .values({
          id: crypto.randomUUID(),
          organizationId: activeWorkspaceId,
          scheduleName,
          scheduleCategory,
          scheduleDate: String(scheduleDate),
          scheduleStartTime: String(scheduleStartTime),
          scheduleEndTime: String(scheduleEndTime),
          scheduleLocation,
          scheduleVenue,
          scheduleAttendees,
          isPublic: isPublic ? 1 : 0,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        })
        .returningAll()
        .executeTakeFirstOrThrow();

      return { form, success: true, schedule: newSchedule };
    } catch (err) {
      console.error("Create rundown error:", err);
      return fail(500, {
        form,
        error: "Failed to add new rundown. Please try again.",
      });
    }
  },
  updateSchedule: async ({ locals, request, plannerDb }) => {
    const { activeWorkspaceId } = locals;

    if (!activeWorkspaceId) {
      throw error(404, "No active workspace found");
    }

    const form = await superValidate(request, valibot(scheduleSchema));
    if (!form.valid) {
      return fail(400, { form });
    }

    const data = await request.formData();
    const scheduleId = data.get("id") as string;

    const {
      scheduleName,
      scheduleCategory,
      scheduleDate,
      scheduleStartTime,
      scheduleEndTime,
      scheduleLocation,
      scheduleVenue,
      scheduleAttendees,
      isPublic,
    } = form.data as ScheduleData;

    try {
      const updatedRundown = await plannerDb
        .updateTable("schedules")
        .set({
          scheduleName,
          scheduleCategory,
          scheduleDate: String(scheduleDate),
          scheduleStartTime: String(scheduleStartTime),
          scheduleEndTime: String(scheduleEndTime),
          scheduleLocation,
          scheduleVenue,
          scheduleAttendees,
          isPublic: isPublic ? 1 : 0,
          updatedAt: Date.now(),
        })
        .where("id", "=", scheduleId)
        .where("organizationId", "=", activeWorkspaceId)
        .returningAll()
        .executeTakeFirst();

      if (!updatedRundown) {
        return fail(404, { error: "Rundown not found" });
      }

      return { success: true, rundown: updatedRundown };
    } catch (err) {
      console.error("Rundown update error:", err);
      return fail(500, {
        error: "Failed to update rundown. Please try again.",
      });
    }
  },
  deleteSchedule: async ({ locals, request, plannerDb }) => {
    const { activeWorkspaceId } = locals;

    if (!activeWorkspaceId) {
      throw error(404, "No active workspace found");
    }

    const data = await request.formData();
    const scheduleId = data.get("id") as string;

    try {
      const deletedRundown = await plannerDb
        .deleteFrom("schedules")
        .where("id", "=", scheduleId)
        .where("organizationId", "=", activeWorkspaceId)
        .returningAll()
        .executeTakeFirst();

      if (!deletedRundown) {
        return fail(404, { error: "Rundown not found" });
      }

      return { success: true };
    } catch (err) {
      console.error("Rundown deletion error:", err);
      return fail(500, {
        error: "Failed to delete rundown. Please try again.",
      });
    }
  },
};
