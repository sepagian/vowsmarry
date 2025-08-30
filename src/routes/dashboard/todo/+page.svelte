<script lang="ts">
	let { data } = $props();

	const todos = data.todos;
	const taskStats = data.taskStats;

	function getStatusIcon(status: string | null) {
		switch (status) {
			case 'done':
				return '✓';
			case 'in_progress':
				return '⏳';
			case 'todo':
				return '○';
			default:
				return '○';
		}
	}

	function formatDate(dateString: string | null) {
		if (!dateString) return 'No due date';
		return new Date(dateString).toLocaleDateString('id-ID');
	}

	function isOverdue(dueDate: string | null, status: string | null) {
		if (!dueDate || status === 'done') return false;
		const today = new Date().toISOString().split('T')[0];
		return dueDate < today;
	}

	function getStatusColor(status: string | null) {
		if (!status) return 'bg-gray-100 text-gray-800';
		switch (status) {
			case 'done':
				return 'bg-green-100 text-green-800';
			case 'in_progress':
				return 'bg-blue-100 text-blue-800';
			case 'todo':
				return 'bg-yellow-100 text-yellow-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}
</script>

<div class="flex flex-1 flex-col gap-4 p-4">
	<!-- Header -->
	<div class="flex flex-col gap-2">
		<h1 class="text-2xl font-semibold">To-Do List</h1>
		<p class="text-muted-foreground">Manage your wedding planning tasks and stay organized.</p>
	</div>

	<!-- Task Statistics -->
	<div class="grid gap-4 md:grid-cols-4">
		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Total Tasks</p>
				<svg class="w-5 h-5 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
					<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
			</div>
			<p class="text-2xl font-bold">{taskStats.total}</p>
		</div>

		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Completed</p>
				<span class="text-lg">✓</span>
			</div>
			<p class="text-2xl font-bold">{taskStats.completed}</p>
			<p class="text-sm text-muted-foreground">{Math.round((taskStats.completed / taskStats.total) * 100)}% done</p>
		</div>

		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">In Progress</p>
				<span class="text-lg">⏳</span>
			</div>
			<p class="text-2xl font-bold">{taskStats.inProgress}</p>
		</div>

		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Overdue</p>
				<span class="text-lg">⚠️</span>
			</div>
			<p class="text-2xl font-bold">{taskStats.overdue}</p>
		</div>
	</div>

	<!-- Task List -->
	<div class="rounded-lg border bg-card p-4">
		<div class="flex items-center justify-between mb-4">
			<h2 class="text-lg font-semibold">All Tasks</h2>
			<div class="flex gap-2">
				<button class="text-sm font-medium hover:underline">Filter</button>
				<button class="text-sm font-medium hover:underline">Add Task</button>
			</div>
		</div>

		<div class="space-y-3">
			{#if todos.length > 0}
				{#each todos as todo}
					<div class="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
						<div class="flex items-center justify-center w-6 h-6 rounded border">
							<span class="text-sm">{getStatusIcon(todo.status)}</span>
						</div>
						
						<div class="flex-1 min-w-0">
							<div class="flex items-start justify-between mb-2">
								<div>
									<h3 class="font-medium">{todo.title}</h3>
									{#if todo.description}
										<p class="text-sm text-muted-foreground mt-1">{todo.description}</p>
									{/if}
								</div>
								<span class="px-2 py-1 text-xs font-medium rounded {getStatusColor(todo.status)} ml-4">
									{(todo.status || 'todo').replace('_', ' ')}
								</span>
							</div>
							
							<div class="flex items-center gap-4 text-sm text-muted-foreground">
								<div class="flex items-center gap-1">
									<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
									</svg>
									<span class="{isOverdue(todo.dueDate, todo.status) ? 'text-red-600 font-medium' : ''}">
										Due: {formatDate(todo.dueDate)}
										{#if isOverdue(todo.dueDate, todo.status)}
											(Overdue)
										{/if}
									</span>
								</div>
								
								{#if todo.assignedToName}
									<div class="flex items-center gap-1">
										<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
											<path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
										</svg>
										<span>Assigned to: {todo.assignedToName}</span>
									</div>
								{/if}
								
								{#if todo.priority}
									<div class="flex items-center gap-1">
										<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
											<path fill-rule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
										</svg>
										<span class="capitalize">{todo.priority} priority</span>
									</div>
								{/if}
							</div>
						</div>
					</div>
				{/each}
			{:else}
				<div class="text-center py-8 text-muted-foreground">
					<p>No tasks yet. Start by adding your first task!</p>
				</div>
			{/if}
		</div>
	</div>

	<!-- Quick Add Task -->
	<div class="rounded-lg border bg-card p-4">
		<h3 class="text-lg font-semibold mb-3">Quick Add Task</h3>
		<div class="grid gap-3 md:grid-cols-2">
			<div>
				<label for="task-title" class="text-sm font-medium text-muted-foreground">Task Title</label>
				<input id="task-title" type="text" placeholder="Enter task title..." class="w-full mt-1 px-3 py-2 border rounded-lg bg-background" />
			</div>
			<div>
				<label for="task-due-date" class="text-sm font-medium text-muted-foreground">Due Date</label>
				<input id="task-due-date" type="date" class="w-full mt-1 px-3 py-2 border rounded-lg bg-background" />
			</div>
			<div>
				<label for="task-assign-to" class="text-sm font-medium text-muted-foreground">Assign To</label>
				<select id="task-assign-to" class="w-full mt-1 px-3 py-2 border rounded-lg bg-background">
					<option>Sarah</option>
					<option>John</option>
					<option>Both</option>
				</select>
			</div>
			<div>
				<label for="task-category" class="text-sm font-medium text-muted-foreground">Category</label>
				<select id="task-category" class="w-full mt-1 px-3 py-2 border rounded-lg bg-background">
					<option>Venue</option>
					<option>Catering</option>
					<option>Photography</option>
					<option>Decoration</option>
					<option>Other</option>
				</select>
			</div>
		</div>
		<button class="mt-3 px-4 py-2 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors">
			Add Task
		</button>
	</div>
</div>