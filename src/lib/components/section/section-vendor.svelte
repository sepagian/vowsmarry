<script lang="ts">
	import * as Dialog from '../ui/dialog/index';
	import * as Card from '../ui/card/index';
	import { Input } from '../ui/input/index';
	import { buttonVariants } from '../ui/button/index';
	import DialogVendor from '../dialog/dialog-vendor.svelte';
	import { vendorsStore } from '$lib/stores/vendors';

	let searchTerm = $state('');
	let dialogOpen = $state(false);

	let vendorItems = $derived($vendorsStore);

	let filteredVendors = $derived(
		vendorItems.filter(
			(v) =>
				v.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
				v.vendorCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
				v.vendorStatus.toLowerCase().includes(searchTerm.toLowerCase()) ||
				(v.vendorDesc && v.vendorDesc.toLowerCase().includes(searchTerm.toLowerCase())),
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
		<Dialog.Root bind:open={dialogOpen}>
			<Dialog.Trigger class={buttonVariants({ variant: 'outline', size: 'default' })}>
				<div class="i-lucide:plus p-2"></div>
				<span class="hidden lg:inline">Add Vendor</span>
			</Dialog.Trigger>
			<DialogVendor on:close={() => (dialogOpen = false)} />
		</Dialog.Root>
	</div>
	<div class="flex gap-4 flex-col sm:grid md:grid lg:grid-cols-3 xl:grid-cols-4">
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
					</div>
				</Card.Footer>
			</Card.Root>
		{/each}
	</div>
</div>

<style>
	:global(*) {
		box-sizing: border-box;
		margin: 0;
	}
</style>
