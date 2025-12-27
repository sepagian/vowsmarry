<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { valibot } from 'sveltekit-superforms/adapters';
	import { scheduleSchema } from '$lib/validation/planner';
	import { scheduleCategoryEnum } from '$lib/validation/planner';
	import type { Schedule } from '$lib/types';

	import {
		Dialog,
		DialogContent,
		DialogDescription,
		DialogHeader,
		DialogTitle,
	} from '$lib/components/ui/dialog';
	import {
		FormControl,
		FormField,
		FormFieldErrors,
		FormLabel,
	} from '$lib/components/ui/form/index';
	import { Input } from '$lib/components/ui/input/index';
	import { Button } from '$lib/components/ui/button';
	import {
		Select,
		SelectContent,
		SelectItem,
		SelectTrigger,
	} from '$lib/components/ui/select';
	import toastService from '$lib/utils/toasts';

	interface ScheduleDialogProps {
		open: boolean;
		schedule?: Schedule | null;
		onOpenChange: (open: boolean) => void;
		onSuccess?: () => void;
	}

	let { open = $bindable(), schedule = null, onOpenChange, onSuccess }: ScheduleDialogProps = $props();

	// Initialize form based on whether we're editing or creating
	const initialData = schedule
		? {
				scheduleName: schedule.scheduleName,
				scheduleCategory: schedule.scheduleCategory,
				scheduleDate: schedule.scheduleDate,
				scheduleStartTime: schedule.scheduleStartTime,
				scheduleEndTime: schedule.scheduleEndTime,
				scheduleLocation: schedule.scheduleLocation,
				scheduleVenue: schedule.scheduleVenue,
				scheduleAttendees: schedule.scheduleAttendees,
				isPublic: false,
			}
		: {
				scheduleName: '',
				scheduleCategory: 'preparation',
				scheduleDate: '',
				scheduleStartTime: '',
				scheduleEndTime: '',
				scheduleLocation: '',
				scheduleVenue: '',
				scheduleAttendees: '',
				isPublic: false,
			};

	const form = superForm(initialData, {
		validators: valibot(scheduleSchema),
		dataType: 'json',
		onUpdate: ({ form: f }) => {
			if (f.valid) {
				toastService.success(schedule ? 'Schedule updated!' : 'Schedule created!');
				onOpenChange(false);
				onSuccess?.();
			} else {
				toastService.error('Please fill in all required fields correctly.');
			}
		},
		onError: () => {
			toastService.error('An error occurred. Please try again.');
		},
	});

	const { form: formData, enhance } = form;

	let isSubmitting = $state(false);

	function getCategoryLabel(value: string): string {
		return scheduleCategoryEnum.find((c) => c.value === value)?.label || value;
	}
</script>

