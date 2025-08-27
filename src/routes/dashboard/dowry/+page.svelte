<script lang="ts">
	// Dummy dowry data
	const dowryItems = [
		{
			id: 1,
			type: 'Cash',
			description: 'Wedding gift money',
			value: 50000000,
			status: 'received',
			receivedDate: '2024-08-15',
			proofUrl: '/documents/cash-receipt.pdf',
			notes: 'Received from groom\'s family during engagement ceremony'
		},
		{
			id: 2,
			type: 'Gold',
			description: '24K gold jewelry set',
			value: 75000000,
			status: 'received',
			receivedDate: '2024-08-20',
			proofUrl: '/documents/gold-certificate.pdf',
			notes: 'Traditional gold necklace, earrings, and bracelet set'
		},
		{
			id: 3,
			type: 'Property',
			description: 'Apartment down payment',
			value: 200000000,
			status: 'promised',
			receivedDate: null,
			proofUrl: null,
			notes: 'Down payment for 2-bedroom apartment, to be transferred after wedding'
		},
		{
			id: 4,
			type: 'Household Items',
			description: 'Kitchen appliances and furniture',
			value: 25000000,
			status: 'received',
			receivedDate: '2024-08-25',
			proofUrl: '/documents/appliances-receipt.pdf',
			notes: 'Refrigerator, washing machine, dining set, and kitchen utensils'
		},
		{
			id: 5,
			type: 'Investment',
			description: 'Mutual fund investment',
			value: 30000000,
			status: 'pending',
			receivedDate: null,
			proofUrl: null,
			notes: 'Investment portfolio to be set up in both names'
		}
	];

	const dowryStats = {
		total: dowryItems.reduce((sum, item) => sum + item.value, 0),
		received: dowryItems.filter(item => item.status === 'received').reduce((sum, item) => sum + item.value, 0),
		promised: dowryItems.filter(item => item.status === 'promised').reduce((sum, item) => sum + item.value, 0),
		pending: dowryItems.filter(item => item.status === 'pending').reduce((sum, item) => sum + item.value, 0)
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
			case 'received':
				return '✅';
			case 'promised':
				return '🤝';
			case 'pending':
				return '⏳';
			default:
				return '❓';
		}
	}

	function getTypeIcon(type: string) {
		switch (type) {
			case 'Cash':
				return '💰';
			case 'Gold':
				return '🥇';
			case 'Property':
				return '🏠';
			case 'Household Items':
				return '🏡';
			case 'Investment':
				return '📈';
			default:
				return '💎';
		}
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
			<p class="text-2xl font-bold">{formatCurrency(dowryStats.total)}</p>
		</div>

		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Received</p>
				<span class="text-lg">✅</span>
			</div>
			<p class="text-2xl font-bold">{formatCurrency(dowryStats.received)}</p>
			<p class="text-sm text-muted-foreground">{Math.round((dowryStats.received / dowryStats.total) * 100)}% of total</p>
		</div>

		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Promised</p>
				<span class="text-lg">🤝</span>
			</div>
			<p class="text-2xl font-bold">{formatCurrency(dowryStats.promised)}</p>
		</div>

		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Pending</p>
				<span class="text-lg">⏳</span>
			</div>
			<p class="text-2xl font-bold">{formatCurrency(dowryStats.pending)}</p>
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
			{#each dowryItems as item}
				<div class="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
					<div class="flex items-start justify-between mb-3">
						<div class="flex items-start gap-3">
							<div class="flex items-center justify-center w-8 h-8 rounded border">
								<span class="text-sm">{getTypeIcon(item.type)}</span>
							</div>
							<div>
								<h3 class="font-semibold">{item.description}</h3>
								<p class="text-sm text-muted-foreground">{item.type}</p>
							</div>
						</div>
						<div class="text-right">
							<div class="flex items-center gap-2 mb-1">
								<span class="px-2 py-1 text-xs font-medium rounded bg-muted text-muted-foreground">
									{item.status}
								</span>
								<span class="text-lg">{getStatusIcon(item.status)}</span>
							</div>
							<p class="text-lg font-bold">{formatCurrency(item.value)}</p>
						</div>
					</div>

					<div class="grid gap-2 md:grid-cols-2 text-sm text-muted-foreground mb-3">
						{#if item.receivedDate}
							<div class="flex items-center gap-2">
								<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
								</svg>
								<span>Received: {item.receivedDate}</span>
							</div>
						{/if}
						{#if item.proofUrl}
							<div class="flex items-center gap-2">
								<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd" />
								</svg>
								<a href={item.proofUrl} class="hover:underline">View Proof</a>
							</div>
						{/if}
					</div>

					<div class="p-3 bg-muted rounded-lg">
						<p class="text-sm"><strong>Notes:</strong> {item.notes}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Dowry Summary by Type -->
	<div class="rounded-lg border bg-card p-4">
		<h2 class="text-lg font-semibold mb-4">Summary by Type</h2>
		<div class="grid gap-3 md:grid-cols-2">
			{#each ['Cash', 'Gold', 'Property', 'Household Items', 'Investment'] as type}
				{@const typeItems = dowryItems.filter(item => item.type === type)}
				{@const typeTotal = typeItems.reduce((sum, item) => sum + item.value, 0)}
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
				<label class="text-sm font-medium text-muted-foreground">Description</label>
				<input type="text" placeholder="e.g., Gold necklace set" class="w-full mt-1 px-3 py-2 border rounded-lg bg-background" />
			</div>
			<div>
				<label class="text-sm font-medium text-muted-foreground">Type</label>
				<select class="w-full mt-1 px-3 py-2 border rounded-lg bg-background">
					<option>Cash</option>
					<option>Gold</option>
					<option>Property</option>
					<option>Household Items</option>
					<option>Investment</option>
					<option>Other</option>
				</select>
			</div>
			<div>
				<label class="text-sm font-medium text-muted-foreground">Value (IDR)</label>
				<input type="number" placeholder="0" class="w-full mt-1 px-3 py-2 border rounded-lg bg-background" />
			</div>
			<div>
				<label class="text-sm font-medium text-muted-foreground">Status</label>
				<select class="w-full mt-1 px-3 py-2 border rounded-lg bg-background">
					<option>pending</option>
					<option>promised</option>
					<option>received</option>
				</select>
			</div>
			<div>
				<label class="text-sm font-medium text-muted-foreground">Received Date</label>
				<input type="date" class="w-full mt-1 px-3 py-2 border rounded-lg bg-background" />
			</div>
			<div>
				<label class="text-sm font-medium text-muted-foreground">Upload Proof</label>
				<input type="file" accept=".pdf,.jpg,.png,.jpeg" class="w-full mt-1 px-3 py-2 border rounded-lg bg-background" />
			</div>
		</div>
		<div class="mt-3">
			<label class="text-sm font-medium text-muted-foreground">Notes</label>
			<textarea placeholder="Additional details about this dowry item..." class="w-full mt-1 px-3 py-2 border rounded-lg bg-background" rows="3"></textarea>
		</div>
		<button class="mt-3 px-4 py-2 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors">
			Add Dowry Item
		</button>
	</div>
</div>