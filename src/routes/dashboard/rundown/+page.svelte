<script lang="ts">
	let { data } = $props();

	const rundownEvents = data.rundownEvents;
	const rundownStats = data.rundownStats;

	function formatTime(dateTime: string | Date | null) {
		if (!dateTime) return '--:--';
		return new Date(dateTime).toLocaleTimeString('id-ID', {
			hour: '2-digit',
			minute: '2-digit',
			hour12: false
		});
	}

	function formatDate(dateTime: string | Date | null) {
		if (!dateTime) return 'No date set';
		return new Date(dateTime).toLocaleDateString('id-ID');
	}

	function getEventTypeIcon(type: string | null) {
		switch (type) {
			case 'ceremony':
				return '💒';
			case 'reception':
				return '🎉';
			case 'preparation':
				return '✨';
			case 'photography':
				return '📸';
			case 'transportation':
				return '🚗';
			default:
				return '📅';
		}
	}

	function getStatusColor(status: string | null) {
		switch (status) {
			case 'completed':
				return 'bg-green-100 text-green-800';
			case 'in_progress':
				return 'bg-blue-100 text-blue-800';
			case 'confirmed':
				return 'bg-purple-100 text-purple-800';
			case 'cancelled':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-yellow-100 text-yellow-800';
		}
	}

	function formatDuration(minutes: number | null) {
		if (!minutes) return '--';
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
	}
</script>

<div class="flex flex-1 flex-col gap-4 p-4">
	<!-- Header -->
	<div class="flex flex-col gap-2">
		<h1 class="text-2xl font-semibold">Wedding Day Rundown</h1>
		<p class="text-muted-foreground">Plan your wedding day timeline and assign responsibilities.</p>
	</div>

	<!-- Timeline Overview -->
	<div class="grid gap-4 md:grid-cols-4">
		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Total Events</p>
				<svg class="w-5 h-5 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
					<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
				</svg>
			</div>
			<p class="text-2xl font-bold">{rundownStats.total}</p>
		</div>

		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Completed</p>
				<span class="text-lg">✅</span>
			</div>
			<p class="text-2xl font-bold">{rundownStats.completed}</p>
			<p class="text-sm text-muted-foreground">{rundownStats.inProgress} in progress</p>
		</div>

		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Total Duration</p>
				<span class="text-lg">⏰</span>
			</div>
			<p class="text-2xl font-bold">{formatDuration(rundownStats.duration)}</p>
		</div>

		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Confirmed</p>
				<span class="text-lg">👥</span>
			</div>
			<p class="text-2xl font-bold">{rundownStats.confirmed}</p>
			<p class="text-sm text-muted-foreground">{rundownStats.planned} planned</p>
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
			{#if rundownEvents.length > 0}
				{#each rundownEvents as event}
					<div class="flex gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
						<div class="flex flex-col items-center min-w-0">
							<div class="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
								<span class="text-xs font-medium">{formatTime(event.startTime)}</span>
							</div>
							<div class="w-px h-8 bg-border mt-2"></div>
							<div class="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
								<span class="text-xs font-medium">{formatTime(event.endTime)}</span>
							</div>
						</div>
						
						<div class="flex-1 min-w-0">
							<div class="flex items-start justify-between mb-2">
								<div>
									<h3 class="font-semibold flex items-center gap-2">
										<span>{getEventTypeIcon(event.eventType)}</span>
										{event.eventName}
									</h3>
									{#if event.description}
										<p class="text-sm text-muted-foreground">{event.description}</p>
									{/if}
								</div>
								<div class="flex gap-2">
									<span class="px-2 py-1 text-xs font-medium rounded {getStatusColor(event.status)}">
										{(event.status || 'planned').replace('_', ' ')}
									</span>
									{#if event.duration}
										<span class="px-2 py-1 text-xs font-medium rounded bg-muted text-muted-foreground">
											{formatDuration(event.duration)}
										</span>
									{/if}
								</div>
							</div>
							
							<div class="grid gap-2 md:grid-cols-2 text-sm text-muted-foreground mb-3">
								{#if event.location || event.venue}
									<div class="flex items-center gap-2">
										<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
											<path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
										</svg>
										<span>Location: {event.venue || event.location}</span>
									</div>
								{/if}
								{#if event.assignedTo && event.assignedTo.length > 0}
									<div class="flex items-center gap-2">
										<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
											<path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
										</svg>
										<span>Assigned: {event.assignedTo.join(', ')}</span>
									</div>
								{/if}
							</div>
							
							{#if event.notes}
								<div class="p-3 bg-muted rounded-lg">
									<p class="text-sm"><strong>Notes:</strong> {event.notes}</p>
								</div>
							{/if}
						</div>
					</div>
				{/each}
			{:else}
				<div class="text-center py-8 text-muted-foreground">
					<div class="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto mb-3">
						<span class="text-2xl">📅</span>
					</div>
					<p class="font-medium mb-2">No events scheduled yet</p>
					<p class="text-sm">Add your first event to get started!</p>
				</div>
			{/if}
		</div>
	</div>



	<!-- Add New Event -->
	<div class="rounded-lg border bg-card p-4">
		<h3 class="text-lg font-semibold mb-3">Add New Event</h3>
		<div class="grid gap-3 md:grid-cols-2">
			<div>
				<label for="event-name" class="text-sm font-medium text-muted-foreground">Event Name</label>
				<input id="event-name" type="text" placeholder="e.g., Cocktail Hour" class="w-full mt-1 px-3 py-2 border rounded-lg bg-background" />
			</div>
			<div>
				<label for="event-location" class="text-sm font-medium text-muted-foreground">Location</label>
				<input id="event-location" type="text" placeholder="e.g., Garden Terrace" class="w-full mt-1 px-3 py-2 border rounded-lg bg-background" />
			</div>
			<div>
				<label for="event-start-time" class="text-sm font-medium text-muted-foreground">Start Time</label>
				<input id="event-start-time" type="time" class="w-full mt-1 px-3 py-2 border rounded-lg bg-background" />
			</div>
			<div>
				<label for="event-end-time" class="text-sm font-medium text-muted-foreground">End Time</label>
				<input id="event-end-time" type="time" class="w-full mt-1 px-3 py-2 border rounded-lg bg-background" />
			</div>
		</div>
		<div class="mt-3">
			<label for="event-description" class="text-sm font-medium text-muted-foreground">Description</label>
			<input id="event-description" type="text" placeholder="Brief description of the event..." class="w-full mt-1 px-3 py-2 border rounded-lg bg-background" />
		</div>
		<div class="mt-3">
			<label for="event-assigned-to" class="text-sm font-medium text-muted-foreground">Assigned To</label>
			<input id="event-assigned-to" type="text" placeholder="Who is responsible for this event..." class="w-full mt-1 px-3 py-2 border rounded-lg bg-background" />
		</div>
		<button class="mt-3 px-4 py-2 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors">
			Add Event
		</button>
	</div>
</div>