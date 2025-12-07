<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index';
	import * as Select from '$lib/components/ui/select/index';
	import * as Form from '$lib/components/ui/form/index';
	import { Input } from '$lib/components/ui/input/index';
	import { Textarea } from '$lib/components/ui/textarea/index';
	import { superForm } from 'sveltekit-superforms';
	import { valibot } from 'sveltekit-superforms/adapters';
	import { CrudToasts, FormToasts } from '$lib/utils/toasts';
	import { scheduleSchema, scheduleCategoryEnum } from '$lib/validation/planner';
	import { InvalidationService } from '$lib/utils/invalidation-helpers';

	let { data, open = $bindable() } = $props();

	const form = superForm(data.scheduleForm, {
		validators: valibot(scheduleSchema),
		resetForm: true,
		onResult: async ({ result }) => {
			if (result.type === 'success') {
				const eventTitle = $formData.scheduleName || 'Rundown item';
				CrudToasts.success('create', 'rundown', { itemName: eventTitle });
				await InvalidationService.invalidateRundown();
				open = false;
			} else if (result.type === 'failure') {
				FormToasts.emptyFormError();
			} else if (result.type === 'error') {
				CrudToasts.error('create', 'An error occurred while saving the schedule event', 'rundown');
			}
		},
	});
	const { form: formData, enhance } = form;

	const selectedCategory = $derived(
		$formData.scheduleCategory
			? scheduleCategoryEnum.find((c) => c.value === $formData.scheduleCategory)?.label
			: 'Choose category',
	);
</script>

<Dialog.Content class="sm:max-w-[425px]">
	<Dialog.Header>
		<Dialog.Title>Add Timeline Event</Dialog.Title>
		<Dialog.Description>
			<p>Add a new event to your wedding day timeline</p>
		</Dialog.Description>
	</Dialog.Header>
	<form
		method="POST"
		use:enhance
		action="?/createSchedule"
		class="flex flex-col gap-4"
		onsubmit={(e) => {
			if (!$formData.valid) {
				e.preventDefault();
			}
		}}
	>
		<div class="flex flex-col gap-4">
			<div class="flex flex-row items-start justify-between gap-2">
				<Form.Field
					{form}
					name="scheduleName"
					class="flex flex-col items-start w-full gap-2"
				>
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Event Title</Form.Label>
							<Input
								{...props}
								type="text"
								placeholder="e.g. Ceremony"
								bind:value={$formData.scheduleName}
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors class="text-xs text-red-500" />
				</Form.Field>
				<Form.Field
					{form}
					name="scheduleCategory"
					class="flex flex-col w-full gap-2"
				>
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Category</Form.Label>
							<Select.Root
								type="single"
								bind:value={$formData.scheduleCategory}
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
										{#each scheduleCategoryEnum as option (option.value)}
											<Select.Item value={option.value}>
												{option.label}
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
				name="scheduleNotes"
			>
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Description (Optional)</Form.Label>
						<Textarea
							{...props}
							placeholder="Add details or notes (optional)"
							bind:value={$formData.scheduleNotes}
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors class="text-xs text-red-500" />
			</Form.Field>
			<div class="flex flex-row items-start justify-between gap-2">
				<Form.Field
					{form}
					name="scheduleStartTime"
					class="flex flex-col items-start w-full gap-2"
				>
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Start Time</Form.Label>
							<Input
								{...props}
								type="time"
								bind:value={$formData.scheduleStartTime}
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors class="text-xs text-red-500" />
				</Form.Field>
				<Form.Field
					{form}
					name="scheduleEndTime"
					class="flex flex-col items-start w-full gap-2"
				>
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>End Time</Form.Label>
							<Input
								{...props}
								type="time"
								bind:value={$formData.scheduleEndTime}
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors class="text-xs text-red-500" />
				</Form.Field>
			</div>
			<div class="flex flex-row items-start justify-between gap-2">
				<Form.Field
					{form}
					name="scheduleLocation"
					class="flex flex-col items-start w-full gap-2"
				>
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Location</Form.Label>
							<Input
								{...props}
								placeholder="e.g. Main Hall, Garden"
								bind:value={$formData.scheduleLocation}
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors class="text-xs text-red-500" />
				</Form.Field>
				<Form.Field
					{form}
					name="scheduleAttendees"
					class="flex flex-col items-start w-full gap-2"
				>
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Attendees</Form.Label>
							<Input
								{...props}
								placeholder="e.g. Wedding Planner, Best Man"
								bind:value={$formData.scheduleAttendees}
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
