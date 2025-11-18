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
		type VendorData,
	} from '$lib/validation/planner';
	import type { Vendor } from '$lib/types';
	import { invalidate } from '$app/navigation';

	let { vendor, open = $bindable() } = $props<{
		vendor: Vendor;
		open: boolean;
	}>();

	let isSubmitting = $state(false);
	let formData = $state({
		vendorName: vendor.vendorName,
		vendorCategory: vendor.vendorCategory,
		vendorInstagram: vendor.vendorInstagram,
		vendorStatus: vendor.vendorStatus,
		vendorRating: vendor.vendorRating,
	});

	const selectedCategory = $derived(
		formData.vendorCategory
			? categoryEnum.find((c) => c.value === formData.vendorCategory)?.label
			: 'Choose category',
	);

	const selectedStatus = $derived(
		formData.vendorStatus
			? vendorStatusEnum.find((s) => s.value === formData.vendorStatus)?.label
			: 'Select progress status',
	);

	const selectedRating = $derived(
		formData.vendorRating
			? vendorRatingEnum.find((r) => r.value === formData.vendorRating)?.label
			: 'Select vendor rating',
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
							vendorName: vendor.vendorName,
							vendorCategory: vendor.vendorCategory,
							vendorInstagram: vendor.vendorInstagram,
							vendorStatus: vendor.vendorStatus,
							vendorRating: vendor.vendorRating,
							updatedAt: new Date(),
						}
					: v,
			),
		);

		try {
			const form = new FormData();
			form.append('id', vendor.id);
			form.append('vendorName', formData.vendorName);
			form.append('vendorCategory', formData.vendorCategory);
			form.append('vendorInstagram', formData.vendorInstagram);
			form.append('vendorStatus', formData.vendorStatus);
			form.append('vendorRating', formData.vendorRating);

			const response = await fetch('?/editVendor', {
				method: 'POST',
				body: form,
			});

			const result = await response.json();

			if (result.type === 'success') {
				CrudToasts.success('update', 'vendor', { itemName: formData.vendorName });
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
				'vendor',
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
		<form
			onsubmit={handleSubmit}
			class="flex flex-col gap-4"
		>
			<div class="flex flex-col gap-2">
				<Label for="name">Name</Label>
				<Input
					id="name"
					type="text"
					bind:value={formData.vendorName}
					required
				/>
			</div>
			<div class="flex w-full gap-4">
				<div class="flex flex-col w-full gap-2">
					<Label for="category">Category</Label>
					<Select.Root
						type="single"
						bind:value={formData.vendorCategory}
					>
						<Select.Trigger class="flex w-full">
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
				</div>
				<div class="flex flex-col w-full gap-2">
					<Label for="instagram">Instagram</Label>
					<Input
						id="instagram"
						type="text"
						bind:value={formData.vendorInstagram}
					/>
				</div>
			</div>
			<div class="flex w-full gap-4">
				<div class="flex flex-col w-full gap-2">
					<Label for="status">Status</Label>
					<Select.Root
						type="single"
						bind:value={formData.vendorStatus}
					>
						<Select.Trigger class="flex w-full">
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
				</div>
				<div class="flex flex-col w-full gap-2">
					<Label for="rating">Rating</Label>
					<Select.Root
						type="single"
						bind:value={formData.vendorRating}
					>
						<Select.Trigger class="flex w-full">
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
				</div>
			</div>

			<Dialog.Footer>
				<Button
					type="submit"
					disabled={isSubmitting}
				>
					{isSubmitting ? 'Updating...' : 'Update Vendor'}
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