<Dialog bind:open {onOpenChange}>
	<DialogContent class="sm:max-w-[500px]">
		<DialogHeader>
			<DialogTitle>
				{schedule ? 'Edit Schedule' : 'Create New Schedule'}
			</DialogTitle>
			<DialogDescription>
				{schedule
					? 'Update the schedule details below'
					: 'Add a new schedule event to your wedding timeline'}
			</DialogDescription>
		</DialogHeader>

		<form
			use:enhance
			method="POST"
			action={schedule ? '?/updateSchedule' : '?/createSchedule'}
			class="flex flex-col gap-4"
		>
			{#if schedule}
				<input type="hidden" name="id" value={schedule.id} />
			{/if}

			<!-- Schedule Name -->
			<FormField {form} name="scheduleName" class="w-full">
				<FormControl>
					{#snippet children({ props })}
						<FormLabel>Event Name</FormLabel>
						<Input
							{...props}
							type="text"
							placeholder="e.g., Makeup & Hair"
							bind:value={$formData.scheduleName}
							disabled={isSubmitting}
						/>
					{/snippet}
				</FormControl>
				<FormFieldErrors class="text-xs text-red-500" />
			</FormField>

			<!-- Category -->
			<FormField {form} name="scheduleCategory" class="w-full">
				<FormControl>
					{#snippet children({ props })}
						<FormLabel>Category</FormLabel>
						<Select
							{...props}
							value={$formData.scheduleCategory}
							onValueChange={(value) => {
								$formData.scheduleCategory = value;
							}}
							disabled={isSubmitting}
						>
							<SelectTrigger>
								<span>{getCategoryLabel($formData.scheduleCategory)}</span>
							</SelectTrigger>
							<SelectContent>
								{#each scheduleCategoryEnum as category}
									<SelectItem value={category.value}>
										<span class="inline-flex items-center gap-2">
											<span class={`${category.icon} w-4 h-4`}></span>
											{category.label}
										</span>
									</SelectItem>
								{/each}
							</SelectContent>
						</Select>
					{/snippet}
				</FormControl>
				<FormFieldErrors class="text-xs text-red-500" />
			</FormField>

			<!-- Date and Times -->
			<div class="flex flex-col sm:flex-row gap-2">
				<FormField {form} name="scheduleDate" class="w-full">
					<FormControl>
						{#snippet children({ props })}
							<FormLabel>Date</FormLabel>
							<Input
								{...props}
								type="date"
								bind:value={$formData.scheduleDate}
								disabled={isSubmitting}
							/>
						{/snippet}
					</FormControl>
					<FormFieldErrors class="text-xs text-red-500" />
				</FormField>

				<FormField {form} name="scheduleStartTime" class="w-full">
					<FormControl>
						{#snippet children({ props })}
							<FormLabel>Start Time</FormLabel>
							<Input
								{...props}
								type="time"
								bind:value={$formData.scheduleStartTime}
								disabled={isSubmitting}
							/>
						{/snippet}
					</FormControl>
					<FormFieldErrors class="text-xs text-red-500" />
				</FormField>

				<FormField {form} name="scheduleEndTime" class="w-full">
					<FormControl>
						{#snippet children({ props })}
							<FormLabel>End Time</FormLabel>
							<Input
								{...props}
								type="time"
								bind:value={$formData.scheduleEndTime}
								disabled={isSubmitting}
							/>
						{/snippet}
					</FormControl>
					<FormFieldErrors class="text-xs text-red-500" />
				</FormField>
			</div>

			<!-- Location and Venue -->
			<div class="flex flex-col sm:flex-row gap-2">
				<FormField {form} name="scheduleLocation" class="w-full">
					<FormControl>
						{#snippet children({ props })}
							<FormLabel>Location</FormLabel>
							<Input
								{...props}
								type="text"
								placeholder="e.g., Bride's house"
								bind:value={$formData.scheduleLocation}
								disabled={isSubmitting}
							/>
						{/snippet}
					</FormControl>
					<FormFieldErrors class="text-xs text-red-500" />
				</FormField>

				<FormField {form} name="scheduleVenue" class="w-full">
					<FormControl>
						{#snippet children({ props })}
							<FormLabel>Venue</FormLabel>
							<Input
								{...props}
								type="text"
								placeholder="e.g., Beauty Salon"
								bind:value={$formData.scheduleVenue}
								disabled={isSubmitting}
							/>
						{/snippet}
					</FormControl>
					<FormFieldErrors class="text-xs text-red-500" />
				</FormField>
			</div>

			<!-- Attendees -->
			<FormField {form} name="scheduleAttendees" class="w-full">
				<FormControl>
					{#snippet children({ props })}
						<FormLabel>Attendees</FormLabel>
						<Input
							{...props}
							type="text"
							placeholder="e.g., Bride, Bridesmaids, Makeup Artist"
							bind:value={$formData.scheduleAttendees}
							disabled={isSubmitting}
						/>
					{/snippet}
				</FormControl>
				<FormFieldErrors class="text-xs text-red-500" />
			</FormField>

			<!-- Public Checkbox -->
			<FormField {form} name="isPublic" class="w-full">
				<FormControl>
					{#snippet children()}
						<div class="flex items-center gap-2">
							<input
								type="checkbox"
								id="isPublic"
								class="rounded border-gray-300"
								bind:checked={$formData.isPublic}
								disabled={isSubmitting}
							/>
							<FormLabel class="!mb-0">Make this schedule public</FormLabel>
						</div>
					{/snippet}
				</FormControl>
				<FormFieldErrors class="text-xs text-red-500" />
			</FormField>

			<!-- Buttons -->
			<div class="flex justify-end gap-2 pt-4">
				<Button
					type="button"
					variant="outline"
					onclick={() => onOpenChange(false)}
					disabled={isSubmitting}
				>
					Cancel
				</Button>
				<Button type="submit" disabled={isSubmitting}>
					{#if isSubmitting}
						<span class="i-lucide:loader-2 w-4 h-4 mr-2 animate-spin"></span>
					{:else}
						<span class="i-lucide:save w-4 h-4 mr-2"></span>
					{/if}
					{schedule ? 'Update' : 'Create'}
				</Button>
			</div>
		</form>
	</DialogContent>
</Dialog>
