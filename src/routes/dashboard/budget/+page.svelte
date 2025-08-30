<script lang="ts">
	let { data } = $props();

	const budgetSummary = data.budgetSummary;
	const categories = budgetSummary.categories;
	const totalBudget = data.wedding?.budget ? Number(data.wedding.budget) : budgetSummary.totalPlanned;
	const totalSpent = budgetSummary.totalActual;
	const totalPlanned = budgetSummary.totalPlanned;

	function formatCurrency(amount: number) {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(amount);
	}
</script>

<div class="flex flex-1 flex-col gap-4 p-4">
	<!-- Header -->
	<div class="flex flex-col gap-2">
		<h1 class="text-2xl font-semibold">Budget Management</h1>
		<p class="text-muted-foreground">Track your wedding expenses and stay within budget.</p>
	</div>

	<!-- Budget Overview -->
	<div class="grid gap-4 md:grid-cols-3">
		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Total Budget</p>
				<svg class="w-5 h-5 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
					<path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
				</svg>
			</div>
			<p class="text-2xl font-bold">{formatCurrency(totalBudget)}</p>
		</div>

		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Total Spent</p>
				<svg class="w-5 h-5 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
					<path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
				</svg>
			</div>
			<p class="text-2xl font-bold">{formatCurrency(totalSpent)}</p>
			<p class="text-sm text-muted-foreground">{Math.round((totalSpent / totalBudget) * 100)}% of budget</p>
		</div>

		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Remaining</p>
				<svg class="w-5 h-5 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
					<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clip-rule="evenodd" />
				</svg>
			</div>
			<p class="text-2xl font-bold">{formatCurrency(totalBudget - totalSpent)}</p>
			<p class="text-sm text-muted-foreground">{Math.round(((totalBudget - totalSpent) / totalBudget) * 100)}% remaining</p>
		</div>
	</div>

	<!-- Budget Categories -->
	<div class="rounded-lg border bg-card p-4">
		<div class="flex items-center justify-between mb-4">
			<h2 class="text-lg font-semibold">Budget Categories</h2>
			<button class="text-sm font-medium hover:underline">Add Category</button>
		</div>
		
		<div class="space-y-4">
			{#if categories.length > 0}
				{#each categories as category}
					<div class="flex items-center justify-between p-3 border rounded-lg">
						<div class="flex-1">
							<div class="flex items-center justify-between mb-2">
								<h3 class="font-medium">{category.name}</h3>
								<div class="text-sm text-muted-foreground">
									{formatCurrency(category.actual)} / {formatCurrency(category.planned)}
								</div>
							</div>
							<div class="w-full bg-muted rounded-full h-2">
								<div
									class="bg-foreground h-2 rounded-full"
									style="width: {category.planned > 0 ? Math.min((category.actual / category.planned) * 100, 100) : 0}%"
								></div>
							</div>
							<div class="flex justify-between text-xs text-muted-foreground mt-1">
								<span>{category.planned > 0 ? Math.round((category.actual / category.planned) * 100) : 0}% used</span>
								<span>{category.percentage}% of total budget ({category.itemCount} items)</span>
							</div>
						</div>
					</div>
				{/each}
			{:else}
				<div class="text-center py-8 text-muted-foreground">
					<p>No budget categories yet. Start by adding your first budget item!</p>
				</div>
			{/if}
		</div>
	</div>

	<!-- Recent Expenses -->
	<div class="rounded-lg border bg-card p-4">
		<div class="flex items-center justify-between mb-4">
			<h2 class="text-lg font-semibold">Recent Expenses</h2>
			<button class="text-sm font-medium hover:underline">Add Expense</button>
		</div>
		
		<div class="space-y-3">
			{#if data.recentExpenses.length > 0}
				{#each data.recentExpenses as expense}
					<div class="flex items-center justify-between p-3 border rounded-lg">
						<div class="flex items-center gap-3">
							<div class="w-2 h-2 rounded-full bg-muted-foreground"></div>
							<div>
								<p class="font-medium">{expense.description}</p>
								<p class="text-sm text-muted-foreground">
									{expense.updatedAt ? new Date(expense.updatedAt).toLocaleDateString('id-ID') : ''} • {expense.category}
								</p>
							</div>
						</div>
						<span class="font-medium">{formatCurrency(Number(expense.actualAmount || 0))}</span>
					</div>
				{/each}
			{:else}
				<div class="text-center py-8 text-muted-foreground">
					<p>No expenses recorded yet.</p>
				</div>
			{/if}
		</div>
	</div>
</div>