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
		SelectGroup,
		SelectItem,
		SelectTrigger,
	} from "$lib/components/ui/select/index";
	import { Textarea } from "$lib/components/ui/textarea/index";

	import { InvalidationService } from "$lib/utils/invalidation-helpers";
	import { CrudToasts, FormToasts } from "$lib/utils/toasts";
	import {
		scheduleCategoryEnum,
		scheduleSchema,
	} from "$lib/validation/planner";

	let { data, open = $bindable() } = $props();

	const form = superForm(data.scheduleForm, {
		validators: valibot(scheduleSchema),
		resetForm: true,
		onResult: async ({ result }) => {
			if (result.type === "success") {
				const eventTitle = $formData.scheduleName || "Rundown item";
				CrudToasts.success("create", "rundown", { itemName: eventTitle });
				await InvalidationService.invalidateRundown();
				open = false;
			} else if (result.type === "failure") {
				FormToasts.emptyFormError();
			} else if (result.type === "error") {
				CrudToasts.error(
					"create",
					"An error occurred while saving the schedule event",
					"rundown",
				);
			}
		},
	});
	const { form: formData, enhance } = form;

	const selectedCategory = $derived(
		$formData.scheduleCategory
			? scheduleCategoryEnum.find((c) => c.value === $formData.scheduleCategory)
					?.label
			: "Choose category",
	);
</script>

<DialogContent class="sm:max-w-[425px]">
	<DialogHeader>
		<DialogTitle>Add Timeline Event</DialogTitle>
		<DialogDescription>
			<p>Add a new event to your wedding day timeline</p>
		</DialogDescription>
	</DialogHeader>
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
				<FormField
					{form}
					name="scheduleName"
					class="flex flex-col items-start w-full gap-2"
				>
					<FormControl>
						{#snippet children({ props })}
							<FormLabel>Event Title</FormLabel>
							<Input
								{...props}
								type="text"
								placeholder="e.g. Ceremony"
								bind:value={$formData.scheduleName}
							/>
						{/snippet}
					</FormControl>
					<FormFieldErrors class="text-xs text-red-500" />
				</FormField>
				<FormField
					{form}
					name="scheduleCategory"
					class="flex flex-col w-full gap-2"
				>
					<FormControl>
						{#snippet children({ props })}
							<FormLabel>Category</FormLabel>
							<Select
								type="single"
								bind:value={$formData.scheduleCategory}
								name={props.name}
							>
								<SelectTrigger
									{...props}
									class="w-full"
									aria-label="Rundown Category"
								>
									{selectedCategory}
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										{#each scheduleCategoryEnum as option (option.value)}
											<SelectItem value={option.value}>
												{option.label}
											</SelectItem>
										{/each}
									</SelectGroup>
								</SelectContent>
							</Select>
						{/snippet}
					</FormControl>
					<FormFieldErrors class="text-xs text-red-500" />
				</FormField>
			</div>
			<FormField {form} name="scheduleNotes">
				<FormControl>
					{#snippet children({ props })}
						<FormLabel>Description (Optional)</FormLabel>
						<Textarea
							{...props}
							placeholder="Add details or notes (optional)"
							bind:value={$formData.scheduleNotes}
						/>
					{/snippet}
				</FormControl>
				<FormFieldErrors class="text-xs text-red-500" />
			</FormField>
			<div class="flex flex-row items-start justify-between gap-2">
				<FormField
					{form}
					name="scheduleStartTime"
					class="flex flex-col items-start w-full gap-2"
				>
					<FormControl>
						{#snippet children({ props })}
							<FormLabel>Start Time</FormLabel>
							<Input
								{...props}
								type="time"
								bind:value={$formData.scheduleStartTime}
							/>
						{/snippet}
					</FormControl>
					<FormFieldErrors class="text-xs text-red-500" />
				</FormField>
				<FormField
					{form}
					name="scheduleEndTime"
					class="flex flex-col items-start w-full gap-2"
				>
					<FormControl>
						{#snippet children({ props })}
							<FormLabel>End Time</FormLabel>
							<Input
								{...props}
								type="time"
								bind:value={$formData.scheduleEndTime}
							/>
						{/snippet}
					</FormControl>
					<FormFieldErrors class="text-xs text-red-500" />
				</FormField>
			</div>
			<div class="flex flex-row items-start justify-between gap-2">
				<FormField
					{form}
					name="scheduleLocation"
					class="flex flex-col items-start w-full gap-2"
				>
					<FormControl>
						{#snippet children({ props })}
							<FormLabel>Location</FormLabel>
							<Input
								{...props}
								placeholder="e.g. Main Hall, Garden"
								bind:value={$formData.scheduleLocation}
							/>
						{/snippet}
					</FormControl>
					<FormFieldErrors class="text-xs text-red-500" />
				</FormField>
				<FormField
					{form}
					name="scheduleAttendees"
					class="flex flex-col items-start w-full gap-2"
				>
					<FormControl>
						{#snippet children({ props })}
							<FormLabel>Attendees</FormLabel>
							<Input
								{...props}
								placeholder="e.g. Wedding Planner, Best Man"
								bind:value={$formData.scheduleAttendees}
							/>
						{/snippet}
					</FormControl>
					<FormFieldErrors class="text-xs text-red-500" />
				</FormField>
			</div>
		</div>
		<DialogFooter>
			<FormButton type="submit">Add New Event</FormButton>
		</DialogFooter>
	</form>
</DialogContent>
