<script lang="ts">
	// Dummy todo data
	const todos = [
		{
			id: 1,
			title: 'Book wedding photographer',
			description: 'Research and book a professional wedding photographer',
			status: 'completed',
			dueDate: '2024-08-20',
			assignedTo: 'Sarah',
			category: 'Photography'
		},
		{
			id: 2,
			title: 'Order wedding invitations',
			description: 'Design and order wedding invitations for 200 guests',
			status: 'in-progress',
			dueDate: '2024-09-01',
			assignedTo: 'John',
			category: 'Invitations'
		},
		{
			id: 3,
			title: 'Finalize catering menu',
			description: 'Choose final menu options and confirm guest count',
			status: 'overdue',
			dueDate: '2024-08-25',
			assignedTo: 'Sarah',
			category: 'Catering'
		},
		{
			id: 4,
			title: 'Book makeup artist',
			description: 'Schedule trial and book makeup artist for wedding day',
			status: 'pending',
			dueDate: '2024-09-10',
			assignedTo: 'Sarah',
			category: 'Beauty'
		},
		{
			id: 5,
			title: 'Reserve transportation',
			description: 'Book wedding car or limousine service',
			status: 'pending',
			dueDate: '2024-09-15',
			assignedTo: 'John',
			category: 'Transportation'
		},
		{
			id: 6,
			title: 'Order wedding cake',
			description: 'Finalize cake design and place order',
			status: 'in-progress',
			dueDate: '2024-10-01',
			assignedTo: 'Sarah',
			category: 'Catering'
		}
	];

	const taskStats = {
		total: todos.length,
		completed: todos.filter(t => t.status === 'completed').length,
		inProgress: todos.filter(t => t.status === 'in-progress').length,
		pending: todos.filter(t => t.status === 'pending').length,
		overdue: todos.filter(t => t.status === 'overdue').length
	};

	function getStatusIcon(status: string) {
		switch (status) {
			case 'completed':
				return '✓';
			case 'in-progress':
				return '⏳';
			case 'overdue':
				return '⚠️';
			default:
				return '○';
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
			{#each todos as todo}
				<div class="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
					<div class="flex items-center justify-center w-6 h-6 rounded border">
						<span class="text-sm">{getStatusIcon(todo.status)}</span>
					</div>
					
					<div class="flex-1 min-w-0">
						<div class="flex items-start justify-between mb-2">
							<div>
								<h3 class="font-medium">{todo.title}</h3>
								<p class="text-sm text-muted-foreground mt-1">{todo.description}</p>
							</div>
							<span class="px-2 py-1 text-xs font-medium rounded bg-muted text-muted-foreground ml-4">
								{todo.status}
							</span>
						</div>
						
						<div class="flex items-center gap-4 text-sm text-muted-foreground">
							<div class="flex items-center gap-1">
								<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
								</svg>
								<span>Due: {todo.dueDate}</span>
							</div>
							
							<div class="flex items-center gap-1">
								<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
								</svg>
								<span>Assigned to: {todo.assignedTo}</span>
							</div>
							
							<div class="flex items-center gap-1">
								<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
								</svg>
								<span>{todo.category}</span>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Quick Add Task -->
	<div class="rounded-lg border bg-card p-4">
		<h3 class="text-lg font-semibold mb-3">Quick Add Task</h3>
		<div class="grid gap-3 md:grid-cols-2">
			<div>
				<label class="text-sm font-medium text-muted-foreground">Task Title</label>
				<input type="text" placeholder="Enter task title..." class="w-full mt-1 px-3 py-2 border rounded-lg bg-background" />
			</div>
			<div>
				<label class="text-sm font-medium text-muted-foreground">Due Date</label>
				<input type="date" class="w-full mt-1 px-3 py-2 border rounded-lg bg-background" />
			</div>
			<div>
				<label class="text-sm font-medium text-muted-foreground">Assign To</label>
				<select class="w-full mt-1 px-3 py-2 border rounded-lg bg-background">
					<option>Sarah</option>
					<option>John</option>
					<option>Both</option>
				</select>
			</div>
			<div>
				<label class="text-sm font-medium text-muted-foreground">Category</label>
				<select class="w-full mt-1 px-3 py-2 border rounded-lg bg-background">
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