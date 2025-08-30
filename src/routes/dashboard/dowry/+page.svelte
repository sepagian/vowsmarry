<script lang="ts">
	let { data } = $props();

	const dowryItems = data.dowryItems;
	const dowryStats = data.dowryStats;

	function formatCurrency(amount: number) {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(amount);
	}

	function getStatusIcon(status: string | null) {
		switch (status) {
			case 'received':
				return '✅';
			case 'promised':
				return '🤝';
			case 'documented':
				return '📄';
			case 'verified':
				return '✔️';
			default:
				return '❓';
		}
	}

	function getTypeIcon(type: string | null) {
		switch (type) {
			case 'cash':
				return '💰';
			case 'gold':
				return '🥇';
			case 'property':
				return '🏠';
			case 'jewelry':
				return '💍';
			case 'vehicle':
				return '🚗';
			case 'electronics':
				return '📱';
			case 'furniture':
				return '🏡';
			default:
				return '💎';
		}
	}

	function getStatusColor(status: string | null) {
		if (!status) return 'bg-gray-100 text-gray-800';
		switch (status) {
			case 'received':
			case 'verified':
				return 'bg-green-100 text-green-800';
			case 'documented':
				return 'bg-blue-100 text-blue-800';
			case 'promised':
				return 'bg-yellow-100 text-yellow-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}

	function formatDate(dateString: string | null) {
		if (!dateString) return 'Not received';
		return new Date(dateString).toLocaleDateString('id-ID');
	}
</script>

<div class="flex flex-1 flex-col gap-4 p-4">
	<!-- Header -->
	<div class="flex flex-col gap-2">
		<h1 class="text-2xl font-semibold">Dowry (Mahar) Management</h1>
		<p class="text-muted-foreground">Track dowry details, amounts, and documentation for your wedding.</p>
	</div>

	<!-- Dowry Statistics -->
	<div class="grid gap-4 md:grid-cols-4">
		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Total Value</p>
				<svg class="w-5 h-5 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
					<path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
				</svg>
			</div>
			<p class="text-2xl font-bold">{formatCurrency(dowryStats.totalValue)}</p>
		</div>

		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Received</p>
				<span class="text-lg">✅</span>
			</div>
			<p class="text-2xl font-bold">{formatCurrency(dowryStats.received * (dowryStats.totalValue / dowryStats.total))}</p>
			<p class="text-sm text-muted-foreground">{dowryStats.received} items received</p>
		</div>

		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Promised</p>
				<span class="text-lg">🤝</span>
			</div>
			<p class="text-2xl font-bold">{formatCurrency(dowryStats.promised * (dowryStats.totalValue / dowryStats.total))}</p>
			<p class="text-sm text-muted-foreground">{dowryStats.promised} items promised</p>
		</div>

		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Documented</p>
				<span class="text-lg">📄</span>
			</div>
			<p class="text-2xl font-bold">{dowryStats.documented}</p>
			<p class="text-sm text-muted-foreground">items documented</p>
		</div>
	</div>	
    <!-- Dowry Items List -->
	<div class="rounded-lg border bg-card p-4">
		<div class="flex items-center justify-between mb-4">
			<h2 class="text-lg font-semibold">Dowry Items</h2>
			<div class="flex gap-2">
				<button class="text-sm font-medium hover:underline">Export List</button>
				<button class="text-sm font-medium hover:underline">Add Item</button>
			</div>
		</div>

		<div class="space-y-4">
			{#if dowryItems.length > 0}
				{#each dowryItems as item}
					<div class="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
						<div class="flex items-start justify-between mb-3">
							<div class="flex items-start gap-3">
								<div class="flex items-center justify-center w-8 h-8 rounded border">
									<span class="text-sm">{getTypeIcon(item.type)}</span>
								</div>
								<div>
									<h3 class="font-semibold">{item.description}</h3>
									<p class="text-sm text-muted-foreground capitalize">{item.type}</p>
									{#if item.giver && item.receiver}
										<p class="text-xs text-muted-foreground mt-1">From: {item.giver} → To: {item.receiver}</p>
									{/if}
								</div>
							</div>
							<div class="text-right">
								<div class="flex items-center gap-2 mb-1">
									<span class="px-2 py-1 text-xs font-medium rounded {getStatusColor(item.status)}">
										{(item.status || 'promised').replace('_', ' ')}
									</span>
									<span class="text-lg">{getStatusIcon(item.status)}</span>
								</div>
								<p class="text-lg font-bold">{formatCurrency(Number(item.value))}</p>
								{#if item.currency !== 'IDR'}
									<p class="text-xs text-muted-foreground">({item.currency})</p>
								{/if}
							</div>
						</div>

						<div class="grid gap-2 md:grid-cols-2 text-sm text-muted-foreground mb-3">
							{#if item.receivedDate}
								<div class="flex items-center gap-2">
									<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
									</svg>
									<span>Received: {formatDate(item.receivedDate)}</span>
								</div>
							{/if}
							{#if item.proofUrl && item.proofUrl.length > 0}
								<div class="flex items-center gap-2">
									<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd" />
									</svg>
									<a href={item.proofUrl[0]} class="hover:underline">View Proof ({item.proofUrl.length} files)</a>
								</div>
							{/if}
						</div>

						{#if item.notes}
							<div class="p-3 bg-muted rounded-lg">
								<p class="text-sm"><strong>Notes:</strong> {item.notes}</p>
							</div>
						{/if}
					</div>
				{/each}
			{:else}
				<div class="text-center py-8 text-muted-foreground">
					<p>No dowry items yet. Start by adding your first dowry item!</p>
				</div>
			{/if}
		</div>
	</div>

	<!-- Dowry Summary by Type -->
	<div class="rounded-lg border bg-card p-4">
		<h2 class="text-lg font-semibold mb-4">Summary by Type</h2>
		<div class="grid gap-3 md:grid-cols-2">
			{#each ['Cash', 'Gold', 'Property', 'Household Items', 'Investment'] as type}
				{@const typeItems = dowryItems.filter(item => item.type === type)}
				{@const typeTotal = typeItems.reduce((sum, item) => sum + Number(item.value), 0)}
				{#if typeTotal > 0}
					<div class="flex items-center justify-between p-3 border rounded-lg">
						<div class="flex items-center gap-3">
							<span class="text-lg">{getTypeIcon(type)}</span>
							<div>
								<p class="font-medium">{type}</p>
								<p class="text-sm text-muted-foreground">{typeItems.length} item{typeItems.length !== 1 ? 's' : ''}</p>
							</div>
						</div>
						<span class="font-bold">{formatCurrency(typeTotal)}</span>
					</div>
				{/if}
			{/each}
		</div>
	</div>

	<!-- Add New Dowry Item -->
	<div class="rounded-lg border bg-card p-4">
		<h3 class="text-lg font-semibold mb-3">Add New Dowry Item</h3>
		<div class="grid gap-3 md:grid-cols-2">
			<div>
				<label for="dowry-description" class="text-sm font-medium text-muted-foreground">Description</label>
				<input id="dowry-description" type="text" placeholder="e.g., Gold necklace set" class="w-full mt-1 px-3 py-2 border rounded-lg bg-background" />
			</div>
			<div>
				<label for="dowry-type" class="text-sm font-medium text-muted-foreground">Type</label>
				<select id="dowry-type" class="w-full mt-1 px-3 py-2 border rounded-lg bg-background">
					<option>Cash</option>
					<option>Gold</option>
					<option>Property</option>
					<option>Household Items</option>
					<option>Investment</option>
					<option>Other</option>
				</select>
			</div>
			<div>
				<label for="dowry-value" class="text-sm font-medium text-muted-foreground">Value (IDR)</label>
				<input id="dowry-value" type="number" placeholder="0" class="w-full mt-1 px-3 py-2 border rounded-lg bg-background" />
			</div>
			<div>
				<label for="dowry-status" class="text-sm font-medium text-muted-foreground">Status</label>
				<select id="dowry-status" class="w-full mt-1 px-3 py-2 border rounded-lg bg-background">
					<option>pending</option>
					<option>promised</option>
					<option>received</option>
				</select>
			</div>
			<div>
				<label for="dowry-received-date" class="text-sm font-medium text-muted-foreground">Received Date</label>
				<input id="dowry-received-date" type="date" class="w-full mt-1 px-3 py-2 border rounded-lg bg-background" />
			</div>
			<div>
				<label for="dowry-proof" class="text-sm font-medium text-muted-foreground">Upload Proof</label>
				<input id="dowry-proof" type="file" accept=".pdf,.jpg,.png,.jpeg" class="w-full mt-1 px-3 py-2 border rounded-lg bg-background" />
			</div>
		</div>
		<div class="mt-3">
			<label for="dowry-notes" class="text-sm font-medium text-muted-foreground">Notes</label>
			<textarea id="dowry-notes" placeholder="Additional details about this dowry item..." class="w-full mt-1 px-3 py-2 border rounded-lg bg-background" rows="3"></textarea>
		</div>
		<button class="mt-3 px-4 py-2 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors">
			Add Dowry Item
		</button>
	</div>
</div>