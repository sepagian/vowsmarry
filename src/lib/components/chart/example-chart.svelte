<script lang="ts">
	import { categoryOptions } from '$lib/constants/constants';
	import type { Option } from '$lib/types';

	// Props: expense data as map of category to amount (in currency units, e.g., IDR), and total budget
	let { data, totalBudget }: { data: Record<Category, number>; totalBudget: number } = $props();

	// Derived: total spent across all categories
	let totalSpent = $derived(Object.values(data).reduce((sum, amount) => sum + amount, 0));

	// Derived: filter non-zero entries and create segments (percentages relative to totalBudget)
	let segments = $derived(
		Object.entries(data)
			.filter(([_, amount]) => amount > 0)
			.map(([cat, amount]) => {
				const option = categoryOptions.find((opt) => opt.value === cat) as
					| Option<Category>
					| undefined;
				const percentage = (amount / totalBudget) * 100;
				return {
					category: cat as Category,
					label: option?.label || cat,
					amount, // Keep original amount for display in legend
					percentage,
					color: option?.color ? option.color.split(' ')[0] || 'bg-gray-200' : 'bg-gray-200', // Use bg- color for bar fill
					icon: option?.icon || '',
					textColor: option?.color
						? option.color.split(' ')[1] || 'text-gray-800'
						: 'text-gray-800',
				};
			})
			.sort((a, b) => b.percentage - a.percentage), // Sort by percentage descending for better stacking
	);

	// Derived: total percentage used (should be <= 100)
	let totalUsedPercentage = $derived(segments.reduce((sum, seg) => sum + seg.percentage, 0));

	// Side effect: warn if total spent exceeds budget or other issues
	$effect(() => {
		if (totalSpent > totalBudget) {
			console.warn(
				`Total spent (Rp${totalSpent.toLocaleString()}) exceeds budget (Rp${totalBudget.toLocaleString()}) by ${(totalSpent - totalBudget).toLocaleString()}`,
			);
		} else if (totalUsedPercentage > 100.1) {
			console.warn('Computed percentages exceed 100% due to rounding; check data.');
		}
	});
</script>

<div class="w-full p-4">
	<!-- Title and Budget Summary -->
	<div class="mb-4">
		<p class="text-sm text-gray-600">
			Total Budget: <span class="font-medium">Rp{totalBudget.toLocaleString()}</span> | Spent:
			<span class="font-medium text-green-600">Rp{totalSpent.toLocaleString()}</span>
			| Remaining:
			<span class="font-medium text-blue-600">Rp{(totalBudget - totalSpent).toLocaleString()}</span>
		</p>
		<p class="text-sm text-gray-500">({totalUsedPercentage.toFixed(1)}% of budget used)</p>
	</div>

	<!-- Stacked Horizontal Bar (stacks to totalUsedPercentage <= 100%, gray fills the rest) -->
	<div class="relative mb-6">
		<div class="flex h-8 bg-gray-200 rounded-full overflow-hidden">
			{#each segments as segment (segment.percentage)}
				<div
					class="{segment.color} flex items-center justify-center text-xs font-medium {segment.textColor}"
					style="width: {segment.percentage}%"
					title="{segment.label}: Rp{segment.amount.toLocaleString()} ({segment.percentage.toFixed(
						1,
					)}% of budget)"
				>
					<!-- Optional: show percentage label inside segment if space allows -->
					{#if segment.percentage >= 5}
						<span class="hidden sm:inline">{segment.percentage.toFixed(1)}%</span>
					{/if}
				</div>
			{/each}
		</div>
	</div>

	<!-- Legend: Categories with icons, colors, amounts, and percentages of budget -->
	<div class="space-y-2">
		{#each segments as segment (segment.amount)}
			<div class="flex items-center space-x-3 text-sm">
				<div class="flex-1 flex justify-between">
					<div class="flex inline-flex items-center gap-2">
						<div
							class="{segment.icon} w-4 h-4 {segment.textColor}"
							aria-hidden="true"
						></div>
						<span class="{segment.textColor} font-medium">{segment.label}</span>
					</div>
					<div class="text-right">
						<span class="block text-gray-600">Rp{segment.amount.toLocaleString()}</span>
						<span class="text-xs text-gray-500">({segment.percentage.toFixed(1)}%)</span>
					</div>
				</div>
				<!-- Color swatch -->
				<div class="w-4 h-4 {segment.color} rounded"></div>
			</div>
		{/each}
	</div>

	<!-- If no data, show message -->
	{#if segments.length === 0}
		<p class="text-center text-gray-500 py-4">No expense data available.</p>
	{/if}
</div>
