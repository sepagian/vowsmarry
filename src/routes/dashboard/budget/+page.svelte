<script lang="ts">
	// Dummy budget data
	const totalBudget = 150000000;
	const categories = [
		{ name: 'Venue', planned: 50000000, actual: 45000000, percentage: 33 },
		{ name: 'Catering', planned: 30000000, actual: 28000000, percentage: 20 },
		{ name: 'Photography', planned: 15000000, actual: 15000000, percentage: 10 },
		{ name: 'Decoration', planned: 20000000, actual: 18000000, percentage: 13 },
		{ name: 'Wedding Dress', planned: 10000000, actual: 8000000, percentage: 7 },
		{ name: 'Music & Entertainment', planned: 12000000, actual: 0, percentage: 8 },
		{ name: 'Transportation', planned: 8000000, actual: 6000000, percentage: 5 },
		{ name: 'Miscellaneous', planned: 5000000, actual: 2000000, percentage: 3 }
	];

	const totalSpent = categories.reduce((sum, cat) => sum + cat.actual, 0);
	const totalPlanned = categories.reduce((sum, cat) => sum + cat.planned, 0);

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
								style="width: {Math.min((category.actual / category.planned) * 100, 100)}%"
							></div>
						</div>
						<div class="flex justify-between text-xs text-muted-foreground mt-1">
							<span>{Math.round((category.actual / category.planned) * 100)}% used</span>
							<span>{category.percentage}% of total budget</span>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Recent Expenses -->
	<div class="rounded-lg border bg-card p-4">
		<div class="flex items-center justify-between mb-4">
			<h2 class="text-lg font-semibold">Recent Expenses</h2>
			<button class="text-sm font-medium hover:underline">Add Expense</button>
		</div>
		
		<div class="space-y-3">
			<div class="flex items-center justify-between p-3 border rounded-lg">
				<div class="flex items-center gap-3">
					<div class="w-2 h-2 rounded-full bg-muted-foreground"></div>
					<div>
						<p class="font-medium">Venue Deposit</p>
						<p class="text-sm text-muted-foreground">Aug 20, 2024 • Venue</p>
					</div>
				</div>
				<span class="font-medium">{formatCurrency(25000000)}</span>
			</div>
			
			<div class="flex items-center justify-between p-3 border rounded-lg">
				<div class="flex items-center gap-3">
					<div class="w-2 h-2 rounded-full bg-muted-foreground"></div>
					<div>
						<p class="font-medium">Wedding Dress</p>
						<p class="text-sm text-muted-foreground">Aug 18, 2024 • Wedding Dress</p>
					</div>
				</div>
				<span class="font-medium">{formatCurrency(8000000)}</span>
			</div>
			
			<div class="flex items-center justify-between p-3 border rounded-lg">
				<div class="flex items-center gap-3">
					<div class="w-2 h-2 rounded-full bg-muted-foreground"></div>
					<div>
						<p class="font-medium">Photography Package</p>
						<p class="text-sm text-muted-foreground">Aug 15, 2024 • Photography</p>
					</div>
				</div>
				<span class="font-medium">{formatCurrency(15000000)}</span>
			</div>
		</div>
	</div>
</div>