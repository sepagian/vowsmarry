<script lang="ts">
	// Dummy gift registry data
	const giftStats = {
		totalItems: 45,
		purchased: 28,
		remaining: 17,
		totalValue: 25000000
	};

	const giftCategories = [
		{ name: 'Kitchen & Dining', count: 12, purchased: 8 },
		{ name: 'Home Decor', count: 10, purchased: 6 },
		{ name: 'Bedroom & Bath', count: 8, purchased: 5 },
		{ name: 'Electronics', count: 6, purchased: 4 },
		{ name: 'Experience Gifts', count: 5, purchased: 3 },
		{ name: 'Cash Gifts', count: 4, purchased: 2 }
	];

	const giftItems = [
		{
			id: 1,
			name: 'Premium Coffee Maker',
			category: 'Kitchen & Dining',
			price: 2500000,
			description: 'Professional grade coffee maker with built-in grinder',
			image: '/placeholder-coffee-maker.jpg',
			status: 'purchased',
			purchasedBy: 'John & Mary Smith',
			purchaseDate: '2024-08-15',
			priority: 'high',
			store: 'Kitchen World'
		},
		{
			id: 2,
			name: 'Silk Bedsheet Set',
			category: 'Bedroom & Bath',
			price: 1800000,
			description: 'Luxury silk bedsheet set - King size',
			image: '/placeholder-bedsheet.jpg',
			status: 'available',
			purchasedBy: null,
			purchaseDate: null,
			priority: 'medium',
			store: 'Home Comfort'
		},
		{
			id: 3,
			name: 'Smart TV 55 inch',
			category: 'Electronics',
			price: 8500000,
			description: '4K Smart TV with streaming capabilities',
			image: '/placeholder-tv.jpg',
			status: 'purchased',
			purchasedBy: 'The Johnson Family',
			purchaseDate: '2024-08-20',
			priority: 'high',
			store: 'Electronics Plus'
		},
		{
			id: 4,
			name: 'Dinner Set for 8',
			category: 'Kitchen & Dining',
			price: 3200000,
			description: 'Elegant porcelain dinner set for 8 people',
			image: '/placeholder-dinnerware.jpg',
			status: 'available',
			purchasedBy: null,
			purchaseDate: null,
			priority: 'high',
			store: 'Fine Dining Store'
		},
		{
			id: 5,
			name: 'Honeymoon Fund',
			category: 'Cash Gifts',
			price: 5000000,
			description: 'Contribution towards our dream honeymoon in Bali',
			image: '/placeholder-honeymoon.jpg',
			status: 'partially_funded',
			purchasedBy: 'Multiple Contributors',
			purchaseDate: '2024-08-18',
			priority: 'high',
			store: 'Cash Gift'
		}
	];

	function formatCurrency(amount: number) {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(amount);
	}

	function getStatusColor(status: string) {
		switch (status) {
			case 'purchased':
				return 'bg-green-100 text-green-800';
			case 'partially_funded':
				return 'bg-yellow-100 text-yellow-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}
</script>

<div class="flex flex-1 flex-col gap-4 p-4">
	<!-- Header -->
	<div class="flex flex-col gap-2">
		<h1 class="text-2xl font-semibold">Gift Registry</h1>
		<p class="text-muted-foreground">Manage your wedding gift registry and track purchases.</p>
	</div>

	<!-- Gift Statistics -->
	<div class="grid gap-4 md:grid-cols-4">
		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Total Items</p>
				<svg class="w-5 h-5 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
					<path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
				</svg>
			</div>
			<p class="text-2xl font-bold">{giftStats.totalItems}</p>
		</div>

		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Purchased</p>
				<span class="text-lg">🎁</span>
			</div>
			<p class="text-2xl font-bold">{giftStats.purchased}</p>
			<p class="text-sm text-muted-foreground">{Math.round((giftStats.purchased / giftStats.totalItems) * 100)}% complete</p>
		</div>

		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Remaining</p>
				<span class="text-lg">📋</span>
			</div>
			<p class="text-2xl font-bold">{giftStats.remaining}</p>
		</div>

		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Total Value</p>
				<svg class="w-5 h-5 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
					<path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
				</svg>
			</div>
			<p class="text-2xl font-bold">{formatCurrency(giftStats.totalValue)}</p>
		</div>
	</div>

	<!-- Gift Categories -->
	<div class="rounded-lg border bg-card p-4">
		<div class="flex items-center justify-between mb-4">
			<h2 class="text-lg font-semibold">Gift Categories</h2>
			<button class="text-sm font-medium hover:underline">Add Category</button>
		</div>
		
		<div class="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
			{#each giftCategories as category}
				<div class="flex items-center justify-between p-3 border rounded-lg">
					<div>
						<h3 class="font-medium">{category.name}</h3>
						<p class="text-sm text-muted-foreground">{category.purchased} of {category.count} items</p>
					</div>
					<div class="w-12 h-2 bg-muted rounded-full">
						<div
							class="h-2 bg-foreground rounded-full"
							style="width: {(category.purchased / category.count) * 100}%"
						></div>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Gift Items -->
	<div class="rounded-lg border bg-card p-4">
		<div class="flex items-center justify-between mb-4">
			<h2 class="text-lg font-semibold">Gift Items</h2>
			<div class="flex gap-2">
				<button class="text-sm font-medium hover:underline">Add Item</button>
				<button class="text-sm font-medium hover:underline">Share Registry</button>
			</div>
		</div>
		
		<div class="space-y-4">
			{#each giftItems as item}
				<div class="flex items-start gap-4 p-4 border rounded-lg">
					<!-- Item Image -->
					<div class="w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
						<svg class="w-8 h-8 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
							<path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
						</svg>
					</div>
					
					<!-- Item Details -->
					<div class="flex-1">
						<div class="flex items-start justify-between mb-2">
							<div>
								<h3 class="font-semibold">{item.name}</h3>
								<p class="text-sm text-muted-foreground">{item.category} • {item.store}</p>
							</div>
							<div class="text-right">
								<p class="font-bold">{formatCurrency(item.price)}</p>
								<span class="px-2 py-0.5 text-xs font-medium rounded {getStatusColor(item.status)}">
									{item.status === 'purchased' ? 'Purchased' : item.status === 'partially_funded' ? 'Partially Funded' : 'Available'}
								</span>
							</div>
						</div>
						
						<p class="text-sm text-muted-foreground mb-3">{item.description}</p>
						
						{#if item.status === 'purchased' && item.purchasedBy}
							<div class="flex items-center gap-2 text-sm">
								<svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
								</svg>
								<span class="text-green-600">Purchased by {item.purchasedBy} on {item.purchaseDate}</span>
							</div>
						{:else if item.status === 'partially_funded'}
							<div class="flex items-center gap-2 text-sm">
								<svg class="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
								</svg>
								<span class="text-yellow-600">Partially funded - {formatCurrency(item.price * 0.6)} received</span>
							</div>
						{:else}
							<div class="flex gap-2">
								<button class="px-3 py-1 text-sm border rounded hover:bg-muted/50 transition-colors">
									Edit
								</button>
								<button class="px-3 py-1 text-sm border rounded hover:bg-muted/50 transition-colors">
									Share
								</button>
							</div>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>