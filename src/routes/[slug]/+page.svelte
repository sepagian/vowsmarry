<script lang="ts">
	import { Card, CardContent, CardHeader } from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import MapPinIcon from '@lucide/svelte/icons/map-pin';
	import HeartIcon from '@lucide/svelte/icons/heart';
	import { format } from 'date-fns';

	let { data } = $props();

	// Format the wedding date for display
	const formattedDate = $derived(() => {
		if (!data.workspace.weddingDate) return null;
		try {
			const date = new Date(data.workspace.weddingDate);
			return format(date, 'EEEE, MMMM d, yyyy');
		} catch {
			return data.workspace.weddingDate;
		}
	});

</script>

<svelte:head>
	<title>{data.workspace.groomName} & {data.workspace.brideName} - Wedding Invitation</title>
	<meta
		name="description"
		content="You're invited to {data.workspace.groomName} and {data.workspace.brideName}'s wedding"
	/>
</svelte:head>

<div class="min-h-screen bg-gradient-to-b from-rose-50 to-white dark:from-gray-900 dark:to-gray-950">
	<div class="container mx-auto px-4 py-12 md:py-20">
		<div class="mx-auto max-w-3xl">
			<!-- Header with couple names -->
			<div class="mb-8 text-center">
				<div class="mb-4 flex items-center justify-center">
					<HeartIcon class="h-8 w-8 text-rose-500" fill="currentColor" />
				</div>
				<h1 class="mb-2 font-serif text-4xl font-bold text-gray-900 dark:text-gray-100 md:text-6xl">
					{data.workspace.groomName}
					<span class="text-rose-500">&</span>
					{data.workspace.brideName}
				</h1>
				<p class="text-lg text-gray-600 dark:text-gray-400">
					Together with their families, invite you to celebrate their wedding
				</p>
			</div>

			<Separator class="my-8" />

			<!-- Wedding details card -->
			<Card class="border-2 border-rose-100 shadow-lg dark:border-rose-900">
				<CardHeader class="bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-950 dark:to-pink-950">
					<h2 class="text-center font-serif text-2xl font-semibold text-gray-900 dark:text-gray-100">
						Wedding Details
					</h2>
				</CardHeader>
				<CardContent class="space-y-6 p-8">
					<!-- Wedding date -->
					{#if data.workspace.weddingDate}
						<div class="flex items-start gap-4">
							<div class="rounded-full bg-rose-100 p-3 dark:bg-rose-900">
								<CalendarIcon class="h-6 w-6 text-rose-600 dark:text-rose-400" />
							</div>
							<div class="flex-1">
								<h3 class="mb-1 font-semibold text-gray-900 dark:text-gray-100">Date</h3>
								<p class="text-gray-700 dark:text-gray-300">
									{formattedDate()}
								</p>
							</div>
						</div>
					{/if}

					<!-- Wedding venue -->
					{#if data.workspace.weddingVenue}
						<div class="flex items-start gap-4">
							<div class="rounded-full bg-rose-100 p-3 dark:bg-rose-900">
								<MapPinIcon class="h-6 w-6 text-rose-600 dark:text-rose-400" />
							</div>
							<div class="flex-1">
								<h3 class="mb-1 font-semibold text-gray-900 dark:text-gray-100">Venue</h3>
								<p class="text-gray-700 dark:text-gray-300">
									{data.workspace.weddingVenue}
								</p>
							</div>
						</div>
					{/if}
				</CardContent>
			</Card>

			<!-- Footer message -->
			<div class="mt-12 text-center">
				<p class="text-gray-600 dark:text-gray-400">
					We look forward to celebrating this special day with you
				</p>
				<div class="mt-4 flex items-center justify-center gap-2">
					<HeartIcon class="h-4 w-4 text-rose-500" fill="currentColor" />
					<HeartIcon class="h-4 w-4 text-rose-500" fill="currentColor" />
					<HeartIcon class="h-4 w-4 text-rose-500" fill="currentColor" />
				</div>
			</div>
		</div>
	</div>
</div>
