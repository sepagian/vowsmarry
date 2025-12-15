<script lang="ts">
	import { Button } from "$lib/components/ui/button/index";
	import {
		Dialog,
		DialogContent,
		DialogDescription,
		DialogFooter,
		DialogHeader,
		DialogTitle,
	} from "$lib/components/ui/dialog/index";
	import { Input } from "$lib/components/ui/input/index";
	import { Label } from "$lib/components/ui/label/index";
	import {
		Select,
		SelectContent,
		SelectItem,
		SelectTrigger,
	} from "$lib/components/ui/select/index";

	import { vendorsState } from "$lib/stores/vendors.svelte";
	import { createFormDataWithId } from "$lib/utils/form-helpers";
	import { InvalidationService } from "$lib/utils/invalidation-helpers";
	import { CrudToasts } from "$lib/utils/toasts";
	import {
		categoryEnum,
		vendorRatingEnum,
		vendorStatusEnum,
	} from "$lib/validation/planner";

	import type { Vendor } from "$lib/types";

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
			: "Choose category",
	);

	const selectedStatus = $derived(
		formData.vendorStatus
			? vendorStatusEnum.find((s) => s.value === formData.vendorStatus)?.label
			: "Select progress status",
	);

	const selectedRating = $derived(
		formData.vendorRating
			? vendorRatingEnum.find((r) => r.value === formData.vendorRating)?.label
			: "Select vendor rating",
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
				vendorInstagram: formData.vendorInstagram || "",
				vendorStatus: formData.vendorStatus,
				vendorRating: formData.vendorRating,
			});

			const response = await fetch("?/updateVendor", {
				method: "POST",
				body: form,
			});

			const result = (await response.json()) as {
				type: string;
				error?: string;
			};

			if (result.type === "success") {
				CrudToasts.success("update", "vendor", {
					itemName: formData.vendorName,
				});
				await InvalidationService.invalidateVendor();
				open = false;
			} else {
				throw new Error(result.error || "Failed to update vendor");
			}
		} catch (error) {
			// Revert optimistic update on error
			if (originalVendor) {
				vendorsState.update(vendor.id!, originalVendor);
			}
			CrudToasts.error(
				"update",
				error instanceof Error ? error.message : "Failed to update vendor",
				"vendor",
			);
		} finally {
			isSubmitting = false;
		}
	}
</script>

<Dialog bind:open>
	<DialogContent class="sm:max-w-[425px]">
		<DialogHeader>
			<DialogTitle>Edit Vendor</DialogTitle>
			<DialogDescription>
				<p>Update vendor information</p>
			</DialogDescription>
		</DialogHeader>
		<form onsubmit={handleSubmit} class="flex flex-col gap-4">
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
					<Select type="single" bind:value={formData.vendorCategory}>
						<SelectTrigger class="flex w-full">
							{selectedCategory}
						</SelectTrigger>
						<SelectContent>
							{#each categoryEnum as option (option.value)}
								<SelectItem value={option.value}>
									{option.label}
								</SelectItem>
							{/each}
						</SelectContent>
					</Select>
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
					<Select type="single" bind:value={formData.vendorStatus}>
						<SelectTrigger class="flex w-full">{selectedStatus}</SelectTrigger>
						<SelectContent>
							{#each vendorStatusEnum as option (option.value)}
								<SelectItem value={option.value}>
									{option.label}
								</SelectItem>
							{/each}
						</SelectContent>
					</Select>
				</div>
				<div class="flex flex-col w-full gap-2">
					<Label for="rating">Rating</Label>
					<Select type="single" bind:value={formData.vendorRating}>
						<SelectTrigger class="flex w-full">
							{selectedRating}stars
						</SelectTrigger>
						<SelectContent>
							{#each vendorRatingEnum as option (option.value)}
								<SelectItem value={option.value}>
									{option.label} stars
								</SelectItem>
							{/each}
						</SelectContent>
					</Select>
				</div>
			</div>

			<DialogFooter>
				<Button type="submit" disabled={isSubmitting}>
					{isSubmitting ? "Updating..." : "Update Vendor"}
				</Button>
			</DialogFooter>
		</form>
	</DialogContent>
</Dialog>
