<script lang="ts">
	let { data } = $props();

	const souvenirs = data.souvenirs;
	const souvenirStats = data.souvenirStats;

	function formatCurrency(amount: number) {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(amount);
	}

	function formatDate(dateString: string | Date | null) {
		if (!dateString) return 'No date set';
		return new Date(dateString).toLocaleDateString('id-ID');
	}

	function getStatusIcon(status: string | null) {
		switch (status) {
			case 'distributed':
				return '✅';
			case 'received':
				return '📦';
			case 'ordered':
				return '📝';
			case 'planned':
				return '📋';
			default:
				return '❓';
		}
	}

	function getCategoryIcon(category: string | null) {
		switch (category) {
			case 'edible':
				return '🍯';
			case 'decorative':
				return '🎨';
			case 'practical':
				return '🔑';
			case 'religious':
				return '🙏';
			default:
				return '🎁';
		}
	}

	function getStatusColor(status: string | null) {
		switch (status) {
			case 'distributed':
				return 'bg-green-100 text-green-800';
			case 'received':
				return 'bg-blue-100 text-blue-800';
			case 'ordered':
				return 'bg-purple-100 text-purple-800';
			case 'planned':
				return 'bg-yellow-100 text-yellow-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}
</script>

<div class="flex flex-1 flex-col gap-4 p-4">
	<!-- Header -->
	<div class="flex flex-col gap-2">
		<h1 class="text-2xl font-semibold">Wedding Souvenirs</h1>
		<p class="text-muted-foreground">Manage souvenir planning, orders, and distribution to guests.</p>
	</div>

	<!-- Souvenir Statistics -->
	<div class="grid gap-4 md:grid-cols-4">
		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Total Items</p>
				<svg class="w-5 h-5 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
					<path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
				</svg>
			</div>
			<p class="text-2xl font-bold">{souvenirStats.totalQuantity}</p>
			<p class="text-sm text-muted-foreground">{souvenirStats.totalItems} types</p>
		</div>

		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Total Cost</p>
				<span class="text-lg">💰</span>
			</div>
			<p class="text-2xl font-bold">{formatCurrency(souvenirStats.totalCost)}</p>
			<p class="text-sm text-muted-foreground">Avg: {formatCurrency(souvenirStats.averageCost)}</p>
		</div>

		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Received</p>
				<span class="text-lg">✅</span>
			</div>
			<p class="text-2xl font-bold">{souvenirStats.received}</p>
			<p class="text-sm text-muted-foreground">{souvenirStats.ordered} ordered</p>
		</div>

		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Distributed</p>
				<span class="text-lg">🎁</span>
			</div>
			<p class="text-2xl font-bold">{souvenirStats.distributed}</p>
			<p class="text-sm text-muted-foreground">{souvenirStats.totalQuantity > 0 ? Math.round((souvenirStats.distributed / souvenirStats.totalQuantity) * 100) : 0}% given out</p>
		</div>
	</div>
    <!-- Souvenir List -->
	<div class="rounded-lg border bg-card p-4">
		<div class="flex items-center justify-between mb-4">
			<h2 class="text-lg font-semibold">All Souvenirs</h2>
			<div class="flex gap-2">
				<button class="text-sm font-medium hover:underline">Export List</button>
				<button class="text-sm font-medium hover:underline">Add Souvenir</button>
			</div>
		</div>

		<div class="space-y-4">
			{#if souvenirs.length > 0}
				{#each souvenirs as souvenir}
					<div class="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
						<div class="flex items-start justify-between mb-3">
							<div class="flex items-start gap-3">
								<div class="flex items-center justify-center w-8 h-8 rounded border">
									<span class="text-sm">{getCategoryIcon((souvenir as any).category)}</span>
								</div>
								<div>
									<h3 class="font-semibold">{souvenir.name}</h3>
									<p class="text-sm text-muted-foreground">
										{((souvenir as any).category || 'custom').replace('_', ' ')} • {(souvenir as any).vendorName || 'No vendor'}
									</p>
								</div>
							</div>
							<div class="text-right">
								<div class="flex items-center gap-2 mb-1">
									<span class="px-2 py-1 text-xs font-medium rounded {getStatusColor((souvenir as any).status)}">
										{((souvenir as any).status || 'planned').replace('_', ' ')}
									</span>
									<span class="text-lg">{getStatusIcon((souvenir as any).status)}</span>
								</div>
								<p class="text-lg font-bold">{formatCurrency(Number(souvenir.totalCost || 0))}</p>
							</div>
						</div>

						<div class="grid gap-2 md:grid-cols-3 text-sm text-muted-foreground mb-3">
							<div class="flex items-center gap-2">
								<span>Quantity: {souvenir.quantity}</span>
							</div>
							<div class="flex items-center gap-2">
								<span>Unit: {formatCurrency(Number(souvenir.unitCost || 0))}</span>
							</div>
							{#if (souvenir as any).expectedDelivery}
								<div class="flex items-center gap-2">
									<span>Delivery: {formatDate((souvenir as any).expectedDelivery)}</span>
								</div>
							{/if}
						</div>

						{#if (souvenir as any).description}
							<div class="p-3 bg-muted rounded-lg">
								<p class="text-sm"><strong>Description:</strong> {(souvenir as any).description}</p>
							</div>
						{/if}
					</div>
				{/each}
			{:else}
				<div class="text-center py-8 text-muted-foreground">
					<div class="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto mb-3">
						<span class="text-2xl">🎁</span>
					</div>
					<p class="font-medium mb-2">No souvenirs planned yet</p>
					<p class="text-sm">Add your first souvenir to get started!</p>
				</div>
			{/if}
		</div>
	</div>



	<!-- Add New Souvenir -->
	<div class="rounded-lg border bg-card p-4">
		<h3 class="text-lg font-semibold mb-3">Add New Souvenir</h3>
		<div class="grid gap-3 md:grid-cols-2">
			<div>
				<label for="souvenir-name" class="text-sm font-medium text-muted-foreground">Souvenir Name</label>
				<input id="souvenir-name" type="text" placeholder="e.g., Custom Keychains" class="w-full mt-1 px-3 py-2 border rounded-lg bg-background" />
			</div>
			<div>
				<label for="souvenir-type" class="text-sm font-medium text-muted-foreground">Type</label>
				<select id="souvenir-type" class="w-full mt-1 px-3 py-2 border rounded-lg bg-background">
					<option>Keychain</option>
					<option>Plant</option>
					<option>Stationery</option>
					<option>Food</option>
					<option>Candle</option>
					<option>Other</option>
				</select>
			</div>
			<div>
				<label for="souvenir-quantity" class="text-sm font-medium text-muted-foreground">Quantity</label>
				<input id="souvenir-quantity" type="number" placeholder="0" class="w-full mt-1 px-3 py-2 border rounded-lg bg-background" />
			</div>
			<div>
				<label for="souvenir-cost" class="text-sm font-medium text-muted-foreground">Unit Cost (IDR)</label>
				<input id="souvenir-cost" type="number" placeholder="0" class="w-full mt-1 px-3 py-2 border rounded-lg bg-background" />
			</div>
			<div>
				<label for="souvenir-vendor" class="text-sm font-medium text-muted-foreground">Vendor</label>
				<input id="souvenir-vendor" type="text" placeholder="Vendor name" class="w-full mt-1 px-3 py-2 border rounded-lg bg-background" />
			</div>
			<div>
				<label for="souvenir-status" class="text-sm font-medium text-muted-foreground">Status</label>
				<select id="souvenir-status" class="w-full mt-1 px-3 py-2 border rounded-lg bg-background">
					<option>planning</option>
					<option>ordered</option>
					<option>delivered</option>
				</select>
			</div>
			<div>
				<label for="souvenir-order-date" class="text-sm font-medium text-muted-foreground">Order Date</label>
				<input id="souvenir-order-date" type="date" class="w-full mt-1 px-3 py-2 border rounded-lg bg-background" />
			</div>
			<div>
				<label for="souvenir-delivery-date" class="text-sm font-medium text-muted-foreground">Expected Delivery</label>
				<input id="souvenir-delivery-date" type="date" class="w-full mt-1 px-3 py-2 border rounded-lg bg-background" />
			</div>
		</div>
		<div class="mt-3">
			<label for="souvenir-notes" class="text-sm font-medium text-muted-foreground">Notes</label>
			<textarea id="souvenir-notes" placeholder="Description and special notes about this souvenir..." class="w-full mt-1 px-3 py-2 border rounded-lg bg-background" rows="3"></textarea>
		</div>
		<button class="mt-3 px-4 py-2 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors">
			Add Souvenir
		</button>
	</div>
</div>