<script lang="ts">
	// Dummy rundown data
	const timelineEvents = [
		{
			id: 1,
			eventName: 'Bridal Preparation',
			startTime: '08:00',
			endTime: '11:00',
			description: 'Hair, makeup, and getting dressed',
			assignedTo: 'Makeup Artist, Photographer',
			location: 'Bridal Suite',
			notes: 'Light breakfast will be served'
		},
		{
			id: 2,
			eventName: 'Groom Preparation',
			startTime: '09:00',
			endTime: '11:30',
			description: 'Getting ready with groomsmen',
			assignedTo: 'Best Man, Photographer',
			location: 'Groom Suite',
			notes: 'Boutonniere pinning at 11:15'
		},
		{
			id: 3,
			eventName: 'First Look Photos',
			startTime: '11:30',
			endTime: '12:00',
			description: 'Private first look session',
			assignedTo: 'Photographer, Videographer',
			location: 'Garden Area',
			notes: 'Weather backup: Indoor lobby'
		},
		{
			id: 4,
			eventName: 'Wedding Ceremony',
			startTime: '14:00',
			endTime: '15:00',
			description: 'Main wedding ceremony',
			assignedTo: 'Officiant, Wedding Planner',
			location: 'Main Hall',
			notes: 'Processional music starts at 13:55'
		}
	];

	const vendors = [
		{ name: 'Perfect Moments Photography', role: 'Photographer', contact: '+62 812 3456 7890' },
		{ name: 'Elegant Flowers & Decor', role: 'Decorator', contact: '+62 813 4567 8901' },
		{ name: 'Harmony Wedding Band', role: 'Music', contact: '+62 814 5678 9012' },
		{ name: 'Delicious Catering Co.', role: 'Catering', contact: '+62 21 2345 6789' }
	];
</script>

<div class="flex flex-1 flex-col gap-4 p-4">
	<!-- Header -->
	<div class="flex flex-col gap-2">
		<h1 class="text-2xl font-semibold">Wedding Day Rundown</h1>
		<p class="text-muted-foreground">Plan your wedding day timeline and assign responsibilities.</p>
	</div>

	<!-- Timeline Overview -->
	<div class="grid gap-4 md:grid-cols-3">
		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Total Events</p>
				<svg class="w-5 h-5 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
					<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
				</svg>
			</div>
			<p class="text-2xl font-bold">{timelineEvents.length}</p>
		</div>

		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Event Duration</p>
				<span class="text-lg">⏰</span>
			</div>
			<p class="text-2xl font-bold">7 Hours</p>
			<p class="text-sm text-muted-foreground">8:00 AM - 3:00 PM</p>
		</div>

		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Vendors Involved</p>
				<span class="text-lg">👥</span>
			</div>
			<p class="text-2xl font-bold">{vendors.length}</p>
		</div>
	</div>	
    <!-- Timeline Events -->
	<div class="rounded-lg border bg-card p-4">
		<div class="flex items-center justify-between mb-4">
			<h2 class="text-lg font-semibold">Wedding Day Timeline</h2>
			<div class="flex gap-2">
				<button class="text-sm font-medium hover:underline">Export PDF</button>
				<button class="text-sm font-medium hover:underline">Add Event</button>
			</div>
		</div>
		
		<div class="space-y-4">
			{#each timelineEvents as event}
				<div class="flex gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
					<div class="flex flex-col items-center min-w-0">
						<div class="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
							<span class="text-xs font-medium">{event.startTime}</span>
						</div>
						<div class="w-px h-8 bg-border mt-2"></div>
						<div class="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
							<span class="text-xs font-medium">{event.endTime}</span>
						</div>
					</div>
					
					<div class="flex-1 min-w-0">
						<div class="flex items-start justify-between mb-2">
							<div>
								<h3 class="font-semibold">{event.eventName}</h3>
								<p class="text-sm text-muted-foreground">{event.description}</p>
							</div>
							<span class="px-2 py-1 text-xs font-medium rounded bg-muted text-muted-foreground ml-4">
								{event.startTime} - {event.endTime}
							</span>
						</div>
						
						<div class="grid gap-2 md:grid-cols-2 text-sm text-muted-foreground mb-3">
							<div class="flex items-center gap-2">
								<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
								</svg>
								<span>Location: {event.location}</span>
							</div>
							<div class="flex items-center gap-2">
								<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
								</svg>
								<span>Assigned: {event.assignedTo}</span>
							</div>
						</div>
						
						{#if event.notes}
							<div class="p-3 bg-muted rounded-lg">
								<p class="text-sm"><strong>Notes:</strong> {event.notes}</p>
							</div>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Vendor Contact List -->
	<div class="rounded-lg border bg-card p-4">
		<h2 class="text-lg font-semibold mb-4">Vendor Contact List</h2>
		<div class="grid gap-3 md:grid-cols-2">
			{#each vendors as vendor}
				<div class="flex items-center justify-between p-3 border rounded-lg">
					<div>
						<p class="font-medium">{vendor.name}</p>
						<p class="text-sm text-muted-foreground">{vendor.role}</p>
					</div>
					<div class="text-right">
						<p class="text-sm font-medium">{vendor.contact}</p>
						<button class="text-xs text-muted-foreground hover:underline">Call</button>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Add New Event -->
	<div class="rounded-lg border bg-card p-4">
		<h3 class="text-lg font-semibold mb-3">Add New Event</h3>
		<div class="grid gap-3 md:grid-cols-2">
			<div>
				<label class="text-sm font-medium text-muted-foreground">Event Name</label>
				<input type="text" placeholder="e.g., Cocktail Hour" class="w-full mt-1 px-3 py-2 border rounded-lg bg-background" />
			</div>
			<div>
				<label class="text-sm font-medium text-muted-foreground">Location</label>
				<input type="text" placeholder="e.g., Garden Terrace" class="w-full mt-1 px-3 py-2 border rounded-lg bg-background" />
			</div>
			<div>
				<label class="text-sm font-medium text-muted-foreground">Start Time</label>
				<input type="time" class="w-full mt-1 px-3 py-2 border rounded-lg bg-background" />
			</div>
			<div>
				<label class="text-sm font-medium text-muted-foreground">End Time</label>
				<input type="time" class="w-full mt-1 px-3 py-2 border rounded-lg bg-background" />
			</div>
		</div>
		<div class="mt-3">
			<label class="text-sm font-medium text-muted-foreground">Description</label>
			<input type="text" placeholder="Brief description of the event..." class="w-full mt-1 px-3 py-2 border rounded-lg bg-background" />
		</div>
		<div class="mt-3">
			<label class="text-sm font-medium text-muted-foreground">Assigned To</label>
			<input type="text" placeholder="Who is responsible for this event..." class="w-full mt-1 px-3 py-2 border rounded-lg bg-background" />
		</div>
		<button class="mt-3 px-4 py-2 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors">
			Add Event
		</button>
	</div>
</div>