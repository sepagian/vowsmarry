<script lang="ts">
	// Dummy souvenir data
	const souvenirs = [
		{
			id: 1,
			name: 'Personalized Keychains',
			type: 'Keychain',
			quantity: 200,
			unitCost: 15000,
			totalCost: 3000000,
			vendor: 'Custom Gifts Indonesia',
			status: 'ordered',
			orderDate: '2024-08-15',
			deliveryDate: '2024-09-15',
			distributed: 0,
			notes: 'Heart-shaped keychains with couple names and wedding date'
		},
		{
			id: 2,
			name: 'Mini Succulent Plants',
			type: 'Plant',
			quantity: 150,
			unitCost: 25000,
			totalCost: 3750000,
			vendor: 'Green Thumb Nursery',
			status: 'planning',
			orderDate: null,
			deliveryDate: '2024-10-01',
			distributed: 0,
			notes: 'Small potted succulents with thank you tags'
		},
		{
			id: 3,
			name: 'Custom Bookmarks',
			type: 'Stationery',
			quantity: 100,
			unitCost: 8000,
			totalCost: 800000,
			vendor: 'Print Perfect',
			status: 'delivered',
			orderDate: '2024-08-01',
			deliveryDate: '2024-08-20',
			distributed: 75,
			notes: 'Elegant bookmarks with wedding photo and quote'
		},
		{
			id: 4,
			name: 'Honey Jars',
			type: 'Food',
			quantity: 180,
			unitCost: 20000,
			totalCost: 3600000,
			vendor: 'Sweet Honey Co.',
			status: 'ordered',
			orderDate: '2024-08-10',
			deliveryDate: '2024-09-25',
			distributed: 0,
			notes: 'Small honey jars with custom labels "Sweet beginnings"'
		},
		{
			id: 5,
			name: 'Scented Candles',
			type: 'Candle',
			quantity: 120,
			unitCost: 35000,
			totalCost: 4200000,
			vendor: 'Aromatic Creations',
			status: 'planning',
			orderDate: null,
			deliveryDate: '2024-10-15',
			distributed: 0,
			notes: 'Vanilla scented candles in glass jars with wedding labels'
		}
	];

	const souvenirStats = {
		totalItems: souvenirs.reduce((sum, item) => sum + item.quantity, 0),
		totalCost: souvenirs.reduce((sum, item) => sum + item.totalCost, 0),
		delivered: souvenirs.filter(s => s.status === 'delivered').length,
		ordered: souvenirs.filter(s => s.status === 'ordered').length,
		planning: souvenirs.filter(s => s.status === 'planning').length,
		distributed: souvenirs.reduce((sum, item) => sum + item.distributed, 0)
	};

	function formatCurrency(amount: number) {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(amount);
	}

	function getStatusIcon(status: string) {
		switch (status) {
			case 'delivered':
				return '✅';
			case 'ordered':
				return '📦';
			case 'planning':
				return '📝';
			default:
				return '❓';
		}
	}

	function getTypeIcon(type: string) {
		switch (type) {
			case 'Keychain':
				return '🔑';
			case 'Plant':
				return '🌱';
			case 'Stationery':
				return '📖';
			case 'Food':
				return '🍯';
			case 'Candle':
				return '🕯️';
			default:
				return '🎁';
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
			<p class="text-2xl font-bold">{souvenirStats.totalItems}</p>
		</div>

		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Total Cost</p>
				<span class="text-lg">💰</span>
			</div>
			<p class="text-2xl font-bold">{formatCurrency(souvenirStats.totalCost)}</p>
		</div>

		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Delivered</p>
				<span class="text-lg">✅</span>
			</div>
			<p class="text-2xl font-bold">{souvenirStats.delivered}</p>
			<p class="text-sm text-muted-foreground">of {souvenirs.length} types</p>
		</div>

		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Distributed</p>
				<span class="text-lg">🎁</span>
			</div>
			<p class="text-2xl font-bold">{souvenirStats.distributed}</p>
			<p class="text-sm text-muted-foreground">{Math.round((souvenirStats.distributed / souvenirStats.totalItems) * 100)}% given out</p>
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
			{#each souvenirs as souvenir}
				<div class="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
					<div class="flex items-start justify-between mb-3">
						<div class="flex items-start gap-3">
							<div class="flex items-center justify-center w-8 h-8 rounded border">
								<span class="text-sm">{getTypeIcon(souvenir.type)}</span>
							</div>
							<div>
								<h3 class="font-semibold">{souvenir.name}</h3>
								<p class="text-sm text-muted-foreground">{souvenir.type} • {souvenir.vendor}</p>
							</div>
						</div>
						<div class="text-right">
							<div class="flex items-center gap-2 mb-1">
								<span class="px-2 py-1 text-xs font-medium rounded bg-muted text-muted-foreground">
									{souvenir.status}
								</span>
								<span class="text-lg">{getStatusIcon(souvenir.status)}</span>
							</div>
							<p class="text-lg font-bold">{formatCurrency(souvenir.totalCost)}</p>
						</div>
					</div>

					<div class="grid gap-2 md:grid-cols-3 text-sm text-muted-foreground mb-3">
						<div class="flex items-center gap-2">
							<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clip-rule="evenodd" />
							</svg>
							<span>Quantity: {souvenir.quantity}</span>
						</div>
						<div class="flex items-center gap-2">
							<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
								<path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
							</svg>
							<span>Unit: {formatCurrency(souvenir.unitCost)}</span>
						</div>
						{#if souvenir.deliveryDate}
							<div class="flex items-center gap-2">
								<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
								</svg>
								<span>Delivery: {souvenir.deliveryDate}</span>
							</div>
						{/if}
					</div>

					{#if souvenir.distributed > 0}
						<div class="mb-3">
							<div class="flex justify-between text-sm mb-1">
								<span class="text-muted-foreground">Distribution Progress</span>
								<span class="font-medium">{souvenir.distributed} / {souvenir.quantity}</span>
							</div>
							<div class="w-full bg-muted rounded-full h-2">
								<div
									class="bg-foreground h-2 rounded-full"
									style="width: {(souvenir.distributed / souvenir.quantity) * 100}%"
								></div>
							</div>
						</div>
					{/if}

					<div class="p-3 bg-muted rounded-lg">
						<p class="text-sm"><strong>Notes:</strong> {souvenir.notes}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Distribution Tracking -->
	<div class="rounded-lg border bg-card p-4">
		<h2 class="text-lg font-semibold mb-4">Distribution Tracking</h2>
		<div class="grid gap-4 md:grid-cols-2">
			{#each souvenirs.filter(s => s.status === 'delivered') as souvenir}
				<div class="p-3 border rounded-lg">
					<div class="flex items-center justify-between mb-2">
						<h3 class="font-medium">{souvenir.name}</h3>
						<span class="text-sm text-muted-foreground">{souvenir.distributed}/{souvenir.quantity}</span>
					</div>
					<div class="flex gap-2">
						<button class="px-3 py-1 text-xs bg-muted rounded hover:bg-muted/80">
							Mark as Distributed
						</button>
						<button class="px-3 py-1 text-xs bg-muted rounded hover:bg-muted/80">
							View Recipients
						</button>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Add New Souvenir -->
	<div class="rounded-lg border bg-card p-4">
		<h3 class="text-lg font-semibold mb-3">Add New Souvenir</h3>
		<div class="grid gap-3 md:grid-cols-2">
			<div>
				<label class="text-sm font-medium text-muted-foreground">Souvenir Name</label>
				<input type="text" placeholder="e.g., Custom Keychains" class="w-full mt-1 px-3 py-2 border rounded-lg bg-background" />
			</div>
			<div>
				<label class="text-sm font-medium text-muted-foreground">Type</label>
				<select class="w-full mt-1 px-3 py-2 border rounded-lg bg-background">
					<option>Keychain</option>
					<option>Plant</option>
					<option>Stationery</option>
					<option>Food</option>
					<option>Candle</option>
					<option>Other</option>
				</select>
			</div>
			<div>
				<label class="text-sm font-medium text-muted-foreground">Quantity</label>
				<input type="number" placeholder="0" class="w-full mt-1 px-3 py-2 border rounded-lg bg-background" />
			</div>
			<div>
				<label class="text-sm font-medium text-muted-foreground">Unit Cost (IDR)</label>
				<input type="number" placeholder="0" class="w-full mt-1 px-3 py-2 border rounded-lg bg-background" />
			</div>
			<div>
				<label class="text-sm font-medium text-muted-foreground">Vendor</label>
				<input type="text" placeholder="Vendor name" class="w-full mt-1 px-3 py-2 border rounded-lg bg-background" />
			</div>
			<div>
				<label class="text-sm font-medium text-muted-foreground">Status</label>
				<select class="w-full mt-1 px-3 py-2 border rounded-lg bg-background">
					<option>planning</option>
					<option>ordered</option>
					<option>delivered</option>
				</select>
			</div>
			<div>
				<label class="text-sm font-medium text-muted-foreground">Order Date</label>
				<input type="date" class="w-full mt-1 px-3 py-2 border rounded-lg bg-background" />
			</div>
			<div>
				<label class="text-sm font-medium text-muted-foreground">Expected Delivery</label>
				<input type="date" class="w-full mt-1 px-3 py-2 border rounded-lg bg-background" />
			</div>
		</div>
		<div class="mt-3">
			<label class="text-sm font-medium text-muted-foreground">Notes</label>
			<textarea placeholder="Description and special notes about this souvenir..." class="w-full mt-1 px-3 py-2 border rounded-lg bg-background" rows="3"></textarea>
		</div>
		<button class="mt-3 px-4 py-2 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors">
			Add Souvenir
		</button>
	</div>
</div>