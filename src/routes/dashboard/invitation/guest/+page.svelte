<script lang="ts">
	// Dummy guest data
	const guestStats = {
		total: 150,
		confirmed: 89,
		pending: 45,
		declined: 16
	};

	const guests = [
		{
			id: 1,
			name: 'Michael Johnson',
			email: 'michael.johnson@email.com',
			phone: '+1234567890',
			category: 'Family',
			side: 'Bride',
			status: 'confirmed',
			plusOne: true,
			dietaryRestrictions: 'Vegetarian',
			invitationSent: true,
			rsvpDate: '2024-08-15'
		},
		{
			id: 2,
			name: 'Emily Davis',
			email: 'emily.davis@email.com',
			phone: '+1234567891',
			category: 'Friends',
			side: 'Bride',
			status: 'pending',
			plusOne: false,
			dietaryRestrictions: 'None',
			invitationSent: true,
			rsvpDate: null
		},
		{
			id: 3,
			name: 'Robert Smith',
			email: 'robert.smith@email.com',
			phone: '+1234567892',
			category: 'Family',
			side: 'Groom',
			status: 'confirmed',
			plusOne: true,
			dietaryRestrictions: 'Gluten-free',
			invitationSent: true,
			rsvpDate: '2024-08-20'
		},
		{
			id: 4,
			name: 'Lisa Wilson',
			email: 'lisa.wilson@email.com',
			phone: '+1234567893',
			category: 'Work',
			side: 'Bride',
			status: 'declined',
			plusOne: false,
			dietaryRestrictions: 'None',
			invitationSent: true,
			rsvpDate: '2024-08-18'
		},
		{
			id: 5,
			name: 'David Brown',
			email: 'david.brown@email.com',
			phone: '+1234567894',
			category: 'Friends',
			side: 'Groom',
			status: 'pending',
			plusOne: true,
			dietaryRestrictions: 'None',
			invitationSent: false,
			rsvpDate: null
		}
	];

	function getStatusIcon(status: string) {
		switch (status) {
			case 'confirmed':
				return '✓';
			case 'declined':
				return '✗';
			default:
				return '?';
		}
	}
</script>

