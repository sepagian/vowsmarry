# CRUD Implementation Guide for VowsMarry

This guide provides comprehensive patterns and best practices for implementing CRUD (Create, Read, Update, Delete) functionality in the VowsMarry wedding planner application.

## Table of Contents

1. [Current Implementation Status](#current-implementation-status)
2. [Architecture Overview](#architecture-overview)
3. [Database Layer](#database-layer)
4. [Validation Layer](#validation-layer)
5. [Server Actions](#server-actions)
6. [UI Components](#ui-components)
7. [State Management](#state-management)
8. [Error Handling & Toasts](#error-handling--toasts)
9. [Complete CRUD Example](#complete-crud-example)
10. [Best Practices](#best-practices)
11. [Do's and Don'ts](#dos-and-donts)

## Current Implementation Status

### ✅ Implemented

- **Database Schema**: Complete Drizzle ORM schema with all entities
- **Validation Layer**: Comprehensive Zod schemas with custom validation
- **UI Components**: Form dialogs, data tables, and toast system
- **Authentication**: Supabase auth integration
- **Layout Data Loading**: Wedding data loaded in dashboard layout
- **File Upload Handling**: Basic file validation in document forms

### 🚧 Partially Implemented

- **Server Actions**: Basic structure exists but database operations are stubbed
- **Budget Validation**: New budget calculation schemas added (not yet in main validation index)
- **File Upload**: Basic file validation implemented in documents

### ❌ Not Yet Implemented

- **Actual CRUD Operations**: No server actions perform real database operations
- **Store Integration**: Stores still use mock data instead of database
- **Real-time Updates**: No optimistic updates or cache invalidation
- **Bulk Operations**: No batch CRUD functionality
- **Budget Module**: Budget calculation schemas exist but not integrated

## Architecture Overview

VowsMarry uses a modern SvelteKit architecture with the following layers:

```
┌─────────────────┐
│   UI Components │ ← Forms, Tables, Dialogs (✅ Complete)
├─────────────────┤
│  Server Actions │ ← CRUD Operations (🚧 Stubbed)
├─────────────────┤
│   Validation    │ ← Zod Schemas (✅ Complete)
├─────────────────┤
│   Database      │ ← Drizzle ORM + Supabase (✅ Complete)
├─────────────────┤
│   State Stores  │ ← Svelte Stores (❌ Mock Data)
└─────────────────┘
```

## Database Layer

### Schema Structure

All entities follow a consistent pattern with wedding-scoped data:

```typescript
// Core pattern for wedding-related tables
export const tasks = pgTable(
	'tasks',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		weddingId: uuid('wedding_id')
			.notNull()
			.references(() => weddings.id, { onDelete: 'cascade' }),
		// ... entity-specific fields
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull(),
	},
	(table) => ({
		weddingIdIdx: index('tasks_wedding_id_idx').on(table.weddingId),
		// ... additional indexes
	}),
);
```

### Available Entities

- **Tasks**: Wedding planning tasks with status, priority, due dates
- **Documents**: File uploads for paperwork, contracts, etc.
- **Expenses**: Budget tracking with categories and payment status
- **Vendors**: Vendor management with contact info and booking status
- **Rundowns**: Event timeline with scheduling
- **Savings**: Financial goal tracking
- **Dowry**: Cultural-specific financial tracking
- **Souvenirs**: Gift management
- **Dresscodes**: Attire planning per event
- **Invitations**: Digital invitation system
- **Guests**: RSVP and guest management
- **Gallery**: Photo/video uploads
- **Love Story**: Timeline content
- **Gifts**: Digital and registry gifts

### Database Operations

Use Drizzle ORM for type-safe database operations:

```typescript
import { db } from '$lib/server/db';
import { tasks } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';

// Create
const newTask = await db
	.insert(tasks)
	.values({
		weddingId: wedding.id,
		description: 'Book photographer',
		status: 'pending',
		priority: 'high',
		dueDate: new Date('2025-09-15'),
	})
	.returning();

// Read
const taskList = await db.query.tasks.findMany({
	where: eq(tasks.weddingId, wedding.id),
	orderBy: (tasks, { desc }) => [desc(tasks.createdAt)],
});

// Update
await db
	.update(tasks)
	.set({ status: 'completed', completedAt: new Date() })
	.where(eq(tasks.id, taskId));

// Delete
await db.delete(tasks).where(eq(tasks.id, taskId));
```

## Validation Layer

### Zod Schema Patterns

All forms use comprehensive Zod validation with custom error messages:

```typescript
export const taskFormSchema = z.object({
	description: z
		.string()
		.min(5, applyValidationMessage('task', 'description', 'minLength'))
		.max(1000, applyValidationMessage('task', 'description', 'maxLength'))
		.refine(
			(desc) => {
				const uniqueChars = new Set(desc.toLowerCase().replace(/\s/g, '')).size;
				return uniqueChars >= 3;
			},
			{ message: getErrorMessage('task', 'description', 'meaningful') },
		)
		.transform((desc) => desc.trim().charAt(0).toUpperCase() + desc.slice(1)),

	category: createEnumValidator('task', 'category', Object.keys(categoryEnum)),

	priority: createEnumValidator('task', 'priority', Object.keys(taskPriorityEnum)),

	status: createEnumValidator('task', 'status', Object.keys(taskStatusEnum)).default('pending'),

	date: createDateValidator('task', 'date', { required: true, future: true }),
});
```

### Validation Utilities

- `createStringValidator`: Text fields with length, sanitization
- `createNumberValidator`: Numeric fields with min/max, coercion
- `createEnumValidator`: Dropdown selections with type safety
- `createDateValidator`: Date fields with future/past validation
- `sanitizeText`/`sanitizeHtml`: XSS protection

## Server Actions

### Current State: Stubbed Actions

**Note**: Server actions currently have the correct structure but perform no actual database operations. They return the validated form data without saving to the database.

### Page Server Load Pattern (Not Yet Implemented)

```typescript
// Current implementation (stubbed)
export const load: PageServerLoad = async () => {
	const taskForm = await superValidate(zod4(taskFormSchema as any));
	return { taskForm };
};

// TODO: Implement actual data loading
export const load: PageServerLoad = async ({ parent }) => {
	const taskForm = await superValidate(zod4(taskFormSchema));
	const { wedding } = await parent();

	if (!wedding) {
		return { taskForm, tasks: [] };
	}

	const dbTasks = await db.query.tasks.findMany({
		where: eq(tasks.weddingId, wedding.id),
		orderBy: (tasks, { desc }) => [desc(tasks.createdAt)],
	});

	return { taskForm, tasks: dbTasks };
};
```

### Layout Data Loading (✅ Implemented)

The dashboard layout now properly loads wedding data:

```typescript
// src/routes/dashboard/+layout.server.ts
export const load: LayoutServerLoad = async ({ locals: { supabase } }) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(302, '/login');

  const userWedding = await db.query.weddings.findFirst({
    where: eq(weddings.userId, user.id),
  });

  return {
    user: { id: user.id, email: user.email, ... },
    wedding: userWedding || null,
    hasWeddingData: !!userWedding,
  };
};
```

### Form Actions Pattern (Not Yet Implemented)

**Current Implementation (Stubbed):**

```typescript
// Current stubbed actions
export const actions: Actions = {
	default: async ({ request }) => {
		const taskForm = await superValidate(request, zod4(taskFormSchema as any));
		return { taskForm };
	},
};
```

**TODO: Implement Real CRUD Actions:**

```typescript
export const actions: Actions = {
	create: async ({ request, parent }) => {
		const { wedding } = await parent();
		if (!wedding) return fail(403, { error: 'No wedding data found' });

		const form = await superValidate(request, zod4(taskFormSchema));
		if (!form.valid) return fail(400, { form });

		try {
			const newTask = await db
				.insert(tasks)
				.values({
					weddingId: wedding.id,
					description: form.data.description,
					category: form.data.category,
					priority: form.data.priority,
					status: form.data.status,
					dueDate: new Date(form.data.date),
				})
				.returning();

			return { form, success: true, task: newTask[0] };
		} catch (error) {
			console.error('Task creation error:', error);
			return fail(500, {
				form,
				error: 'Failed to create task. Please try again.',
			});
		}
	},

	update: async ({ request, parent }) => {
		const { wedding } = await parent();
		if (!wedding) return fail(403, { error: 'No wedding data found' });

		const form = await superValidate(
			request,
			zod4(
				taskFormSchema.extend({
					id: z.string().uuid(),
				}),
			),
		);
		if (!form.valid) return fail(400, { form });

		try {
			const updatedTask = await db
				.update(tasks)
				.set({
					description: form.data.description,
					category: form.data.category,
					priority: form.data.priority,
					status: form.data.status,
					dueDate: new Date(form.data.date),
					updatedAt: new Date(),
				})
				.where(and(eq(tasks.id, form.data.id), eq(tasks.weddingId, wedding.id)))
				.returning();

			if (updatedTask.length === 0) {
				return fail(404, { form, error: 'Task not found' });
			}

			return { form, success: true, task: updatedTask[0] };
		} catch (error) {
			console.error('Task update error:', error);
			return fail(500, {
				form,
				error: 'Failed to update task. Please try again.',
			});
		}
	},

	updateStatus: async ({ request, parent }) => {
		const { wedding } = await parent();
		if (!wedding) return fail(403, { error: 'No wedding data found' });

		const data = await request.formData();
		const taskId = data.get('id') as string;
		const newStatus = data.get('status') as TaskStatus;

		try {
			const updatedTask = await db
				.update(tasks)
				.set({
					status: newStatus,
					completedAt: newStatus === 'completed' ? new Date() : null,
					updatedAt: new Date(),
				})
				.where(and(eq(tasks.id, taskId), eq(tasks.weddingId, wedding.id)))
				.returning();

			if (updatedTask.length === 0) {
				return fail(404, { error: 'Task not found' });
			}

			return { success: true, task: updatedTask[0] };
		} catch (error) {
			console.error('Status update error:', error);
			return fail(500, {
				error: 'Failed to update task status.',
			});
		}
	},

	delete: async ({ request, parent }) => {
		const { wedding } = await parent();
		if (!wedding) return fail(403, { error: 'No wedding data found' });

		const data = await request.formData();
		const taskId = data.get('id') as string;

		try {
			const deletedTask = await db
				.delete(tasks)
				.where(and(eq(tasks.id, taskId), eq(tasks.weddingId, wedding.id)))
				.returning();

			if (deletedTask.length === 0) {
				return fail(404, { error: 'Task not found' });
			}

			return { success: true };
		} catch (error) {
			console.error('Task deletion error:', error);
			return fail(500, {
				error: 'Failed to delete task. Please try again.',
			});
		}
	},
};
```

## UI Components

### Form Dialog Pattern

```svelte
<!-- src/lib/components/dialog/dialog-task.svelte -->
<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index';
	import * as Form from '$lib/components/ui/form/index';
	import { superForm } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { CrudToasts } from '$lib/utils/crud-toasts';
	import { taskFormSchema } from '$lib/validation/index';

	let { data } = $props();

	const form = superForm(data.taskForm, {
		validators: zod4(taskFormSchema),
		onUpdate: ({ form: f }) => {
			if (f.valid) {
				CrudToasts.success('create', 'task', {
					itemName: f.data.description,
				});
			} else {
				FormToasts.emptyFormError();
			}
		},
		onError: () => {
			CrudToasts.error('create', 'An error occurred while saving the task', 'task');
		},
	});
</script>

<Dialog.Content class="sm:max-w-[425px]">
	<form
		use:enhance
		method="POST"
		class="flex flex-col gap-4 py-4"
	>
		<Dialog.Header>
			<Dialog.Title>Add New Task</Dialog.Title>
			<Dialog.Description>
				Write down what needs to be done for your wedding journey.
			</Dialog.Description>
		</Dialog.Header>

		<Form.Field
			{form}
			name="description"
		>
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Description</Form.Label>
					<Input
						{...props}
						bind:value={$formData.description}
					/>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<!-- Additional form fields -->

		<Dialog.Footer>
			<Form.Button>Add Task</Form.Button>
		</Dialog.Footer>
	</form>
</Dialog.Content>
```

### Data Table Pattern

```svelte
<!-- src/lib/components/table/task-table.svelte -->
<script lang="ts">
	import { createSvelteTable } from '$lib/components/ui/data-table/index';
	import TaskTableActions from './task-table-actions.svelte';
	import DialogTask from '../dialog/dialog-task.svelte';

	let { data } = $props();

	const columns = [
		{
			id: 'description',
			accessorKey: 'description',
			header: 'Task Description',
			cell: ({ row }) =>
				renderComponent(TaskTableDesc, {
					description: row.original.description,
					status: row.original.status,
				}),
		},
		{
			id: 'actions',
			cell: ({ row }) =>
				renderComponent(TaskTableActions, {
					status: row.original.status,
					onChange: async (newStatus) => {
						// Handle status update
						await updateTaskStatus(row.original.id, newStatus);
					},
				}),
		},
	];

	const table = createSvelteTable({
		data: data.tasks,
		columns,
		// Table configuration
	});
</script>

<div class="w-full px-4">
	<div class="flex items-center justify-between pb-4">
		<Input placeholder="Search tasks" />
		<Dialog.Root>
			<Dialog.Trigger class="btn-primary">
				<Plus class="w-4 h-4" />
				Add Task
			</Dialog.Trigger>
			<DialogTask {data} />
		</Dialog.Root>
	</div>

	<Table.Root>
		<Table.Header>
			{#each table.getHeaderGroups() as headerGroup}
				<Table.Row>
					{#each headerGroup.headers as header}
						<Table.Head>
							<FlexRender content={header.column.columnDef.header} />
						</Table.Head>
					{/each}
				</Table.Row>
			{/each}
		</Table.Header>
		<Table.Body>
			{#each table.getRowModel().rows as row}
				<Table.Row>
					{#each row.getVisibleCells() as cell}
						<Table.Cell>
							<FlexRender content={cell.column.columnDef.cell} />
						</Table.Cell>
					{/each}
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
```

## State Management

### Current State: Mock Data Stores

**Note**: All stores currently use mock data and are not connected to the database. They need to be updated to sync with server state.

### Current Store Pattern (Mock Data)

```typescript
// src/lib/stores/tasks.ts - CURRENT (Mock Data)
import { writable } from 'svelte/store';
import type { Task } from '$lib/types';

const initialTasks: Task[] = [
	{
		id: '1',
		title: 'Book guest accommodation',
		description: 'Reserve hotel rooms for out-of-town guests',
		category: 'accommodation',
		priority: 'high',
		status: 'pending',
		date: '2025-09-15',
	},
	// ... more mock data
];

export const tasksStore = writable<Task[]>(initialTasks);
```

### TODO: Implement Database-Backed Stores

```typescript
// TODO: Update stores to sync with database
import { writable } from 'svelte/store';
import type { Task } from '$lib/types';

// Start with empty array, populate from server
export const tasksStore = writable<Task[]>([]);

// Actions to sync with server state
export const taskActions = {
	// Load tasks from server data
	setTasks: (tasks: Task[]) => {
		tasksStore.set(tasks);
	},

	// Optimistic updates (update UI immediately, then sync with server)
	addTask: (task: Task) => {
		tasksStore.update((tasks) => [...tasks, task]);
	},

	updateTask: (id: string, updates: Partial<Task>) => {
		tasksStore.update((tasks) =>
			tasks.map((task) => (task.id === id ? { ...task, ...updates } : task)),
		);
	},

	removeTask: (id: string) => {
		tasksStore.update((tasks) => tasks.filter((task) => task.id !== id));
	},

	// Revert optimistic updates on error
	revertTaskUpdate: (id: string, originalTask: Task) => {
		tasksStore.update((tasks) => tasks.map((task) => (task.id === id ? originalTask : task)));
	},
};
```

## Error Handling & Toasts

### CRUD Toast System

```typescript
import { CrudToasts } from '$lib/utils/crud-toasts';

// Success messages
CrudToasts.success('create', 'task', {
	itemName: 'Book photographer',
	undoAction: () => undoCreate(taskId),
});

// Error messages with retry
CrudToasts.error('create', 'Network error occurred', 'task', {
	retryAction: () => retryCreate(),
	isNetworkError: true,
});

// Promise-based operations
const result = await CrudToasts.promise(createTask(formData), 'create', 'task', {
	itemName: formData.description,
	undoAction: () => undoCreate(result.id),
});
```

### Form Validation Toasts

```typescript
import FormToasts from '$lib/utils/form-toasts';

// Validation errors
FormToasts.validationError([
	{ field: 'description', message: 'Description is required' },
	{ field: 'date', message: 'Date must be in the future' },
]);

// Empty form error
FormToasts.emptyFormError({
	formName: 'Task Form',
	requiredFields: ['description', 'date'],
});
```

## Complete CRUD Example

Here's what needs to be implemented for a complete Tasks CRUD system:

### 1. Database Schema ✅ (Already implemented)

### 2. Validation Schema ✅ (Already implemented)

### 3. Server Actions 🚧 (Partially implemented - needs database operations)

**Current State:**

```typescript
// src/routes/dashboard/task/+page.server.ts - CURRENT
export const load: PageServerLoad = async () => {
	const taskForm = await superValidate(zod4(taskFormSchema as any));
	return { taskForm }; // No data loading
};

export const actions: Actions = {
	default: async ({ request }) => {
		const taskForm = await superValidate(request, zod4(taskFormSchema as any));
		return { taskForm }; // No database operations
	},
};
```

**TODO: Implement Complete Server Actions:**

```typescript
// src/routes/dashboard/task/+page.server.ts - TODO
import { and } from 'drizzle-orm';

export const load: PageServerLoad = async ({ parent }) => {
	const taskForm = await superValidate(zod4(taskFormSchema));
	const { wedding } = await parent();

	if (!wedding) {
		return { taskForm, tasks: [] };
	}

	const dbTasks = await db.query.tasks.findMany({
		where: eq(tasks.weddingId, wedding.id),
		orderBy: (tasks, { desc }) => [desc(tasks.createdAt)],
	});

	return { taskForm, tasks: dbTasks };
};

export const actions: Actions = {
	create: async ({ request, parent }) => {
		const { wedding } = await parent();
		if (!wedding) return fail(403, { error: 'No wedding data found' });

		const form = await superValidate(request, zod4(taskFormSchema));
		if (!form.valid) return fail(400, { form });

		try {
			const newTask = await db
				.insert(tasks)
				.values({
					weddingId: wedding.id,
					description: form.data.description,
					category: form.data.category,
					priority: form.data.priority,
					status: form.data.status,
					dueDate: new Date(form.data.date),
				})
				.returning();

			return { form, success: true, task: newTask[0] };
		} catch (error) {
			console.error('Task creation error:', error);
			return fail(500, {
				form,
				error: 'Failed to create task. Please try again.',
			});
		}
	},

	updateStatus: async ({ request, parent }) => {
		const { wedding } = await parent();
		if (!wedding) return fail(403, { error: 'No wedding data found' });

		const data = await request.formData();
		const taskId = data.get('id') as string;
		const newStatus = data.get('status') as TaskStatus;

		try {
			const updatedTask = await db
				.update(tasks)
				.set({
					status: newStatus,
					completedAt: newStatus === 'completed' ? new Date() : null,
					updatedAt: new Date(),
				})
				.where(and(eq(tasks.id, taskId), eq(tasks.weddingId, wedding.id)))
				.returning();

			if (updatedTask.length === 0) {
				return fail(404, { error: 'Task not found' });
			}

			return { success: true, task: updatedTask[0] };
		} catch (error) {
			console.error('Status update error:', error);
			return fail(500, {
				error: 'Failed to update task status.',
			});
		}
	},

	delete: async ({ request, parent }) => {
		const { wedding } = await parent();
		if (!wedding) return fail(403, { error: 'No wedding data found' });

		const data = await request.formData();
		const taskId = data.get('id') as string;

		try {
			const deletedTask = await db
				.delete(tasks)
				.where(and(eq(tasks.id, taskId), eq(tasks.weddingId, wedding.id)))
				.returning();

			if (deletedTask.length === 0) {
				return fail(404, { error: 'Task not found' });
			}

			return { success: true };
		} catch (error) {
			console.error('Task deletion error:', error);
			return fail(500, {
				error: 'Failed to delete task. Please try again.',
			});
		}
	},
};
```

### 4. UI Components ✅ (Already implemented)

### 5. State Management 🚧 (Needs database integration)

**Current State:**

```typescript
// Stores use mock data
export const tasksStore = writable<Task[]>(initialTasks);
```

**TODO: Update stores to sync with server:**

```typescript
// TODO: Connect stores to server data
export const tasksStore = writable<Task[]>([]);

export const taskActions = {
	setTasks: (tasks: Task[]) => tasksStore.set(tasks),
	// ... optimistic update methods
};
```

### 6. Page Integration 🚧 (Needs server response handling)

**Current State:**

```svelte
<!-- No server response handling -->
<script lang="ts">
	import TaskTable from '$lib/components/table/task-table.svelte';
	let { data } = $props();
</script>

<TaskTable {data} />
```

**TODO: Add server response handling:**

```svelte
<!-- src/routes/dashboard/task/+page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import TaskTable from '$lib/components/table/task-table.svelte';
	import { CrudToasts } from '$lib/utils/crud-toasts';

	let { data, form } = $props();

	// Handle form responses
	$effect(() => {
		if (form?.success) {
			if (form.task) {
				CrudToasts.success('create', 'task', {
					itemName: form.task.description,
				});
			}
			invalidateAll(); // Refresh page data
		} else if (form?.error) {
			CrudToasts.error('create', form.error, 'task');
		}
	});
</script>

<div class="container mx-auto py-8">
	<div class="flex items-center justify-between mb-8">
		<h1 class="text-3xl font-bold">Wedding Tasks</h1>
	</div>

	<TaskTable {data} />
</div>
```

### 4. UI Components (Already implemented)

### 5. Page Integration

```svelte
<!-- src/routes/dashboard/task/+page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import TaskTable from '$lib/components/table/task-table.svelte';
	import { CrudToasts } from '$lib/utils/crud-toasts';

	let { data, form } = $props();

	// Handle form responses
	$effect(() => {
		if (form?.success) {
			if (form.task) {
				CrudToasts.success('create', 'task', {
					itemName: form.task.description,
				});
			}
			invalidateAll();
		}
	});
</script>

<div class="container mx-auto py-8">
	<div class="flex items-center justify-between mb-8">
		<h1 class="text-3xl font-bold">Wedding Tasks</h1>
	</div>

	<TaskTable {data} />
</div>
```

## Implementation Roadmap

### Phase 1: Core CRUD Infrastructure ✅

- [x] Database schema with Drizzle ORM
- [x] Zod validation schemas
- [x] UI components (forms, tables, dialogs)
- [x] Toast notification system
- [x] Authentication and layout data loading

### Phase 2: Server Actions Implementation 🚧

- [ ] Implement actual database operations in server actions
- [ ] Add proper error handling and validation
- [ ] Implement wedding-scoped data access
- [ ] Add bulk operations support

### Phase 3: State Management Integration 🚧

- [ ] Connect stores to server data instead of mock data
- [ ] Implement optimistic updates
- [ ] Add cache invalidation after mutations
- [ ] Sync client and server state

### Phase 4: Advanced Features ❌

- [ ] Real-time updates with WebSockets
- [ ] Offline support with service workers
- [ ] Advanced search and filtering
- [ ] Data export/import functionality

## Best Practices

### 1. Database Design ✅

- Always include `weddingId` for multi-tenant isolation
- Use UUIDs for primary keys
- Add appropriate indexes for common queries
- Use enums for status fields
- Include `createdAt`/`updatedAt` timestamps
- Use foreign key constraints with cascade deletes

### 2. Validation ✅

- Validate all user inputs on both client and server
- Use descriptive error messages
- Sanitize text inputs to prevent XSS
- Validate date ranges and business logic
- Use enum validation for dropdowns

### 3. Server Actions 🚧 (Priority Implementation)

- **TODO**: Always validate form data before database operations
- **TODO**: Use proper error handling with try/catch
- **TODO**: Return meaningful error messages
- **TODO**: Use transactions for multi-table operations
- **TODO**: Invalidate cache after mutations
- **TODO**: Implement wedding-scoped data access with `and()` queries

### 4. UI/UX ✅

- Show loading states during operations
- Provide immediate feedback with toasts
- Use optimistic updates where appropriate
- Handle offline/network errors gracefully
- Implement undo functionality for destructive actions

### 5. State Management 🚧 (Priority Implementation)

- **TODO**: Keep stores simple and focused
- **TODO**: Use stores for client-side state only
- **TODO**: Sync with server state after operations
- **TODO**: Handle store updates in response to server actions
- **TODO**: Replace mock data with real database data

### 6. Error Handling ✅

- Distinguish between validation, network, and server errors
- Provide retry mechanisms for failed operations
- Log errors for debugging
- Show user-friendly error messages

## Do's and Don'ts

### ✅ Do's (Already Implemented)

- **Do** validate data on both client and server ✅
- **Do** use TypeScript for type safety ✅
- **Do** follow the established patterns for consistency ✅
- **Do** handle errors gracefully with user feedback ✅
- **Do** use the toast system for user feedback ✅
- **Do** follow the naming conventions (snake_case for DB, camelCase for TS) ✅
- **Do** add appropriate indexes for query performance ✅
- **Do** use the established UI component library ✅

### 🚧 Priority Implementation Tasks

- **Do** implement actual database operations in server actions
- **Do** add wedding-scoped data access with proper authorization
- **Do** connect stores to real database data instead of mock data
- **Do** implement proper loading and success states in server responses
- **Do** use transactions for related database operations
- **Do** add cache invalidation after mutations

### ❌ Don'ts (Current Issues to Avoid)

- **Don't** skip validation - always validate user inputs ✅
- **Don't** expose sensitive data in client-side code ✅
- **Don't** use direct database queries in components ✅
- **Don't** forget to handle loading and error states 🚧
- **Don't** implement custom CRUD logic when patterns exist 🚧
- **Don't** forget to update related data when deleting records 🚧
- **Don't** use stores for server state - use page data instead 🚧
- **Don't** hardcode magic strings - use enums and constants ✅
- **Don't** forget to sanitize user inputs ✅
- **Don't** implement complex business logic in components ✅

## Budget Module Integration

New budget calculation schemas have been added but need integration:

```typescript
// Found in tests but not in main validation index
export const budgetCalculationSchema = z.object({
	totalBudget: z.number(),
	totalSpent: z.number(),
	totalRemaining: z.number(),
	categories: z.array(
		z.object({
			name: z.string(),
			budgetAmount: z.number(),
			actualAmount: z.number(),
			description: z.string(),
		}),
	),
});

// TODO: Add to src/lib/validation/index.ts
// TODO: Implement budget CRUD operations
// TODO: Add budget UI components
```

## Next Steps

1. **Implement Server Actions**: Replace stubbed actions with real database operations
2. **Add Wedding Scoping**: Ensure all queries filter by `weddingId` for multi-tenant isolation
3. **Connect Stores**: Update stores to load from server data instead of mock data
4. **Add Response Handling**: Implement proper form response handling in page components
5. **Integrate Budget Module**: Add budget schemas to main validation and implement CRUD
6. **Test CRUD Operations**: Verify all create, read, update, delete operations work correctly
7. **Add Bulk Operations**: Implement batch operations for efficiency

## Example Implementation Order

1. **Tasks Module** (Start here - simplest entity)
   - Implement server actions for tasks
   - Connect task store to database
   - Add response handling

2. **Vendors Module** (Next - has relationships)
   - Implement vendor CRUD
   - Handle expense relationships

3. **Expenses Module** (Complex - has categories)
   - Implement expense CRUD
   - Handle category relationships

4. **Documents Module** (Special - file uploads)
   - Implement document CRUD
   - Add file upload handling

5. **Other Modules** (Rundowns, etc.)
   - Follow established patterns

## Summary

The VowsMarry codebase has a solid foundation with complete database schemas, validation, and UI components. The main gap is implementing actual CRUD operations in server actions and connecting stores to real data instead of mock data.

**Current Status**: 60% complete - Foundation is ready, implementation needed.

**Priority**: Focus on Phase 2 (Server Actions) and Phase 3 (State Management) to achieve full CRUD functionality.

**Testing**: Comprehensive test suites exist for validation - use them to ensure correctness.

**Architecture**: Well-designed layered architecture that supports all CRUD operations efficiently.

## Implementation Checklist

When implementing CRUD for a new entity:

1. ✅ Define database schema with proper relationships
2. ✅ Create Zod validation schemas
3. ✅ Implement server actions (load + CRUD operations)
4. ✅ Create form dialog component
5. ✅ Create table component with actions
6. ✅ Add toast messages for operations
7. ✅ Handle form responses in page component
8. ✅ Add proper error handling
9. ✅ Test all CRUD operations
10. ✅ Update navigation and routing if needed

## Common Patterns

### Bulk Operations

```typescript
// Server action for bulk delete
bulkDelete: async ({ request }) => {
	const data = await request.formData();
	const ids = JSON.parse(data.get('ids') as string);

	try {
		await db.delete(tasks).where(inArray(tasks.id, ids));
		return { success: true, deletedCount: ids.length };
	} catch (error) {
		return fail(500, { error: 'Failed to delete tasks' });
	}
};
```

### Optimistic Updates

```typescript
// Client-side optimistic update
const updateTaskStatus = async (taskId: string, newStatus: TaskStatus) => {
	// Optimistic update
	tasksStore.update((tasks) =>
		tasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)),
	);

	try {
		await updateTaskStatusAction(taskId, newStatus);
	} catch (error) {
		// Revert on error
		tasksStore.update((tasks) =>
			tasks.map((task) => (task.id === taskId ? { ...task, status: originalStatus } : task)),
		);
		CrudToasts.error('update', 'Failed to update status', 'task', {
			retryAction: () => updateTaskStatus(taskId, newStatus),
		});
	}
};
```

### Search and Filtering

```typescript
// Server-side search
const searchTasks = await db.query.tasks.findMany({
	where: and(
		eq(tasks.weddingId, wedding.id),
		or(ilike(tasks.description, `%${searchTerm}%`), eq(tasks.category, searchCategory)),
	),
	orderBy: sorting,
	limit: pageSize,
	offset: pageIndex * pageSize,
});
```

This guide provides a solid foundation for implementing CRUD functionality across all modules in the VowsMarry application. Follow these patterns to ensure consistency, maintainability, and a great user experience.
