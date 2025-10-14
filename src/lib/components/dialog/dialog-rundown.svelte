<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index';
	import * as Select from '$lib/components/ui/select/index';
	import * as Form from '$lib/components/ui/form/index';
	import { Input } from '$lib/components/ui/input/index';
	import { Textarea } from '$lib/components/ui/textarea/index';
	import { superForm } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { CrudToasts } from '$lib/utils/crud-toasts';
	import FormToasts from '$lib/utils/form-toasts';
	import { scheduleEventFormSchema, rundownCategorySchema } from '$lib/validation/index';

	let { data } = $props();

	const form = superForm(data.scheduleForm, {
		validators: zod4(scheduleEventFormSchema as any),
		onUpdate: ({ form: f }) => {
			if (f.valid) {
				// Use CRUD toast for successful rundown item creation
				const eventTitle = f.data.title || 'Rundown item';
				CrudToasts.success('create', 'rundown', { itemName: eventTitle });
			} else {
				FormToasts.emptyFormError();
			}
		},
		onError: ({ result }) => {
			// Use CRUD toast for server errors
			CrudToasts.error('create', 'An error occurred while saving the schedule event', 'rundown');
		},
	});
	const { form: formData, enhance } = form;

	const selectedCategory = $derived(
		$formData.category
			? rundownCategorySchema[$formData.category as keyof typeof rundownCategorySchema]
			: 'Choose category',
	);
</script>

<Dialog.Content class="sm:max-w-[425px] bg-neutral-100">
	<Dialog.Header>
		<Dialog.Title>Add Timeline Event</Dialog.Title>
		<Dialog.Description>
			<p>Add a new event to your wedding day timeline</p>
		</Dialog.Description>
	</Dialog.Header>
	<form
		method="POST"
		use:enhance
		class="flex flex-col gap-4 py-4"
	>
		<div class="flex flex-col gap-4">
			<div class="flex flex-row items-start justify-between gap-2">
				<Form.Field
					{form}
					name="title"
					class="flex flex-col items-start w-full gap-2"
				>
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Event Title</Form.Label>
							<Input
								{...props}
								type="text"
								placeholder="e.g. Ceremony"
								bind:value={$formData.title}
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors class="text-xs text-red-500" />
				</Form.Field>
				<Form.Field
					{form}
					name="category"
					class="flex flex-col w-full gap-2"
				>
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Category</Form.Label>
							<Select.Root
								type="single"
								bind:value={$formData.category}
								name={props.name}
							>
								<Select.Trigger
									{...props}
									class="w-full"
									aria-label="Rundown Category"
								>
									{selectedCategory}
								</Select.Trigger>
								<Select.Content>
									<Select.Group>
										{#each Object.entries(rundownCategorySchema) as [value, label] (label)}
											<Select.Item {value}>
												{label}
											</Select.Item>
										{/each}
									</Select.Group>
								</Select.Content>
							</Select.Root>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors class="text-xs text-red-500" />
				</Form.Field>
			</div>
			<Form.Field
				{form}
				name="description"
			>
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Description (Optional)</Form.Label>
						<Textarea
							{...props}
							placeholder="Add details or notes (optional)"
							bind:value={$formData.description}
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors class="text-xs text-red-500" />
			</Form.Field>
			<div class="flex flex-row items-start justify-between gap-2">
				<Form.Field
					{form}
					name="startTime"
					class="flex flex-col items-start w-full gap-2"
				>
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Start Time</Form.Label>
							<Input
								{...props}
								type="time"
								bind:value={$formData.startTime}
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors class="text-xs text-red-500" />
				</Form.Field>
				<Form.Field
					{form}
					name="endTime"
					class="flex flex-col items-start w-full gap-2"
				>
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>End Time</Form.Label>
							<Input
								{...props}
								type="time"
								bind:value={$formData.endTime}
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors class="text-xs text-red-500" />
				</Form.Field>
			</div>
			<div class="flex flex-row items-start justify-between gap-2">
				<Form.Field
					{form}
					name="location"
					class="flex flex-col items-start w-full gap-2"
				>
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Location</Form.Label>
							<Input
								{...props}
								placeholder="e.g. Main Hall, Garden"
								bind:value={$formData.location}
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors class="text-xs text-red-500" />
				</Form.Field>
				<Form.Field
					{form}
					name="responsible"
					class="flex flex-col items-start w-full gap-2"
				>
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Responsible Person</Form.Label>
							<Input
								{...props}
								placeholder="e.g. Wedding Planner, Best Man"
								bind:value={$formData.responsible}
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors class="text-xs text-red-500" />
				</Form.Field>
			</div>
		</div>
		<Dialog.Footer>
			<Form.Button type="submit">Add New Event</Form.Button>
		</Dialog.Footer>
	</form>
</Dialog.Content>
