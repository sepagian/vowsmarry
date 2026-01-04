import type { PageServerLoad, Actions } from "./$types";
import { fail } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { valibot } from "sveltekit-superforms/adapters";
import { expenseSchema, type ExpenseData } from "$lib/validation/planner";
import { withAuth } from "$lib/server/auth";
import { handleActionError } from "$lib/server/error-handler";
import { TABLES } from "$lib/constants/database";
import { FormDataParser } from "$lib/utils/form-helpers";

export const load: PageServerLoad = async () => {
	const expenseForm = await superValidate(valibot(expenseSchema));

	return {
		expenseForm,
	};
};

export const actions: Actions = {
	// Wedding data is now managed through Better Auth organization API
	// Use the settings/workspace page to update organization details

	createExpenseItem: withAuth(
		async ({ organizationId, plannerDb }, { request }) => {
			const form = await superValidate(request, valibot(expenseSchema));
			if (!form.valid) return fail(400, { form });

			const {
				expenseDescription,
				expenseCategory,
				expenseAmount,
				expensePaymentStatus,
				expenseDueDate,
			} = form.data as ExpenseData;

			try {
				const now = Date.now();
				const newExpense = await plannerDb
					.insertInto(TABLES.EXPENSES)
					.values({
						id: crypto.randomUUID(),
						organizationId,
						expenseDescription,
						expenseCategory,
						expenseAmount,
						expensePaymentStatus,
						expenseDueDate: String(expenseDueDate),
						createdAt: now,
						updatedAt: now,
					})
					.returningAll()
					.executeTakeFirstOrThrow();

				return { form, success: true, expense: newExpense };
			} catch (error) {
				return handleActionError(error, "create expense", { form });
			}
		}
	),

	updateExpenseItem: withAuth(
		async ({ organizationId, plannerDb }, { request }) => {
			const clonedRequest = request.clone();
			const parser = new FormDataParser(await clonedRequest.formData());
			const expenseId = parser.getString("id");

			const form = await superValidate(request, valibot(expenseSchema));
			if (!form.valid) return fail(400, { form });

			const {
				expenseDescription,
				expenseCategory,
				expenseAmount,
				expensePaymentStatus,
				expenseDueDate,
			} = form.data as ExpenseData;

			try {
				const updatedExpense = await plannerDb
					.updateTable(TABLES.EXPENSES)
					.set({
						expenseDescription,
						expenseCategory,
						expenseAmount,
						expensePaymentStatus,
						expenseDueDate: String(expenseDueDate),
						updatedAt: Date.now(),
					})
					.where("id", "=", expenseId)
					.where("organizationId", "=", organizationId)
					.returningAll()
					.executeTakeFirst();

				if (!updatedExpense) {
					return fail(404, { form, error: "Expense not found" });
				}

				return { form, success: true, expense: updatedExpense };
			} catch (error) {
				return handleActionError(error, "update expense", { form });
			}
		}
	),

	deleteExpenseItem: withAuth(
		async ({ organizationId, plannerDb }, { request }) => {
			try {
				const parser = new FormDataParser(await request.formData());
				const expenseId = parser.getString("id");

				const deletedExpense = await plannerDb
					.deleteFrom(TABLES.EXPENSES)
					.where("id", "=", expenseId)
					.where("organizationId", "=", organizationId)
					.returningAll()
					.executeTakeFirst();

				if (!deletedExpense) {
					return fail(404, { error: "Expense not found" });
				}

				return { success: true };
			} catch (error) {
				return handleActionError(error, "delete expense");
			}
		}
	),

	updatePaymentStatus: withAuth(
		async ({ organizationId, plannerDb }, { request }) => {
			try {
				const parser = new FormDataParser(await request.formData());
				const expenseId = parser.getString("id");
				const newPaymentStatus = parser.getEnum("paymentStatus", [
					"paid",
					"unpaid",
				] as const);

				const updatedPaymentStatus = await plannerDb
					.updateTable(TABLES.EXPENSES)
					.set({
						expensePaymentStatus: newPaymentStatus,
						updatedAt: Date.now(),
					})
					.where("id", "=", expenseId)
					.where("organizationId", "=", organizationId)
					.returningAll()
					.executeTakeFirst();

				if (!updatedPaymentStatus) {
					return fail(404, { error: "Expense not found" });
				}

				return { success: true, expense: updatedPaymentStatus };
			} catch (error) {
				return handleActionError(error, "update payment status");
			}
		}
	),
};
