<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index';
	import * as Select from '$lib/components/ui/select/index';
	import * as Form from '$lib/components/ui/form/index';
	import { Input } from '$lib/components/ui/input/index';
	import { superForm } from 'sveltekit-superforms';
	import { valibot } from 'sveltekit-superforms/adapters';
	import { CrudToasts, FormToasts } from '$lib/utils/toasts';
	import {
		vendorSchema,
		categoryEnum,
		vendorStatusEnum,
		vendorRatingEnum,
	} from '$lib/validation/planner';
	import { InvalidationService } from '$lib/utils/invalidation-helpers';

	let { data, open = $bindable() } = $props();

	const form = superForm(data.vendorForm, {
		validators: valibot(vendorSchema),
		resetForm: true,
		onResult: async ({ result }) => {
			if (result.type === 'success') {
				const vendorName = $formData.vendorName || 'Vendor';
				CrudToasts.success('create', 'vendor', { itemName: vendorName });
				await InvalidationService.invalidateVendor();
				open = false;
			} else if (result.type === 'failure') {
				FormToasts.emptyFormError();
			} else if (result.type === 'error') {
				CrudToasts.error('create', 'An error occurred while saving the vendor', 'vendor');
			}
		},
	});
	const { form: formData, enhance } = form;

	const selectedCategory = $derived(
		$formData.vendorCategory
			? categoryEnum.find((c) => c.value === $formData.vendorCategory)?.label
			: 'Choose category',
	);

	const selectedStatus = $derived(
		$formData.vendorStatus
			? vendorStatusEnum.find((s) => s.value === $formData.vendorStatus)?.label
			: 'Select progress status',
	);

	const selectedRating = $derived(
		$formData.vendorRating
			? vendorRatingEnum.find((r) => r.value === $formData.vendorRating)?.label
			: 'Select vendor rating',
	);
</script>

<Dialog.Content class="sm:max-w-[425px]">
	<Dialog.Header>
		<Dialog.Title>Add New Vendor</Dialog.Title>
		<Dialog.Description>
			<p>Add a new wedding service provider</p>
		</Dialog.Description>
	</Dialog.Header>
	<form
		use:enhance
		method="POST"
		action="?/createVendor"
		class="flex flex-col gap-4"
		onsubmit={(e) => {
			if (!$formData.valid) {
				e.preventDefault();
			}
		}}
	>
		<Form.Field
			{form}
			name="vendorName"
		>
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Name</Form.Label>
					<Input
						{...props}
						type="text"
						bind:value={$formData.vendorName}
					/>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors class="text-xs text-red-500" />
		</Form.Field>
		<div class="flex w-full gap-4">
			<Form.Field
				{form}
				name="category"
				class="flex flex-col w-full"
			>
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Category</Form.Label>
						<Select.Root
							type="single"
							bind:value={$formData.vendorCategory}
							name={props.name}
						>
							<Select.Trigger
								{...props}
								class="flex w-full"
							>
								{selectedCategory}
							</Select.Trigger>
							<Select.Content>
								{#each categoryEnum as option (option.value)}
									<Select.Item value={option.value}>
										{option.label}
									</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors class="text-xs" />
			</Form.Field>
			<Form.Field
				{form}
				name="vendorInstagram"
				class="flex flex-col w-full"
			>
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Instagram</Form.Label>
						<Input
							{...props}
							type="text"
							bind:value={$formData.vendorInstagram}
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors class="text-xs text-red-500" />
			</Form.Field>
		</div>
		<div class="flex w-full gap-4">
			<Form.Field
				{form}
				name="vendorStatus"
				class="flex flex-col w-full"
			>
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Status</Form.Label>
						<Select.Root
							type="single"
							bind:value={$formData.vendorStatus}
							name={props.name}
						>
							<Select.Trigger
								{...props}
								class="flex w-full"
							>
								{selectedStatus}
							</Select.Trigger>
							<Select.Content>
								{#each vendorStatusEnum as option (option.value)}
									<Select.Item value={option.value}>
										{option.label}
									</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors class="text-xs" />
			</Form.Field>
			<Form.Field
				{form}
				name="vendorRating"
				class="flex flex-col w-full"
			>
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Rating</Form.Label>
						<Select.Root
							type="single"
							bind:value={$formData.vendorRating}
							name={props.name}
						>
							<Select.Trigger
								{...props}
								class="flex w-full"
							>
								{selectedRating} stars
							</Select.Trigger>
							<Select.Content>
								{#each vendorRatingEnum as option (option.value)}
									<Select.Item value={option.value}>
										{option.label} stars
									</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors class="text-xs" />
			</Form.Field>
		</div>

		<Dialog.Footer>
			<Form.Button>Add New Vendor</Form.Button>
		</Dialog.Footer>
	</form>
</Dialog.Content>
