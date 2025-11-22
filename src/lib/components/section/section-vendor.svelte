<script lang="ts">
	import * as Dialog from '../ui/dialog/index';
	import * as Card from '../ui/card/index';
	import * as AlertDialog from '../ui/alert-dialog/index';
	import { Input } from '../ui/input/index';
	import { Button, buttonVariants } from '../ui/button/index';
	import DialogVendor from '../dialog/dialog-vendor.svelte';
	import DialogVendorEdit from '../dialog/dialog-vendor-edit.svelte';
	import { vendorsStore } from '$lib/stores/vendors';
	import { CrudToasts } from '$lib/utils/crud-toasts';
	import type { Vendor } from '$lib/types';
	import { invalidate } from '$app/navigation';

	let { data } = $props<{ data: any }>();

	let searchTerm = $state('');
	let open = $state(false);
	let editDialogOpen = $state(false);
	let deleteDialogOpen = $state(false);
	let isDeleting = $state(false);
	let selectedVendor = $state<Vendor | null>(null);

	async function handleDelete(vendorId: string, vendorName: string) {
		isDeleting = true;

		// Optimistic update - remove from store immediately
		const originalVendors = $vendorsStore;
		vendorsStore.update((vendors) => vendors.filter((vendor) => vendor.id !== vendorId));

		try {
			const formData = new FormData();
			formData.append('id', vendorId);

			const response = await fetch('?/deleteVendor', {
				method: 'POST',
				body: formData,
			});

			const result = (await response.json()) as { type: string; error?: string };

			if (result.type === 'success') {
				CrudToasts.success('delete', 'vendor', { itemName: vendorName });
				// Invalidate to refetch all vendor data including stats
				await invalidate('vendor:list');
				deleteDialogOpen = false;
			} else {
				throw new Error(result.error || 'Failed to delete vendor');
			}
		} catch (error) {
			// Revert optimistic update on error
			vendorsStore.set(originalVendors);
			CrudToasts.error(
				'delete',
				error instanceof Error ? error.message : 'Failed to delete vendor',
				'vendor',
			);
		} finally {
			isDeleting = false;
		}
	}

	function openEditDialog(vendor: Vendor) {
		selectedVendor = vendor;
		editDialogOpen = true;
	}

	function openDeleteDialog(vendor: Vendor) {
		selectedVendor = vendor;
		deleteDialogOpen = true;
	}

	let vendorItems = $derived($vendorsStore);

	let filteredVendors = $derived(
		vendorItems.filter(
			(v) =>
				v.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
				v.vendorCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
				v.vendorStatus.toLowerCase().includes(searchTerm.toLowerCase()),
		),
	);
</script>

<div class="flex flex-col gap-4 px-4">
	<div class="flex items-center justify-between gap-4">
		<Input
			bind:value={searchTerm}
			placeholder="Search vendors"
			type="search"
			class="max-w-sm border-1 border-neutral-200"
		/>
		<Dialog.Root bind:open>
			<Dialog.Trigger class={buttonVariants({ variant: 'outline', size: 'default' })}>
				<div class="i-lucide:plus p-2"></div>
				<span class="hidden lg:inline">Add Vendor</span>
			</Dialog.Trigger>
			<DialogVendor
				{data}
				bind:open
			/>
		</Dialog.Root>
	</div>
	<div class="flex gap-4 flex-col sm:grid md:grid lg:grid-cols-2 xl:grid-cols-4">
		{#each filteredVendors as data (data.vendorName)}
			<Card.Root
				class="@container/card shrink-0 w-full sm:w-auto gap-2 flex flex-col p-2 shadow-none "
			>
				<Card.Header class="flex flex-col gap-3 px-0">
					<div class="inline-flex min-h-[8rem] sm:min-h-[6rem] rounded-lg w-full bg-gray-100"></div>
				</Card.Header>
				<Card.Footer class="flex-col items-start text-sm justify-start p-0 gap-2.5">
					<div class="flex justify-between w-full items-center">
						<div class="inline-flex gap-1 items-center text-xs truncate text-gray-600">
							<Card.Description class="text-sm font-semibold truncate overflow-hidden">
								{data.vendorName}
							</Card.Description>
						</div>
						<div class="flex gap-2">
							<Button
								variant="outline"
								size="sm"
								class="h-8 w-8 p-0"
								title="Edit vendor"
								onclick={() => openEditDialog(data)}
							>
								<div class="i-lucide:pencil h-4 w-4"></div>
							</Button>
							<Button
								variant="outline"
								size="sm"
								class="h-8 w-8 p-0"
								title="Delete vendor"
								onclick={() => openDeleteDialog(data)}
							>
								<div class="i-lucide:trash-2 h-4 w-4 text-red-500"></div>
							</Button>
						</div>
					</div>
				</Card.Footer>
			</Card.Root>
		{/each}
	</div>
</div>

<!-- Edit Dialog -->
{#if selectedVendor}
	<DialogVendorEdit
		vendor={selectedVendor}
		bind:open={editDialogOpen}
	/>
{/if}

<!-- Delete Confirmation Dialog -->
<AlertDialog.Root bind:open={deleteDialogOpen}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Delete Vendor</AlertDialog.Title>
			<AlertDialog.Description>
				Are you sure you want to delete "{selectedVendor?.vendorName}"? This action cannot be
				undone.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action
				onclick={() =>
					selectedVendor && handleDelete(selectedVendor.id as string, selectedVendor.vendorName)}
				disabled={isDeleting}
				class="bg-red-600 hover:bg-red-700"
			>
				{isDeleting ? 'Deleting...' : 'Delete'}
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
