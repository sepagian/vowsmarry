<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Calendar, Heart, MapPin, DollarSign } from 'lucide-svelte';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';

	let { open = $bindable(false), onSuccess } = $props();
	
	let isSubmitting = $state(false);
	let formMessage = $state('');

	const handleSubmit: SubmitFunction = () => {
		isSubmitting = true;
		formMessage = '';
		
		return async ({ result }) => {
			isSubmitting = false;
			
			if (result.type === 'success') {
				formMessage = 'Wedding data created successfully!';
				setTimeout(() => {
					open = false;
					onSuccess?.();
				}, 1500);
			} else if (result.type === 'failure' && result.data?.message) {
				formMessage = result.data.message;
			}
		};
	};
</script>

<Sheet.Root bind:open>
	<Sheet.Content class="sm:max-w-md bg-base-100 p-4">
		<Sheet.Header>
			<Sheet.Title class="flex items-center gap-2">
				<Heart class="h-5 w-5 text-primary" />
				Add Wedding Information
			</Sheet.Title>
			<Sheet.Description>
				Let's get started by adding your wedding details. You can always update this information later.
			</Sheet.Description>
		</Sheet.Header>
		
		<div class="py-6">
			<form method="POST" action="/dashboard?/createWedding" use:enhance={handleSubmit}>
				<div class="space-y-4">
					<div class="space-y-2">
						<Label for="partnerName" class="text-sm font-medium">
							Partner's Name
							<span class="text-destructive ml-1" aria-label="required">*</span>
						</Label>
						<p class="text-sm text-muted-foreground">Enter your partner's full name</p>
						<div class="relative">
							<Input
								id="partnerName"
								name="partnerName"
								placeholder="Your partner's name"
								class="pl-10"
								required
							/>
							<Heart class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						</div>
					</div>

					<div class="space-y-2">
						<Label for="weddingDate" class="text-sm font-medium">
							Wedding Date
							<span class="text-destructive ml-1" aria-label="required">*</span>
						</Label>
						<p class="text-sm text-muted-foreground">When is your special day?</p>
						<div class="relative">
							<Input
								id="weddingDate"
								type="date"
								name="weddingDate"
								class="pl-10"
								required
							/>
							<Calendar class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						</div>
					</div>

					<div class="space-y-2">
						<Label for="venue" class="text-sm font-medium">Venue</Label>
						<p class="text-sm text-muted-foreground">Wedding venue or location (optional)</p>
						<div class="relative">
							<Input
								id="venue"
								name="venue"
								placeholder="e.g., Grand Ballroom, Beach Resort"
								class="pl-10"
							/>
							<MapPin class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						</div>
					</div>

					<div class="space-y-2">
						<Label for="budget" class="text-sm font-medium">Budget</Label>
						<p class="text-sm text-muted-foreground">Estimated total budget (optional)</p>
						<div class="relative">
							<Input
								id="budget"
								type="number"
								name="budget"
								placeholder="0"
								class="pl-10"
								step="0.01"
							/>
							<DollarSign class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						</div>
					</div>

					{#if formMessage}
						<div class="rounded-md p-3 text-sm {formMessage.includes('success') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}">
							{formMessage}
						</div>
					{/if}
				</div>

				<Sheet.Footer class="mt-6">
					<Button type="button" variant="outline" onclick={() => open = false}>
						Cancel
					</Button>
					<Button type="submit" disabled={isSubmitting}>
						{#if isSubmitting}
							Creating...
						{:else}
							Create Wedding Profile
						{/if}
					</Button>
				</Sheet.Footer>
			</form>
		</div>
	</Sheet.Content>
</Sheet.Root>