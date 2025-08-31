<script lang="ts">
	let { data } = $props();

	// Calculate days until wedding
	const weddingDate = data.wedding?.weddingDate ? new Date(data.wedding.weddingDate) : null;
	const daysUntilWedding = weddingDate
		? Math.ceil((weddingDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
		: null;

	const budgetData = {
		total: data.stats.budget.total,
		spent: data.stats.budget.spent,
		remaining: data.stats.budget.remaining
	};

	const taskStats = {
		completed: data.stats.todos.done,
		pending: data.stats.todos.todo + data.stats.todos.inProgress,
		overdue: 0 // We could calculate this based on due dates
	};

	const vendorStats = {
		booked: data.stats.vendors.booked,
		contacted: data.stats.vendors.contacted,
		pending: data.stats.vendors.total - data.stats.vendors.booked - data.stats.vendors.contacted
	};

	function formatCurrency(amount: number) {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(amount);
	}

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('id-ID');
	}

	function getStatusColor(status: string | null) {
		if (!status) return 'bg-gray-100 text-gray-800';

		switch (status) {
			case 'done':
			case 'completed':
			case 'approved':
				return 'bg-green-100 text-green-800';
			case 'in_progress':
				return 'bg-blue-100 text-blue-800';
			case 'todo':
			case 'pending':
				return 'bg-yellow-100 text-yellow-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}
</script>

<div class="flex flex-1 flex-col gap-4 p-4 min-h-[calc(100vh-3rem)]">
	<!-- Header Section -->
	<div class="flex flex-col gap-2">
		<h1 class="text-2xl font-semibold">Welcome back, {data.user.firstName}!</h1>
		<p class="text-muted-foreground">
			{#if data.wedding}
				Planning your wedding with {data.wedding.partnerName || 'your partner'}
				{#if weddingDate}
					- {daysUntilWedding} days to go!
				{/if}
			{:else}
				Let's start planning your perfect wedding!
			{/if}
		</p>
	</div>

	<!-- Key Stats -->
	<div class="grid gap-4 md:grid-cols-4">
		<!-- Days Until Wedding -->
		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium text-muted-foreground">Days Until Wedding</p>
					<p class="text-2xl font-bold">
						{#if daysUntilWedding !== null}
							{daysUntilWedding}
						{:else}
							<span class="text-muted-foreground text-base">Not set</span>
						{/if}
					</p>
				</div>
				<div class="text-muted-foreground">
					<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
							clip-rule="evenodd"
						/>
					</svg>
				</div>
			</div>
		</div>

		<!-- Budget Overview -->
		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-3">
				<p class="text-sm font-medium text-muted-foreground">Budget Progress</p>
				<div class="text-muted-foreground">
					<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
						<path
							d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
						/>
					</svg>
				</div>
			</div>
			<div class="space-y-2">
				<div class="flex justify-between text-sm">
					<span class="text-muted-foreground">Spent</span>
					<span class="font-medium">{formatCurrency(budgetData.spent)}</span>
				</div>
				<div class="w-full bg-muted rounded-full h-2">
					<div
						class="bg-foreground h-2 rounded-full"
						style="width: {budgetData.total > 0 ? (budgetData.spent / budgetData.total) * 100 : 0}%"
					></div>
				</div>
				<div class="flex justify-between text-xs text-muted-foreground">
					<span>Total: {formatCurrency(budgetData.total)}</span>
					<span
						>{budgetData.total > 0
							? Math.round((budgetData.spent / budgetData.total) * 100)
							: 0}%</span
					>
				</div>
			</div>
		</div>

		<!-- Task Progress -->
		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-3">
				<p class="text-sm font-medium text-muted-foreground">Tasks</p>
				<div class="text-muted-foreground">
					<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
							clip-rule="evenodd"
						/>
					</svg>
				</div>
			</div>
			<div class="space-y-2">
				<div class="flex justify-between items-center">
					<span class="text-2xl font-bold">{taskStats.completed}</span>
					<span class="text-sm text-muted-foreground">completed</span>
				</div>
				<div class="flex justify-between text-sm text-muted-foreground">
					<span>{taskStats.pending} pending</span>
					<span>{taskStats.overdue} overdue</span>
				</div>
			</div>
		</div>

		<!-- Vendor Status -->
		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-3">
				<p class="text-sm font-medium text-muted-foreground">Vendors</p>
				<div class="text-muted-foreground">
					<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
						<path
							d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"
						/>
					</svg>
				</div>
			</div>
			<div class="space-y-2">
				<div class="flex justify-between items-center">
					<span class="text-2xl font-bold">{vendorStats.booked}</span>
					<span class="text-sm text-muted-foreground">booked</span>
				</div>
				<div class="flex justify-between text-sm text-muted-foreground">
					<span>{vendorStats.contacted} contacted</span>
					<span>{vendorStats.pending} pending</span>
				</div>
			</div>
		</div>
	</div>

	<!-- Main Content Grid -->
	<div class="grid gap-4 lg:grid-cols-3">
		<!-- Recent Tasks -->
		<div class="lg:col-span-2 rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-4">
				<h2 class="text-lg font-semibold">Recent Tasks</h2>
				<a href="/dashboard/todo" class="text-sm font-medium hover:underline">View all</a>
			</div>
			<div class="space-y-3">
				{#if data.recentTasks.length > 0}
					{#each data.recentTasks as task}
						<div
							class="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
						>
							<div class="flex items-center gap-3">
								<div class="w-2 h-2 rounded-full bg-muted-foreground"></div>
								<div>
									<p class="font-medium">{task.title}</p>
									{#if task.dueDate}
										<p class="text-sm text-muted-foreground">Due: {formatDate(task.dueDate.toISOString())}</p>
									{/if}
								</div>
							</div>
							<span
								class="px-2 py-1 text-xs font-medium rounded {getStatusColor(
									task.status || 'todo'
								)}"
							>
								{(task.status || 'todo').replace('_', ' ')}
							</span>
						</div>
					{/each}
				{:else}
					<div class="text-center py-8 text-muted-foreground">
						<p>No tasks yet. Start by adding your first task!</p>
					</div>
				{/if}
			</div>
		</div>

		<!-- Upcoming Deadlines -->
		<div class="rounded-lg border bg-card p-4">
			<h2 class="text-lg font-semibold mb-4">Upcoming Deadlines</h2>
			<div class="space-y-3 max-h-80 overflow-y-scroll">
				{#if data.upcomingDeadlines.length > 0}
					{#each data.upcomingDeadlines as deadline}
						<div class="flex items-start gap-3 p-3 border rounded-lg">
							<div class="w-2 h-2 rounded-full bg-muted-foreground mt-2"></div>
							<div class="flex-1">
								<p class="font-medium text-sm">{deadline.title}</p>
								<p class="text-xs text-muted-foreground">{formatDate(deadline.date.toISOString())}</p>
								<div class="flex gap-2 mt-1">
									<span
										class="inline-block px-2 py-0.5 text-xs font-medium bg-muted text-muted-foreground rounded"
									>
										{deadline.type}
									</span>
									<span
										class="inline-block px-2 py-0.5 text-xs font-medium rounded {getStatusColor(
											deadline.status
										)}"
									>
										{(deadline.status || 'unknown').replace('_', ' ')}
									</span>
								</div>
							</div>
						</div>
					{/each}
				{:else}
					<div class="text-center py-8 text-muted-foreground">
						<p>No upcoming deadlines</p>
					</div>
				{/if}
			</div>
		</div>
	</div>

	<!-- Quick Actions -->
	<div class="rounded-lg border bg-card p-4">
		<h2 class="text-lg font-semibold mb-4">Quick Actions</h2>
		<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
			<a
				href="/dashboard/todo"
				class="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
			>
				<div class="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
					<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
							clip-rule="evenodd"
						/>
					</svg>
				</div>
				<div>
					<p class="font-medium">Add Task</p>
					<p class="text-sm text-muted-foreground">Create new to-do</p>
				</div>
			</a>

			<a
				href="/dashboard/vendor"
				class="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
			>
				<div class="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
					<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
						<path
							d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"
						/>
					</svg>
				</div>
				<div>
					<p class="font-medium">Find Vendors</p>
					<p class="text-sm text-muted-foreground">Browse suppliers</p>
				</div>
			</a>

			<a
				href="/dashboard/budget"
				class="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
			>
				<div class="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
					<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
						<path
							d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
						/>
					</svg>
				</div>
				<div>
					<p class="font-medium">Update Budget</p>
					<p class="text-sm text-muted-foreground">Track expenses</p>
				</div>
			</a>

			<a
				href="/dashboard/rundown"
				class="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
			>
				<div class="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
					<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
							clip-rule="evenodd"
						/>
					</svg>
				</div>
				<div>
					<p class="font-medium">Plan Timeline</p>
					<p class="text-sm text-muted-foreground">Event schedule</p>
				</div>
			</a>
		</div>
	</div>
</div>
