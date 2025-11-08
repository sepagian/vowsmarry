<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index';
	import * as Select from '$lib/components/ui/select/index';
	import { Input } from '$lib/components/ui/input/index';
	import { Button } from '$lib/components/ui/button/index';
	import { Label } from '$lib/components/ui/label/index';
	import { CrudToasts } from '$lib/utils/crud-toasts';
	import { vendorsStore } from '$lib/stores/vendors';
	import {
		categoryEnum,
		vendorStatusEnum,
		vendorRatingEnum,
	} from '$lib/validation/index';
	import type { Vendor } from '$lib/types';
	import { invalidate } from '$app/navigation';

	let { vendor, open = $bindable() } = $props<{
		vendor: Vendor;
		open: boolean;
	}>();

	let isSubmitting = $state(false);
	let formData = $state({
		name: vendor.name,
		category: vendor.category,
		instagram: vendor.instagram || '',
		status: vendor.status,
		rating: vendor.rating,
	});

	const selectedCategory = $derived(
		formData.category
			? categoryEnum[formData.category as keyof typeof categoryEnum]
			: 'Choose category'
	);

	const selectedStatus = $derived(
		formData.status
			? vendorStatusEnum[formData.status as keyof typeof vendorStatusEnum]
			: 'Select progress status'
	);

	const selectedRating = $derived(
		formData.rating
			? vendorRatingEnum[formData.rating as keyof typeof vendorRatingEnum]
			: 'Select vendor rating'
	);

	async function handleSubmit(e: Event) {
		e.preventDefault();
		isSubmitting = true;

		// Optimistic update
		const originalVendors = $vendorsStore;
		vendorsStore.update((vendors) =>
			vendors.map((v) =>
				v.id === vendor.id
					? {
							...v,
							name: formData.name,
							category: formData.category,
							instagram: formData.instagram,
							status: formData.status,
							rating: formData.rating,
							updatedAt: new Date(),
					  }
					: v
			)
		);

		try {
			const form = new FormData();
			form.append('id', vendor.id);
			form.append('name', formData.name);
			form.append('category', formData.category);
			form.append('instagram', formData.instagram);
			form.append('status', formData.status);
			form.append('rating', formData.rating);

			const response = await fetch('?/editVendor', {
				method: 'POST',
				body: form,
			});

			const result = await response.json();

			if (result.type === 'success') {
				CrudToasts.success('update', 'vendor', { itemName: formData.name });
				// Invalidate to refetch all vendor data including stats
				await invalidate('vendor:list');
				open = false;
			} else {
				throw new Error(result.error || 'Failed to update vendor');
			}
		} catch (error) {
			// Revert optimistic update on error
			vendorsStore.set(originalVendors);
			CrudToasts.error(
				'update',
				error instanceof Error ? error.message : 'Failed to update vendor',
				'vendor'
			);
		} finally {
			isSubmitting = false;
		}
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Edit Vendor</Dialog.Title>
			<Dialog.Description>
				<p>Update vendor information</p>
			</Dialog.Description>
		</Dialog.Header>
		<form onsubmit={handleSubmit} class="flex flex-col gap-4">
			<div class="flex flex-col gap-2">
				<Label for="name">Name</Label>
				<Input
					id="name"
					type="text"
					bind:value={formData.name}
					required
				/>
			</div>
			<div class="flex w-full gap-4">
				<div class="flex flex-col w-full gap-2">
					<Label for="category">Category</Label>
					<Select.Root
						type="single"
						bind:value={formData.category}
					>
						<Select.Trigger class="flex w-full">
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
				</div>
				<div class="flex flex-col w-full gap-2">
					<Label for="instagram">Instagram</Label>
					<Input
						id="instagram"
						type="text"
						bind:value={formData.instagram}
					/>
				</div>
			</div>
			<div class="flex w-full gap-4">
				<div class="flex flex-col w-full gap-2">
					<Label for="status">Status</Label>
					<Select.Root
						type="single"
						bind:value={formData.status}
					>
						<Select.Trigger class="flex w-full">
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
				</div>
				<div class="flex flex-col w-full gap-2">
					<Label for="rating">Rating</Label>
					<Select.Root
						type="single"
						bind:value={formData.rating}
					>
						<Select.Trigger class="flex w-full">
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
				</div>
			</div>

			<Dialog.Footer>
				<Button type="submit" disabled={isSubmitting}>
					{isSubmitting ? 'Updating...' : 'Update Vendor'}
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
