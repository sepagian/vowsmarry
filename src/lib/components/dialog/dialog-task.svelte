<script lang="ts">
	import { superForm } from "sveltekit-superforms";
	import { valibot } from "sveltekit-superforms/adapters";

	import {
		DialogContent,
		DialogDescription,
		DialogFooter,
		DialogHeader,
		DialogTitle,
	} from "$lib/components/ui/dialog/index";
	import {
		FormButton,
		FormControl,
		FormField,
		FormFieldErrors,
		FormLabel,
	} from "$lib/components/ui/form/index";
	import { Input } from "$lib/components/ui/input/index";
	import {
		Select,
		SelectContent,
		SelectItem,
		SelectTrigger,
	} from "$lib/components/ui/select/index";

	import { InvalidationService } from "$lib/utils/invalidation-helpers";
	import { CrudToasts, FormToasts } from "$lib/utils/toasts";
	import {
		categoryEnum,
		taskPriorityEnum,
		taskSchema,
		taskStatusEnum,
	} from "$lib/validation/planner";

	let { data, open = $bindable() } = $props();

	const form = superForm(data.taskForm, {
		validators: valibot(taskSchema),
		resetForm: true,
		onResult: async ({ result }) => {
			if (result.type === "success") {
				const taskName = $formData.taskDescription || "Task";
				CrudToasts.success("create", "task", { itemName: taskName });
				await InvalidationService.invalidateTask();
				open = false;
			} else if (result.type === "failure") {
				FormToasts.emptyFormError();
			} else if (result.type === "error") {
				CrudToasts.error(
					"create",
					"An error occurred while saving the task",
					"task"
				);
			}
		},
	});
	const { form: formData, enhance } = form;

	const selectedCategory = $derived(
		$formData.taskCategory
			? categoryEnum.find((c) => c.value === $formData.taskCategory)?.label
			: "Choose category"
	);

	const selectedPriority = $derived(
		$formData.taskPriority
			? taskPriorityEnum.find((p) => p.value === $formData.taskPriority)?.label
			: "Select priority"
	);

	const selectedStatus = $derived(
		$formData.taskStatus
			? taskStatusEnum.find((s) => s.value === $formData.taskStatus)?.label
			: "Select task status"
	);
</script>

<DialogContent class="sm:max-w-[425px]">
	<form
		use:enhance
		method="POST"
		action="?/createTask"
		class="flex flex-col gap-4"
		onsubmit={(e) => {
			if (!$formData.valid) {
				e.preventDefault();
			}
		}}
	>
		<DialogHeader>
			<DialogTitle>Add New Task</DialogTitle>
			<DialogDescription>
				<p>Write down what needs to be done for your wedding journey.</p>
			</DialogDescription>
		</DialogHeader>
		<FormField {form} name="taskDescription">
			<FormControl>
				{#snippet children({ props })}
					<FormLabel>Description</FormLabel>
					<Input
						{...props}
						type="text"
						bind:value={$formData.taskDescription}
					/>
				{/snippet}
			</FormControl>
			<FormFieldErrors class="text-xs text-red-500"/>
		</FormField>
		<FormField {form} name="taskCategory">
			<FormControl>
				{#snippet children({ props })}
					<FormLabel>Category</FormLabel>
					<Select
						type="single"
						bind:value={$formData.taskCategory}
						name={props.name}
					>
						<SelectTrigger {...props} class="w-full">
							{selectedCategory}
						</SelectTrigger>
						<SelectContent>
							{#each categoryEnum as option (option.value)}
								<SelectItem value={option.value}>
									{option.label}
								</SelectItem>
							{/each}
						</SelectContent>
					</Select>
				{/snippet}
			</FormControl>
			<FormFieldErrors/>
		</FormField>
		<div class="flex w-full gap-4">
			<FormField {form} name="taskPriority" class="flex flex-col w-full">
				<FormControl>
					{#snippet children({ props })}
						<FormLabel>Priority</FormLabel>
						<Select
							type="single"
							bind:value={$formData.taskPriority}
							name={props.name}
						>
							<SelectTrigger {...props} class="flex w-full">
								{selectedPriority}
							</SelectTrigger>
							<SelectContent>
								{#each taskPriorityEnum as option (option.value)}
									<SelectItem value={option.value}>
										{option.label}
									</SelectItem>
								{/each}
							</SelectContent>
						</Select>
					{/snippet}
				</FormControl>
				<FormFieldErrors/>
			</FormField>
			<FormField {form} name="taskStatus" class="flex flex-col w-full">
				<FormControl>
					{#snippet children({ props })}
						<FormLabel>Status</FormLabel>
						<Select
							type="single"
							bind:value={$formData.taskStatus}
							name={props.name}
						>
							<SelectTrigger {...props} class="flex w-full">
								{selectedStatus}
							</SelectTrigger>
							<SelectContent>
								{#each taskStatusEnum as option (option.value)}
									<SelectItem value={option.value}>
										{option.label}
									</SelectItem>
								{/each}
							</SelectContent>
						</Select>
					{/snippet}
				</FormControl>
				<FormFieldErrors/>
			</FormField>
		</div>

		<FormField {form} name="taskDueDate">
			<FormControl>
				{#snippet children({ props })}
					<FormLabel>Date</FormLabel>
					<Input {...props} type="date" bind:value={$formData.taskDueDate} />
				{/snippet}
			</FormControl>
			<FormFieldErrors class="text-xs text-red-500"/>
		</FormField>
		<DialogFooter>
			<FormButton>Add Task</FormButton>
		</DialogFooter>
	</form>
</DialogContent>
