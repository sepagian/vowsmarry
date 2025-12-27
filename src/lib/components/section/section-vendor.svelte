<script lang="ts">
	import * as Dialog from '../ui/dialog/index';
	import * as Card from '../ui/card/index';
	import { Input } from '../ui/input/index';
	import { Button, buttonVariants } from '../ui/button/index';
	import DialogVendor from '../dialog/dialog-vendor.svelte';
	import DialogVendorEdit from '../dialog/dialog-vendor-edit.svelte';
	import { vendorsState } from '$lib/stores/vendors.svelte';
	import { CrudToasts } from '$lib/utils/toasts';
	import type { Vendor } from '$lib/types';
	import { InvalidationService } from '$lib/utils/invalidation-helpers';
	import { createFormDataWithId } from '$lib/utils/form-helpers';
	import { confirmDelete } from '$lib/components/ui/confirm-delete-dialog';

	let { data } = $props<{ data: any }>();

	let searchTerm = $state('');
	let open = $state(false);
	let editDialogOpen = $state(false);
	let selectedVendor = $state<Vendor | null>(null);

	async function handleDelete(vendorId: string, vendorName: string) {
		const formData = createFormDataWithId(vendorId);

		const response = await fetch('?/deleteVendor', {
			method: 'POST',
			body: formData,
		});

		const result = (await response.json()) as { type: string; error?: string };

		if (result.type === 'success') {
			CrudToasts.success('delete', 'vendor', { itemName: vendorName });
			await InvalidationService.invalidateVendor();
		} else {
			CrudToasts.error('delete', result.error || 'Failed to delete vendor', 'vendor');
			throw new Error(result.error || 'Failed to delete vendor');
		}
	}

	function openEditDialog(vendor: Vendor) {
		selectedVendor = vendor;
		editDialogOpen = true;
	}

	let vendorItems = $derived(vendorsState.vendors);

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
								onclick={() => {
									confirmDelete({
										title: 'Delete Vendor',
										description: `Are you sure you want to delete "${data.vendorName}"? This action cannot be undone.`,
										onConfirm: async () => {
											await handleDelete(data.id as string, data.vendorName);
										}
									});
								}}
							>
								<div class="i-lucide:trash-2 h-4 w-4 text-red-500"></div>
							</Button>
						</div>
					</div>
				</Card.Footer>
			</Card.Root>
		{:else}
			<div class="col-span-full flex flex-col items-center justify-center py-12 text-center">
				<div class="i-lucide:users h-12 w-12 text-muted-foreground mb-4"></div>
				<h3 class="text-lg font-semibold mb-2">No vendors in this workspace</h3>
				<p class="text-sm text-muted-foreground mb-4">
					Add your first vendor to start managing your wedding service providers.
				</p>
			</div>
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
