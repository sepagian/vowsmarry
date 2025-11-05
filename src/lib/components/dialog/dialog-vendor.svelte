<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index';
	import * as Select from '$lib/components/ui/select/index';
	import * as Form from '$lib/components/ui/form/index';
	import { Input } from '$lib/components/ui/input/index';
	import { superForm } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { CrudToasts } from '$lib/utils/crud-toasts';
	import FormToasts from '$lib/utils/form-toasts';
	import {
		vendorFormSchema,
		categoryEnum,
		vendorStatusEnum,
		vendorRatingEnum,
	} from '$lib/validation/index';

	let { data } = $props();

	const form = superForm(data.vendorForm, {
		validators: zod4(vendorFormSchema as any),
		onUpdate: ({ form: f }) => {
			if (f.valid) {
				// Use CRUD toast for successful vendor creation
				const vendorName = f.data.name || 'Vendor';
				CrudToasts.success('create', 'vendor', { itemName: vendorName });
			} else {
				FormToasts.emptyFormError();
			}
		},
		onError: () => {
			// Use CRUD toast for server errors
			CrudToasts.error('create', 'An error occurred while saving the vendor', 'vendor');
		},
	});
	const { form: formData, enhance } = form;

	const selectedCategory = $derived(
		$formData.category
			? categoryEnum[$formData.category as keyof typeof categoryEnum]
			: 'Choose category',
	);

	const selectedStatus = $derived(
		$formData.status
			? vendorStatusEnum[$formData.status as keyof typeof vendorStatusEnum]
			: 'Select progress status',
	);

	const selectedRating = $derived(
		$formData.rating
			? vendorRatingEnum[$formData.rating as keyof typeof vendorRatingEnum]
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
		class="flex flex-col gap-4"
	>
		<Form.Field
			{form}
			name="name"
		>
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Name</Form.Label>
					<Input
						{...props}
						type="text"
						bind:value={$formData.name}
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
							bind:value={$formData.category}
							name={props.name}
						>
							<Select.Trigger
								{...props}
								class="flex w-full"
							>
								{selectedCategory}
							</Select.Trigger>
							<Select.Content>
								{#each Object.entries(categoryEnum) as [value, label] (label)}
									<Select.Item {value}>
										{label}
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
				name="instagram"
				class="flex flex-col w-full"
			>
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Instagram</Form.Label>
						<Input
							{...props}
							type="text"
							bind:value={$formData.instagram}
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors class="text-xs text-red-500" />
			</Form.Field>
		</div>
		<div class="flex w-full gap-4">
			<Form.Field
				{form}
				name="price"
				class="flex flex-col w-full"
			>
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Price</Form.Label>
						<Input
							{...props}
							type="number"
							inputmode="decimal"
							bind:value={$formData.price}
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors class="text-xs text-red-500" />
			</Form.Field>
			<Form.Field
				{form}
				name="status"
				class="flex flex-col w-full"
			>
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Status</Form.Label>
						<Select.Root
							type="single"
							bind:value={$formData.status}
							name={props.name}
						>
							<Select.Trigger
								{...props}
								class="flex w-full"
							>
								{selectedStatus}
							</Select.Trigger>
							<Select.Content>
								{#each Object.entries(vendorStatusEnum) as [value, label] (label)}
									<Select.Item {value}>
										{label}
									</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors class="text-xs" />
			</Form.Field>
		</div>
		<div class="flex w-full gap-4">
			<Form.Field
				{form}
				name="rating"
				class="flex flex-col w-full"
			>
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Rating</Form.Label>
						<Select.Root
							type="single"
							bind:value={$formData.rating}
							name={props.name}
						>
							<Select.Trigger
								{...props}
								class="flex w-full"
							>
								{selectedRating} stars
							</Select.Trigger>
							<Select.Content>
								{#each Object.entries(vendorRatingEnum) as [value, label] (label)}
									<Select.Item {value}>
										{label} stars
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
