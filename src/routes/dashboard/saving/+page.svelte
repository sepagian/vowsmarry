<script lang="ts">
	// Dummy savings data
	const savingsGoal = 150000000; // Total wedding budget
	const currentSavings = 95000000;
	const monthlyTarget = 10000000;
	
	const savingsHistory = [
		{ month: 'January 2024', amount: 15000000, source: 'Monthly Salary' },
		{ month: 'February 2024', amount: 12000000, source: 'Monthly Salary + Bonus' },
		{ month: 'March 2024', amount: 10000000, source: 'Monthly Salary' },
		{ month: 'April 2024', amount: 13000000, source: 'Monthly Salary + Side Job' },
		{ month: 'May 2024', amount: 10000000, source: 'Monthly Salary' },
		{ month: 'June 2024', amount: 15000000, source: 'Monthly Salary + Gift' },
		{ month: 'July 2024', amount: 10000000, source: 'Monthly Salary' },
		{ month: 'August 2024', amount: 10000000, source: 'Monthly Salary' }
	];

	const savingsTips = [
		{
			title: 'Set up automatic transfers',
			description: 'Automatically transfer a fixed amount to your wedding savings account each month.',
			category: 'Automation'
		},
		{
			title: 'Cut unnecessary subscriptions',
			description: 'Review and cancel unused streaming services, gym memberships, or magazine subscriptions.',
			category: 'Budgeting'
		},
		{
			title: 'Create a wedding registry early',
			description: 'Start your registry early so friends and family can contribute to your wedding expenses.',
			category: 'Registry'
		},
		{
			title: 'Consider a side hustle',
			description: 'Take on freelance work or sell items you no longer need to boost your wedding fund.',
			category: 'Income'
		}
	];

	const remainingAmount = savingsGoal - currentSavings;
	const progressPercentage = (currentSavings / savingsGoal) * 100;
	const monthsRemaining = Math.ceil(remainingAmount / monthlyTarget);

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
			<p class="text-2xl font-bold">{formatCurrency(savingsGoal)}</p>
		</div>

		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Current Savings</p>
				<span class="text-lg">💰</span>
			</div>
			<p class="text-2xl font-bold">{formatCurrency(currentSavings)}</p>
			<p class="text-sm text-muted-foreground">{Math.round(progressPercentage)}% of goal</p>
		</div>

		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Remaining</p>
				<span class="text-lg">🎯</span>
			</div>
			<p class="text-2xl font-bold">{formatCurrency(remainingAmount)}</p>
			<p class="text-sm text-muted-foreground">{monthsRemaining} months to go</p>
		</div>

		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Monthly Target</p>
				<span class="text-lg">📅</span>
			</div>
			<p class="text-2xl font-bold">{formatCurrency(monthlyTarget)}</p>
		</div>
	</div>

	<!-- Progress Chart -->
	<div class="rounded-lg border bg-card p-4">
		<h2 class="text-lg font-semibold mb-4">Savings Progress</h2>
		<div class="space-y-4">
			<div>
				<div class="flex justify-between text-sm mb-2">
					<span class="text-muted-foreground">Progress to Goal</span>
					<span class="font-medium">{formatCurrency(currentSavings)} / {formatCurrency(savingsGoal)}</span>
				</div>
				<div class="w-full bg-muted rounded-full h-4">
					<div
						class="bg-foreground h-4 rounded-full transition-all duration-300"
						style="width: {progressPercentage}%"
					></div>
				</div>
				<div class="flex justify-between text-xs text-muted-foreground mt-1">
					<span>0%</span>
					<span>{Math.round(progressPercentage)}%</span>
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
			{#each savingsHistory as entry}
				<div class="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
					<div class="flex items-center gap-3">
						<div class="w-2 h-2 rounded-full bg-muted-foreground"></div>
						<div>
							<p class="font-medium">{entry.month}</p>
							<p class="text-sm text-muted-foreground">{entry.source}</p>
						</div>
					</div>
					<span class="font-bold text-lg">{formatCurrency(entry.amount)}</span>
				</div>
			{/each}
		</div>
	</div>

	<!-- Savings Tips -->
	<div class="rounded-lg border bg-card p-4">
		<h2 class="text-lg font-semibold mb-4">Savings Tips</h2>
		<div class="grid gap-4 md:grid-cols-2">
			{#each savingsTips as tip}
				<div class="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
					<div class="flex items-start justify-between mb-2">
						<h3 class="font-semibold">{tip.title}</h3>
						<span class="px-2 py-1 text-xs font-medium rounded bg-muted text-muted-foreground">
							{tip.category}
						</span>
					</div>
					<p class="text-sm text-muted-foreground">{tip.description}</p>
				</div>
			{/each}
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
				<span class="font-medium">{formatCurrency(savingsGoal * 0.25)}</span>
			</div>
			
			<div class="flex items-center justify-between p-3 border rounded-lg">
				<div class="flex items-center gap-3">
					<span class="text-lg">✅</span>
					<div>
						<p class="font-medium">50% Goal Reached</p>
						<p class="text-sm text-muted-foreground">Reached in June 2024</p>
					</div>
				</div>
				<span class="font-medium">{formatCurrency(savingsGoal * 0.5)}</span>
			</div>
			
			<div class="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
				<div class="flex items-center gap-3">
					<span class="text-lg">🎯</span>
					<div>
						<p class="font-medium">75% Goal (Current Target)</p>
						<p class="text-sm text-muted-foreground">Expected: October 2024</p>
					</div>
				</div>
				<span class="font-medium">{formatCurrency(savingsGoal * 0.75)}</span>
			</div>
			
			<div class="flex items-center justify-between p-3 border rounded-lg">
				<div class="flex items-center gap-3">
					<span class="text-lg">🏆</span>
					<div>
						<p class="font-medium">100% Goal Complete</p>
						<p class="text-sm text-muted-foreground">Expected: December 2024</p>
					</div>
				</div>
				<span class="font-medium">{formatCurrency(savingsGoal)}</span>
			</div>
		</div>
	</div>
</div>