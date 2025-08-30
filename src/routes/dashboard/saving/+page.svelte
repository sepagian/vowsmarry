<script lang="ts">
	let { data } = $props();

	const savingsSummary = data.savingsSummary;
	const savingsEntries = data.savingsEntries;
	const savingsStats = data.savingsStats;

	function formatCurrency(amount: number) {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(amount);
	}

	function formatDate(dateString: string | Date | null) {
		if (!dateString) return 'No date set';
		return new Date(dateString).toLocaleDateString('id-ID');
	}

	function getEntryTypeIcon(type: string | null) {
		switch (type) {
			case 'deposit':
				return '💰';
			case 'withdrawal':
				return '💸';
			case 'interest':
				return '📈';
			case 'transfer':
				return '🔄';
			default:
				return '💵';
		}
	}

	function getEntryTypeColor(type: string | null) {
		switch (type) {
			case 'deposit':
				return 'bg-green-100 text-green-800';
			case 'withdrawal':
				return 'bg-red-100 text-red-800';
			case 'interest':
				return 'bg-blue-100 text-blue-800';
			case 'transfer':
				return 'bg-purple-100 text-purple-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}
</script>

<div class="flex flex-1 flex-col gap-4 p-4">
	<!-- Header -->
	<div class="flex flex-col gap-2">
		<h1 class="text-2xl font-semibold">Wedding Savings</h1>
		<p class="text-muted-foreground">Track your wedding savings progress and manage your financial goals.</p>
	</div>

	<!-- Savings Overview -->
	<div class="grid gap-4 md:grid-cols-4">
		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Savings Goal</p>
				<svg class="w-5 h-5 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
					<path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
				</svg>
			</div>
			<p class="text-2xl font-bold">{formatCurrency(savingsStats.goalAmount)}</p>
		</div>

		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Current Savings</p>
				<span class="text-lg">💰</span>
			</div>
			<p class="text-2xl font-bold">{formatCurrency(savingsStats.currentAmount)}</p>
			<p class="text-sm text-muted-foreground">{Math.round(savingsStats.progressPercentage)}% of goal</p>
		</div>

		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Remaining</p>
				<span class="text-lg">🎯</span>
			</div>
			<p class="text-2xl font-bold">{formatCurrency(savingsStats.remainingAmount)}</p>
			<p class="text-sm text-muted-foreground">{savingsStats.monthsRemaining} months to go</p>
		</div>

		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Monthly Target</p>
				<span class="text-lg">📅</span>
			</div>
			<p class="text-2xl font-bold">{formatCurrency(savingsStats.monthlyTarget)}</p>
		</div>
	</div>

	<!-- Progress Chart -->
	<div class="rounded-lg border bg-card p-4">
		<h2 class="text-lg font-semibold mb-4">Savings Progress</h2>
		<div class="space-y-4">
			<div>
				<div class="flex justify-between text-sm mb-2">
					<span class="text-muted-foreground">Progress to Goal</span>
					<span class="font-medium">{formatCurrency(savingsStats.currentAmount)} / {formatCurrency(savingsStats.goalAmount)}</span>
				</div>
				<div class="w-full bg-muted rounded-full h-4">
					<div
						class="bg-foreground h-4 rounded-full transition-all duration-300"
						style="width: {savingsStats.progressPercentage}%"
					></div>
				</div>
				<div class="flex justify-between text-xs text-muted-foreground mt-1">
					<span>0%</span>
					<span>{Math.round(savingsStats.progressPercentage)}%</span>
					<span>100%</span>
				</div>
			</div>
		</div>
	</div>	<!-- Sa
vings History -->
	<div class="rounded-lg border bg-card p-4">
		<div class="flex items-center justify-between mb-4">
			<h2 class="text-lg font-semibold">Savings History</h2>
			<button class="text-sm font-medium hover:underline">Add Deposit</button>
		</div>
		
		<div class="space-y-3">
			{#if savingsEntries.length > 0}
				{#each savingsEntries as entry}
					<div class="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
						<div class="flex items-center gap-3">
							<div class="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
								<span class="text-sm">{getEntryTypeIcon(entry.type)}</span>
							</div>
							<div>
								<p class="font-medium">{formatDate(entry.date)}</p>
								<p class="text-sm text-muted-foreground">{entry.source || entry.description || 'No description'}</p>
							</div>
						</div>
						<div class="text-right">
							<span class="font-bold text-lg {entry.type === 'withdrawal' ? 'text-red-600' : 'text-green-600'}">
								{entry.type === 'withdrawal' ? '-' : '+'}{formatCurrency(Number(entry.amount || 0))}
							</span>
							<div class="mt-1">
								<span class="px-2 py-1 text-xs font-medium rounded {getEntryTypeColor(entry.type)}">
									{(entry.type || 'unknown').replace('_', ' ')}
								</span>
							</div>
						</div>
					</div>
				{/each}
			{:else}
				<div class="text-center py-8 text-muted-foreground">
					<div class="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto mb-3">
						<span class="text-2xl">💰</span>
					</div>
					<p class="font-medium mb-2">No savings entries yet</p>
					<p class="text-sm">Start saving for your wedding by adding your first deposit!</p>
				</div>
			{/if}
		</div>
	</div>



	<!-- Add Savings Entry -->
	<div class="rounded-lg border bg-card p-4">
		<h3 class="text-lg font-semibold mb-3">Add Savings Entry</h3>
		<div class="grid gap-3 md:grid-cols-2">
			<div>
				<label for="savings-amount" class="text-sm font-medium text-muted-foreground">Amount</label>
				<input id="savings-amount" type="number" placeholder="0" class="w-full mt-1 px-3 py-2 border rounded-lg bg-background" />
			</div>
			<div>
				<label for="savings-source" class="text-sm font-medium text-muted-foreground">Source</label>
				<select id="savings-source" class="w-full mt-1 px-3 py-2 border rounded-lg bg-background">
					<option>Monthly Salary</option>
					<option>Bonus</option>
					<option>Side Job</option>
					<option>Gift</option>
					<option>Investment Return</option>
					<option>Other</option>
				</select>
			</div>
			<div>
				<label for="savings-date" class="text-sm font-medium text-muted-foreground">Date</label>
				<input id="savings-date" type="date" class="w-full mt-1 px-3 py-2 border rounded-lg bg-background" />
			</div>
			<div>
				<label for="savings-account" class="text-sm font-medium text-muted-foreground">Account</label>
				<select id="savings-account" class="w-full mt-1 px-3 py-2 border rounded-lg bg-background">
					<option>Wedding Savings Account</option>
					<option>Joint Account</option>
					<option>Personal Savings</option>
				</select>
			</div>
		</div>
		<div class="mt-3">
			<label for="savings-notes" class="text-sm font-medium text-muted-foreground">Notes</label>
			<textarea id="savings-notes" placeholder="Optional notes about this deposit..." class="w-full mt-1 px-3 py-2 border rounded-lg bg-background" rows="2"></textarea>
		</div>
		<button class="mt-3 px-4 py-2 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors">
			Add Entry
		</button>
	</div>

	<!-- Savings Goals -->
	<div class="rounded-lg border bg-card p-4">
		<h2 class="text-lg font-semibold mb-4">Savings Milestones</h2>
		<div class="space-y-3">
			<div class="flex items-center justify-between p-3 border rounded-lg">
				<div class="flex items-center gap-3">
					<span class="text-lg">✅</span>
					<div>
						<p class="font-medium">25% Goal Reached</p>
						<p class="text-sm text-muted-foreground">Reached in March 2024</p>
					</div>
				</div>
				<span class="font-medium">{formatCurrency(savingsStats.goalAmount * 0.25)}</span>
			</div>
			
			<div class="flex items-center justify-between p-3 border rounded-lg">
				<div class="flex items-center gap-3">
					<span class="text-lg">✅</span>
					<div>
						<p class="font-medium">50% Goal Reached</p>
						<p class="text-sm text-muted-foreground">Reached in June 2024</p>
					</div>
				</div>
				<span class="font-medium">{formatCurrency(savingsStats.goalAmount * 0.5)}</span>
			</div>
			
			<div class="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
				<div class="flex items-center gap-3">
					<span class="text-lg">🎯</span>
					<div>
						<p class="font-medium">75% Goal (Current Target)</p>
						<p class="text-sm text-muted-foreground">Expected: October 2024</p>
					</div>
				</div>
				<span class="font-medium">{formatCurrency(savingsStats.goalAmount * 0.75)}</span>
			</div>
			
			<div class="flex items-center justify-between p-3 border rounded-lg">
				<div class="flex items-center gap-3">
					<span class="text-lg">🏆</span>
					<div>
						<p class="font-medium">100% Goal Complete</p>
						<p class="text-sm text-muted-foreground">Expected: December 2024</p>
					</div>
				</div>
				<span class="font-medium">{formatCurrency(savingsStats.goalAmount)}</span>
			</div>
		</div>
	</div>
</div>