<div class="flex flex-1 flex-col gap-4 p-4">
	<!-- Header -->
	<div class="flex flex-col gap-2">
		<h1 class="text-2xl font-semibold">Guest Management</h1>
		<p class="text-muted-foreground">Manage your wedding guest list and track RSVPs.</p>
	</div>

	<!-- Guest Statistics -->
	<div class="grid gap-4 md:grid-cols-4">
		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Total Guests</p>
				<svg class="w-5 h-5 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
					<path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
				</svg>
			</div>
			<p class="text-2xl font-bold">{guestStats.total}</p>
		</div>

		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Confirmed</p>
				<span class="text-lg">✓</span>
			</div>
			<p class="text-2xl font-bold">{guestStats.confirmed}</p>
			<p class="text-sm text-muted-foreground">{Math.round((guestStats.confirmed / guestStats.total) * 100)}% confirmed</p>
		</div>

		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Pending</p>
				<span class="text-lg">?</span>
			</div>
			<p class="text-2xl font-bold">{guestStats.pending}</p>
		</div>

		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Declined</p>
				<span class="text-lg">✗</span>
			</div>
			<p class="text-2xl font-bold">{guestStats.declined}</p>
		</div>
	</div>

	<!-- Guest List -->
	<div class="rounded-lg border bg-card p-4">
		<div class="flex items-center justify-between mb-4">
			<h2 class="text-lg font-semibold">Guest List</h2>
			<div class="flex gap-2">
				<button class="text-sm font-medium hover:underline">Import CSV</button>
				<button class="text-sm font-medium hover:underline">Add Guest</button>
			</div>
		</div>

		<div class="space-y-3">
			{#each guests as guest}
				<div class="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
					<div class="flex items-center gap-4">
						<div class="flex items-center justify-center w-8 h-8 rounded-full border">
							<span class="text-sm">{getStatusIcon(guest.status)}</span>
						</div>
						
						<div class="flex-1">
							<div class="flex items-center gap-3 mb-1">
								<h3 class="font-medium">{guest.name}</h3>
								<span class="px-2 py-0.5 text-xs font-medium rounded bg-muted text-muted-foreground">
									{guest.category}
								</span>
								<span class="px-2 py-0.5 text-xs font-medium rounded bg-muted text-muted-foreground">
									{guest.side}
								</span>
							</div>
							
							<div class="flex items-center gap-4 text-sm text-muted-foreground">
								<span>{guest.email}</span>
								<span>{guest.phone}</span>
								{#if guest.plusOne}
									<span class="px-1 py-0.5 text-xs bg-muted rounded">+1</span>
								{/if}
								{#if guest.dietaryRestrictions !== 'None'}
									<span class="px-1 py-0.5 text-xs bg-muted rounded">{guest.dietaryRestrictions}</span>
								{/if}
							</div>
						</div>
					</div>
					
					<div class="flex items-center gap-2">
						<span class="px-2 py-1 text-xs font-medium rounded bg-muted text-muted-foreground">
							{guest.status}
						</span>
						{#if !guest.invitationSent}
							<button class="px-3 py-1 text-xs font-medium border rounded hover:bg-muted/50 transition-colors">
								Send Invite
							</button>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Quick Actions -->
	<div class="grid gap-4 md:grid-cols-2">
		<!-- Add Guest Form -->
		<div class="rounded-lg border bg-card p-4">
			<h3 class="text-lg font-semibold mb-3">Add New Guest</h3>
			<div class="space-y-3">
				<div>
					<label for="guest-name" class="text-sm font-medium text-muted-foreground">Full Name</label>
					<input id="guest-name" type="text" placeholder="Enter guest name..." class="w-full mt-1 px-3 py-2 border rounded-lg bg-background" />
				</div>
				<div>
					<label for="guest-email" class="text-sm font-medium text-muted-foreground">Email</label>
					<input id="guest-email" type="email" placeholder="guest@email.com" class="w-full mt-1 px-3 py-2 border rounded-lg bg-background" />
				</div>
				<div class="grid grid-cols-2 gap-2">
					<div>
						<label for="guest-category" class="text-sm font-medium text-muted-foreground">Category</label>
						<select id="guest-category" class="w-full mt-1 px-3 py-2 border rounded-lg bg-background">
							<option>Family</option>
							<option>Friends</option>
							<option>Work</option>
							<option>Other</option>
						</select>
					</div>
					<div>
						<label for="guest-side" class="text-sm font-medium text-muted-foreground">Side</label>
						<select id="guest-side" class="w-full mt-1 px-3 py-2 border rounded-lg bg-background">
							<option>Bride</option>
							<option>Groom</option>
							<option>Both</option>
						</select>
					</div>
				</div>
				<button class="w-full px-4 py-2 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors">
					Add Guest
				</button>
			</div>
		</div>

		<!-- Bulk Actions -->
		<div class="rounded-lg border bg-card p-4">
			<h3 class="text-lg font-semibold mb-3">Bulk Actions</h3>
			<div class="space-y-3">
				<button class="w-full px-4 py-2 border rounded-lg hover:bg-muted/50 transition-colors text-left">
					<div class="flex items-center gap-3">
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
							<path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
						</svg>
						<div>
							<p class="font-medium">Send All Invitations</p>
							<p class="text-sm text-muted-foreground">Send to pending guests</p>
						</div>
					</div>
				</button>
				
				<button class="w-full px-4 py-2 border rounded-lg hover:bg-muted/50 transition-colors text-left">
					<div class="flex items-center gap-3">
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zM3.293 7.707A1 1 0 014 7h12a1 1 0 01.707.293l2 2a1 1 0 010 1.414l-2 2A1 1 0 0116 13H4a1 1 0 01-.707-.293l-2-2a1 1 0 010-1.414l2-2z" clip-rule="evenodd" />
						</svg>
						<div>
							<p class="font-medium">Export Guest List</p>
							<p class="text-sm text-muted-foreground">Download as CSV</p>
						</div>
					</div>
				</button>
				
				<button class="w-full px-4 py-2 border rounded-lg hover:bg-muted/50 transition-colors text-left">
					<div class="flex items-center gap-3">
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
							<path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
							<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
						</svg>
						<div>
							<p class="font-medium">Send Reminders</p>
							<p class="text-sm text-muted-foreground">RSVP reminders</p>
						</div>
					</div>
				</button>
			</div>
		</div>
	</div>
</div>