<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index';
	import * as Select from '$lib/components/ui/select/index';
	import { Button } from '$lib/components/ui/button/index';
	import { Input } from '$lib/components/ui/input/index';
	import { Label } from '$lib/components/ui/label/index';
	import { Textarea } from '$lib/components/ui/textarea/index';
	import { categoryOptions } from '$lib/constants/constants';
	import { vendorsStore, type Vendor } from '$lib/stores/vendors';
	import type { Category } from '$lib/types';

	let vendorName = $state('');
	let categoryValue = $state('');
	let vendorEmail = $state('');
	let vendorPhone = $state('');
	let vendorWebsite = $state('');
	let vendorPrice = $state('');
	let vendorDesc = $state('');
	let vendorRatingValue = $state('');
	let vendorStatusValue = $state('');

	const vendorStatuses = ['researching', 'contacted', 'quoted', 'booked'] as const;
	const vendorRatings = [1, 2, 3, 4, 5];

	const triggerCategory = $derived(
		categoryValue
			? categoryOptions.find((c) => c.value === categoryValue)?.label
			: 'Pick a category',
	);
	const triggerStatus = $derived(vendorStatusValue ? vendorStatusValue : 'Pick a status');
	const triggerRating = $derived(
		vendorRatingValue ? `${vendorRatingValue} stars` : 'Pick a rating',
	);

	function addVendor(event: Event) {
		event.preventDefault();
		if (!vendorName || !categoryValue || !vendorStatusValue) return;

		const vendorData = {
			vendorName,
			vendorCategory: categoryValue as Category,
			vendorEmail: vendorEmail || undefined,
			vendorPhone: vendorPhone || undefined,
			vendorWebsite: vendorWebsite || undefined,
			vendorPrice: vendorPrice || undefined,
			vendorDesc: vendorDesc || undefined,
			vendorRating: vendorRatingValue
				? (parseInt(vendorRatingValue) as 1 | 2 | 3 | 4 | 5)
				: undefined,
			vendorStatus: vendorStatusValue as 'researching' | 'contacted' | 'quoted' | 'booked',
		};

		vendorsStore.update((vendors) => [...vendors, vendorData]);

		// Reset form
		vendorName = '';
		categoryValue = '';
		vendorEmail = '';
		vendorPhone = '';
		vendorWebsite = '';
		vendorPrice = '';
		vendorDesc = '';
		vendorRatingValue = '';
		vendorStatusValue = '';
	}
</script>

<Dialog.Content class="sm:max-w-[425px] bg-neutral-100">
	<Dialog.Header>
		<Dialog.Title>Add New Vendor</Dialog.Title>
		<Dialog.Description>
			<p>Add a new wedding service provider</p>
		</Dialog.Description>
	</Dialog.Header>
	<form
		onsubmit={addVendor}
		class="flex flex-col gap-4 py-4"
	>
		<div class="flex flex-row items-start justify-between gap-2">
			<div class="flex flex-col items-start w-full gap-2">
				<Label
					for="vendorName"
					class="text-right">Vendor Name</Label
				>
				<Input
					bind:value={vendorName}
					id="vendorName"
					type="text"
					placeholder="e.g. PerfectMoment Photo"
					class="col-span-3"
				/>
			</div>
			<div class="flex flex-col w-full gap-2">
				<Label
					for="vendorCategory"
					class="text-right">Category</Label
				>
				<Select.Root
					type="single"
					name="vendorCategory"
					bind:value={categoryValue}
				>
					<Select.Trigger
						class="w-full"
						aria-label="Vendor Category"
					>
						{triggerCategory}
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							{#each categoryOptions as category (category.value)}
								<Select.Item
									value={category.value}
									label={category.label}
								>
									{category.label}
								</Select.Item>
							{/each}
						</Select.Group>
					</Select.Content>
				</Select.Root>
			</div>
		</div>
		<div class="flex flex-row items-start justify-between gap-2">
			<div class="flex flex-col items-start w-full gap-2">
				<Label
					for="vendorEmail"
					class="text-right">Email</Label
				>
				<Input
					bind:value={vendorEmail}
					id="vendorEmail"
					type="email"
					placeholder="vendor@email.com"
					class="col-span-3"
				/>
			</div>
			<div class="flex flex-col items-start w-full gap-2">
				<Label
					for="vendorPhone"
					class="text-right">Phone</Label
				>
				<Input
					bind:value={vendorPhone}
					id="vendorPhone"
					type="tel"
					placeholder="(62) 8212345678"
					class="col-span-3"
				/>
			</div>
		</div>
		<div class="flex flex-row items-start justify-between gap-2">
			<div class="flex flex-col items-start w-full gap-2">
				<Label
					for="vendorWebsite"
					class="text-right">Website URL</Label
				>
				<Input
					bind:value={vendorWebsite}
					id="vendorWebsite"
					type="url"
					placeholder="https://www.vendor.com"
					class="col-span-3"
				/>
			</div>
			<div class="flex flex-col items-start w-full gap-2">
				<Label
					for="vendorPrice"
					class="text-right">Price</Label
				>
				<Input
					bind:value={vendorPrice}
					id="vendorPrice"
					type="text"
					placeholder="e.g. $10,000"
					class="col-span-3"
				/>
			</div>
		</div>
		<div class="flex flex-col gap-2">
			<Label
				for="vendorDesc"
				class="text-right">Description</Label
			>
			<Textarea
				bind:value={vendorDesc}
				id="vendorDesc"
				placeholder="Add details or notes (optional)"
				class="col-span-3"
			/>
		</div>
		<div class="flex flex-row items-start justify-between gap-2">
			<div class="flex flex-col items-start w-full gap-2">
				<Label
					for="vendorRating"
					class="text-right">Rating</Label
				>
				<Select.Root
					type="single"
					name="vendorRating"
					bind:value={vendorRatingValue}
				>
					<Select.Trigger
						class="w-full"
						aria-label="Vendor Rating"
					>
						{triggerRating}
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							{#each vendorRatings as rating (rating)}
								<Select.Item value={rating.toString()}>
									{rating} star{rating > 1 ? 's' : ''}
								</Select.Item>
							{/each}
						</Select.Group>
					</Select.Content>
				</Select.Root>
			</div>
			<div class="flex flex-col items-start w-full gap-2">
				<Label
					for="vendorStatus"
					class="text-right">Status</Label
				>
				<Select.Root
					type="single"
					name="vendorStatus"
					bind:value={vendorStatusValue}
				>
					<Select.Trigger
						class="w-full"
						aria-label="Vendor Status"
					>
						{triggerStatus}
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							{#each vendorStatuses as status (status)}
								<Select.Item value={status}>
									{status.charAt(0).toUpperCase() + status.slice(1)}
								</Select.Item>
							{/each}
						</Select.Group>
					</Select.Content>
				</Select.Root>
			</div>
		</div>
	</form>
	<Dialog.Footer>
		<Button type="submit">Add New Vendor</Button>
	</Dialog.Footer>
</Dialog.Content>
