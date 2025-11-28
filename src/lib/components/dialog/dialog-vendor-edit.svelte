<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index';
	import * as Select from '$lib/components/ui/select/index';
	import { Input } from '$lib/components/ui/input/index';
	import { Button } from '$lib/components/ui/button/index';
	import { Label } from '$lib/components/ui/label/index';
	import { CrudToasts } from '$lib/utils/toasts';
	import { vendorsState } from '$lib/stores/vendors.svelte';
	import {
		categoryEnum,
		vendorStatusEnum,
		vendorRatingEnum,
		type VendorData,
	} from '$lib/validation/planner';
	import type { Vendor } from '$lib/types';
	import { InvalidationService } from '$lib/utils/invalidation-helpers';
	import { createFormDataWithId } from '$lib/utils/form-helpers';

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
		const originalVendor = vendorsState.findById(vendor.id!);
		vendorsState.update(vendor.id!, {
			vendorName: formData.vendorName,
			vendorCategory: formData.vendorCategory,
			vendorInstagram: formData.vendorInstagram,
			vendorStatus: formData.vendorStatus,
			vendorRating: formData.vendorRating,
		});

		try {
			const form = createFormDataWithId(vendor.id!, {
				vendorName: formData.vendorName,
				vendorCategory: formData.vendorCategory,
				vendorInstagram: formData.vendorInstagram || '',
				vendorStatus: formData.vendorStatus,
				vendorRating: formData.vendorRating,
			});

			const response = await fetch('?/updateVendor', {
				method: 'POST',
				body: form,
			});

			const result = (await response.json()) as { type: string; error?: string };

			if (result.type === 'success') {
				CrudToasts.success('update', 'vendor', { itemName: formData.vendorName });
				await InvalidationService.invalidateVendor();
				open = false;
			} else {
				throw new Error(result.error || 'Failed to update vendor');
			}
		} catch (error) {
			// Revert optimistic update on error
			if (originalVendor) {
				vendorsState.update(vendor.id!, originalVendor);
			}
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
