<script lang="ts">
	// Dummy RSVP data
	const rsvpStats = {
		totalInvited: 150,
		responded: 104,
		attending: 89,
		notAttending: 15,
		responseRate: 69
	};

	const rsvpResponses = [
		{
			id: 1,
			guestName: 'Michael Johnson',
			email: 'michael.johnson@email.com',
			status: 'attending',
			plusOne: true,
			plusOneName: 'Jennifer Johnson',
			dietaryRestrictions: 'Vegetarian',
			specialRequests: 'Wheelchair accessible seating',
			responseDate: '2024-08-15',
			message: 'So excited to celebrate with you both!'
		},
		{
			id: 2,
			guestName: 'Emily Davis',
			email: 'emily.davis@email.com',
			status: 'attending',
			plusOne: false,
			plusOneName: null,
			dietaryRestrictions: 'None',
			specialRequests: 'None',
			responseDate: '2024-08-18',
			message: 'Cannot wait for your special day!'
		},
		{
			id: 3,
			guestName: 'Robert Smith',
			email: 'robert.smith@email.com',
			status: 'not_attending',
			plusOne: false,
			plusOneName: null,
			dietaryRestrictions: 'None',
			specialRequests: 'None',
			responseDate: '2024-08-20',
			message: 'Sorry we cannot make it, but sending our love!'
		},
		{
			id: 4,
			guestName: 'Lisa Wilson',
			email: 'lisa.wilson@email.com',
			status: 'attending',
			plusOne: true,
			plusOneName: 'Mark Wilson',
			dietaryRestrictions: 'Gluten-free',
			specialRequests: 'None',
			responseDate: '2024-08-22',
			message: 'Looking forward to the celebration!'
		}
	];

	const rsvpSettings = {
		deadline: '2024-10-15',
		allowPlusOne: true,
		collectDietaryInfo: true,
		collectSpecialRequests: true,
		customMessage: 'We are so excited to celebrate our special day with you!'
	};

	function getStatusIcon(status: string) {
		switch (status) {
			case 'attending':
				return '✓';
			case 'not_attending':
				return '✗';
			default:
				return '?';
		}
	}
</script>

<div class="flex flex-1 flex-col gap-4 p-4">
	<!-- Header -->
	<div class="flex flex-col gap-2">
		<h1 class="text-2xl font-semibold">RSVP Management</h1>
		<p class="text-muted-foreground">Track guest responses and manage RSVP settings.</p>
	</div>

	<!-- RSVP Statistics -->
	<div class="grid gap-4 md:grid-cols-4">
		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Response Rate</p>
				<svg class="w-5 h-5 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
					<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
			</div>
			<p class="text-2xl font-bold">{rsvpStats.responseRate}%</p>
			<p class="text-sm text-muted-foreground">{rsvpStats.responded} of {rsvpStats.totalInvited}</p>
		</div>

		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Attending</p>
				<span class="text-lg">✓</span>
			</div>
			<p class="text-2xl font-bold">{rsvpStats.attending}</p>
		</div>

		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Not Attending</p>
				<span class="text-lg">✗</span>
			</div>
			<p class="text-2xl font-bold">{rsvpStats.notAttending}</p>
		</div>

		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Pending</p>
				<span class="text-lg">⏳</span>
			</div>
			<p class="text-2xl font-bold">{rsvpStats.totalInvited - rsvpStats.responded}</p>
		</div>
	</div>

	<!-- RSVP Settings -->
	<div class="rounded-lg border bg-card p-4">
		<div class="flex items-center justify-between mb-4">
			<h2 class="text-lg font-semibold">RSVP Settings</h2>
			<button class="text-sm font-medium hover:underline">Edit Settings</button>
		</div>
		
		<div class="grid gap-4 md:grid-cols-2">
			<div class="space-y-3">
				<div>
					<p class="text-sm font-medium text-muted-foreground">RSVP Deadline</p>
					<p class="font-medium">{rsvpSettings.deadline}</p>
				</div>
				<div>
					<p class="text-sm font-medium text-muted-foreground">Plus One Allowed</p>
					<p class="font-medium">{rsvpSettings.allowPlusOne ? 'Yes' : 'No'}</p>
				</div>
			</div>
			<div class="space-y-3">
				<div>
					<p class="text-sm font-medium text-muted-foreground">Collect Dietary Info</p>
					<p class="font-medium">{rsvpSettings.collectDietaryInfo ? 'Yes' : 'No'}</p>
				</div>
				<div>
					<p class="text-sm font-medium text-muted-foreground">Special Requests</p>
					<p class="font-medium">{rsvpSettings.collectSpecialRequests ? 'Yes' : 'No'}</p>
				</div>
			</div>
		</div>
		
		<div class="mt-4">
			<p class="text-sm font-medium text-muted-foreground mb-2">Custom Message</p>
			<p class="text-sm bg-muted p-3 rounded-lg">{rsvpSettings.customMessage}</p>
		</div>
	</div>

	<!-- RSVP Responses -->
	<div class="rounded-lg border bg-card p-4">
		<div class="flex items-center justify-between mb-4">
			<h2 class="text-lg font-semibold">Recent Responses</h2>
			<div class="flex gap-2">
				<button class="text-sm font-medium hover:underline">Export</button>
				<button class="text-sm font-medium hover:underline">Send Reminders</button>
			</div>
		</div>
		
		<div class="space-y-3">
			{#each rsvpResponses as response}
				<div class="flex items-start gap-4 p-4 border rounded-lg">
					<div class="flex items-center justify-center w-8 h-8 rounded-full border">
						<span class="text-sm">{getStatusIcon(response.status)}</span>
					</div>
					
					<div class="flex-1">
						<div class="flex items-center justify-between mb-2">
							<div>
								<h3 class="font-medium">{response.guestName}</h3>
								<p class="text-sm text-muted-foreground">{response.email}</p>
							</div>
							<div class="text-right">
								<span class="px-2 py-1 text-xs font-medium rounded {response.status === 'attending' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
									{response.status === 'attending' ? 'Attending' : 'Not Attending'}
								</span>
								<p class="text-xs text-muted-foreground mt-1">{response.responseDate}</p>
							</div>
						</div>
						
						{#if response.plusOne && response.plusOneName}
							<div class="flex items-center gap-2 mb-2">
								<span class="px-2 py-0.5 text-xs bg-muted rounded">+1</span>
								<span class="text-sm">{response.plusOneName}</span>
							</div>
						{/if}
						
						<div class="grid gap-2 md:grid-cols-2 text-sm text-muted-foreground">
							{#if response.dietaryRestrictions !== 'None'}
								<div>
									<span class="font-medium">Dietary:</span> {response.dietaryRestrictions}
								</div>
							{/if}
							{#if response.specialRequests !== 'None'}
								<div>
									<span class="font-medium">Special Requests:</span> {response.specialRequests}
								</div>
							{/if}
						</div>
						
						{#if response.message}
							<div class="mt-2 p-2 bg-muted rounded text-sm">
								<span class="font-medium">Message:</span> {response.message}
							</div>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>