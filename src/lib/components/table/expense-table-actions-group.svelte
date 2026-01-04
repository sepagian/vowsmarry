<script lang="ts">
	import type { Expense } from "$lib/types";
	import ExpenseTableEdit from "./expense-table-edit.svelte";
	import ExpenseTableDelete from "./expense-table-delete.svelte";

	let {
		expense,
		data,
		onDelete,
		readonly = false,
	}: {
		expense: Expense;
		data: unknown;
		onDelete?: (expenseId: string) => Promise<void>;
		readonly?: boolean;
	} = $props();
</script>

{#if readonly}
	<div class="flex gap-2 justify-center text-muted-foreground">
		<div class="i-lucide:eye h-4 w-4" title="View only"></div>
	</div>
{:else}
	<div class="flex gap-2 justify-center">
		<ExpenseTableEdit {expense} {data}/>
		<ExpenseTableDelete
			expenseId={expense.id}
			expenseDescription={expense.expenseDescription}
			{onDelete}
		/>
	</div>
{/if}
