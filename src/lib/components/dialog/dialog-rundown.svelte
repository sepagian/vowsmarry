<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index';
	import * as Select from '$lib/components/ui/select/index';
	import { Button } from '$lib/components/ui/button/index';
	import { Input } from '$lib/components/ui/input/index';
	import { Label } from '$lib/components/ui/label/index';
	import { Textarea } from '$lib/components/ui/textarea/index';
	import { rundownCategoryOptions } from '$lib/constants/constants';

	let title = $state('');
	let categoryValue = $state('');
	let description = $state('');
	let startTime = $state('');
	let endTime = $state('');
	let location = $state('');
	let attendees = $state('');

	const triggerCategory = $derived(
		categoryValue
			? rundownCategoryOptions.find((c) => c.value === categoryValue)?.label
			: 'Pick a category',
	);

	function addRundown(event: Event) {
		event.preventDefault();
		if (!title) return;

		// TODO: Add rundown logic here

		// Reset form
		title = '';
		categoryValue = '';
		description = '';
		startTime = '';
		endTime = '';
		location = '';
		attendees = '';
	}
</script>

<Dialog.Content class="sm:max-w-[425px] bg-neutral-100">
	<Dialog.Header>
		<Dialog.Title>Add Timeline Event</Dialog.Title>
		<Dialog.Description>
			<p>Add a new event to your wedding day timeline</p>
		</Dialog.Description>
	</Dialog.Header>
	<form
		onsubmit={addRundown}
		class="flex flex-col gap-4 py-4"
	>
		<div class="flex flex-col gap-4">
			<div class="flex flex-row items-start justify-between gap-2">
				<div class="flex flex-col items-start w-full gap-2">
					<Label
						for="title"
						class="text-right">Event Title</Label
					>
					<Input
						bind:value={title}
						id="title"
						type="text"
						placeholder="e.g. Ceremony"
						class="col-span-3"
					/>
				</div>
				<div class="flex flex-col w-full gap-2">
					<Label
						for="rundownCategory"
						class="text-right">Category</Label
					>
					<Select.Root
						type="single"
						name="rundownCategory"
						bind:value={categoryValue}
					>
						<Select.Trigger
							class="w-full"
							aria-label="Rundown Category"
						>
							{triggerCategory}
						</Select.Trigger>
						<Select.Content>
							<Select.Group>
								{#each rundownCategoryOptions as category (category.value)}
									<Select.Item
										value={category.value}
										label={category.label}
									>
										{category.label}
									</Select.Item>
								{/each}
							</Select.Group>
						</Select.Content>
					</Select.Root>
				</div>
			</div>
			<div class="flex flex-col gap-2">
				<Label
					for="description"
					class="text-right">Description (Optional)</Label
				>
				<Textarea
					bind:value={description}
					id="description"
					placeholder="Add details or notes (optional)"
					class="col-span-3"
				/>
			</div>
			<div class="flex flex-row items-start justify-between gap-2">
				<div class="flex flex-col items-start w-full gap-2">
					<Label
						for="startTime"
						class="text-right">Start Time</Label
					>
					<Input
						bind:value={startTime}
						id="startTime"
						type="time"
						class="col-span-3"
					/>
				</div>
				<div class="flex flex-col items-start w-full gap-2">
					<Label
						for="endTime"
						class="text-right">End Time</Label
					>
					<Input
						bind:value={endTime}
						id="endTime"
						type="time"
						class="col-span-3"
					/>
				</div>
			</div>
			<div class="flex flex-row items-start justify-between gap-2">
				<div class="flex flex-col items-start gap-2">
					<Label
						for="location"
						class="text-right">Location</Label
					>
					<Input
						bind:value={location}
						id="location"
						placeholder="e.g. Main Hall, Garden"
						class="col-span-3"
					/>
				</div>
				<div class="flex flex-col items-start gap-2">
					<Label
						for="attendees"
						class="text-right">Attendees (Optional)</Label
					>
					<Input
						bind:value={attendees}
						id="attendees"
						placeholder="e.g. Family, Guests"
						class="col-span-3"
					/>
				</div>
			</div>
		</div>
		<Dialog.Footer>
			<Button type="submit">Add New Event</Button>
		</Dialog.Footer>
	</form></Dialog.Content
>
