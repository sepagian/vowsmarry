<script lang="ts">
	let { data } = $props();

	const vendors = data.vendors;
	const vendorStats = data.vendorStats;

	function formatCurrency(amount: number) {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(amount);
	}

	function getStatusIcon(status: string | null) {
		switch (status) {
			case 'booked':
				return '✓';
			case 'negotiating':
				return '💬';
			case 'contacted':
				return '📞';
			case 'completed':
				return '✅';
			default:
				return '⏳';
		}
	}

	function getStatusColor(status: string | null) {
		if (!status) return 'bg-gray-100 text-gray-800';
		switch (status) {
			case 'booked':
			case 'completed':
				return 'bg-green-100 text-green-800';
			case 'negotiating':
				return 'bg-blue-100 text-blue-800';
			case 'contacted':
				return 'bg-yellow-100 text-yellow-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}
</script>

<div class="flex flex-1 flex-col gap-4 p-4">
	<!-- Header -->
	<div class="flex flex-col gap-2">
		<h1 class="text-2xl font-semibold">Vendor Management</h1>
		<p class="text-muted-foreground">Manage your wedding vendors and track their status.</p>
	</div>

	<!-- Vendor Statistics -->
	<div class="grid gap-4 md:grid-cols-4">
		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Total Vendors</p>
				<svg class="w-5 h-5 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
					<path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
				</svg>
			</div>
			<p class="text-2xl font-bold">{vendorStats.total}</p>
		</div>

		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Booked</p>
				<span class="text-lg">✓</span>
			</div>
			<p class="text-2xl font-bold">{vendorStats.booked}</p>
			<p class="text-sm text-muted-foreground">{Math.round((vendorStats.booked / vendorStats.total) * 100)}% confirmed</p>
		</div>

		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Negotiating</p>
				<span class="text-lg">💬</span>
			</div>
			<p class="text-2xl font-bold">{vendorStats.negotiating}</p>
		</div>

		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Contacted</p>
				<span class="text-lg">📞</span>
			</div>
			<p class="text-2xl font-bold">{vendorStats.contacted}</p>
		</div>
	</div>

	<!-- Vendor List -->
	<div class="rounded-lg border bg-card p-4">
		<div class="flex items-center justify-between mb-4">
			<h2 class="text-lg font-semibold">All Vendors</h2>
			<div class="flex gap-2">
				<button class="text-sm font-medium hover:underline">Filter</button>
				<button class="text-sm font-medium hover:underline">Add Vendor</button>
			</div>
		</div>

		<div class="space-y-4">
			{#if vendors.length > 0}
				{#each vendors as vendor}
					<div class="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
						<div class="flex items-start justify-between mb-3">
							<div class="flex items-start gap-3">
								<div class="flex items-center justify-center w-8 h-8 rounded border">
									<span class="text-sm">{getStatusIcon(vendor.status)}</span>
								</div>
								<div>
									<h3 class="font-semibold">{vendor.name}</h3>
									<p class="text-sm text-muted-foreground">{vendor.category}</p>
									{#if vendor.rating}
										<div class="flex items-center gap-1 mt-1">
											<span class="text-sm">⭐</span>
											<span class="text-sm font-medium">{vendor.rating}</span>
										</div>
									{/if}
								</div>
							</div>
							<div class="text-right">
								<span class="px-2 py-1 text-xs font-medium rounded {getStatusColor(vendor.status)}">
									{(vendor.status || 'contacted').replace('_', ' ')}
								</span>
								{#if vendor.totalCost}
									<p class="text-lg font-bold mt-1">{formatCurrency(Number(vendor.totalCost))}</p>
								{/if}
							</div>
						</div>

						{#if vendor.contactInfo}
							<div class="grid gap-2 md:grid-cols-2 text-sm text-muted-foreground mb-3">
								{#if vendor.contactInfo.phone}
									<div class="flex items-center gap-2">
										<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
											<path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
										</svg>
										<span>{vendor.contactInfo.phone}</span>
									</div>
								{/if}
								{#if vendor.contactInfo.email}
									<div class="flex items-center gap-2">
										<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
											<path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
											<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
										</svg>
										<span>{vendor.contactInfo.email}</span>
									</div>
								{/if}
							</div>
						{/if}

						{#if vendor.notes}
							<div class="p-3 bg-muted rounded-lg">
								<p class="text-sm"><strong>Notes:</strong> {vendor.notes}</p>
							</div>
						{/if}
					</div>
				{/each}
			{:else}
				<div class="text-center py-8 text-muted-foreground">
					<p>No vendors yet. Start by adding your first vendor!</p>
				</div>
			{/if}
		</div>
	</div>

	<!-- Add New Vendor -->
	<div class="rounded-lg border bg-card p-4">
		<h3 class="text-lg font-semibold mb-3">Add New Vendor</h3>
		<div class="grid gap-3 md:grid-cols-2">
			<div>
				<label for="vendor-name" class="text-sm font-medium text-muted-foreground">Vendor Name</label>
				<input id="vendor-name" type="text" placeholder="Enter vendor name..." class="w-full mt-1 px-3 py-2 border rounded-lg bg-background" />
			</div>
			<div>
				<label for="vendor-category" class="text-sm font-medium text-muted-foreground">Category</label>
				<select id="vendor-category" class="w-full mt-1 px-3 py-2 border rounded-lg bg-background">
					<option>Venue</option>
					<option>Catering</option>
					<option>Photography</option>
					<option>Decoration</option>
					<option>Entertainment</option>
					<option>Transportation</option>
					<option>Other</option>
				</select>
			</div>
			<div>
				<label for="vendor-contact" class="text-sm font-medium text-muted-foreground">Contact Number</label>
				<input id="vendor-contact" type="tel" placeholder="+62 xxx xxxx xxxx" class="w-full mt-1 px-3 py-2 border rounded-lg bg-background" />
			</div>
			<div>
				<label for="vendor-email" class="text-sm font-medium text-muted-foreground">Email</label>
				<input id="vendor-email" type="email" placeholder="vendor@example.com" class="w-full mt-1 px-3 py-2 border rounded-lg bg-background" />
			</div>
			<div>
				<label for="vendor-price" class="text-sm font-medium text-muted-foreground">Estimated Price</label>
				<input id="vendor-price" type="number" placeholder="0" class="w-full mt-1 px-3 py-2 border rounded-lg bg-background" />
			</div>
			<div>
				<label for="vendor-status" class="text-sm font-medium text-muted-foreground">Status</label>
				<select id="vendor-status" class="w-full mt-1 px-3 py-2 border rounded-lg bg-background">
					<option>pending</option>
					<option>contacted</option>
					<option>negotiating</option>
					<option>booked</option>
				</select>
			</div>
		</div>
		<div class="mt-3">
			<label for="vendor-notes" class="text-sm font-medium text-muted-foreground">Notes</label>
			<textarea id="vendor-notes" placeholder="Add any notes about this vendor..." class="w-full mt-1 px-3 py-2 border rounded-lg bg-background" rows="3"></textarea>
		</div>
		<button class="mt-3 px-4 py-2 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors">
			Add Vendor
		</button>
	</div>
</div>