<script lang="ts">
	import ExpenseTable from '$lib/components/table/expense-table.svelte';
</script>

<div class="flex flex-col gap-4 px-4">
	<div class="flex flex-col">
		<h2 class="text-base font-bold text-neutral-600">Recent Expenses</h2>
	</div>

	<div class="flex flex-col gap-4">
		<div class="flex flex-col">
			<ExpenseTable />
		</div>
	</div>
</div>
