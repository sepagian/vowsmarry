
<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const { invitation, organization, isAuthenticated, userEmail } = data;

	// Check if the logged-in user's email matches the invitation
	const emailMatches = userEmail === invitation.email;

</script>

<div class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-pink-50">
	<Card class="w-full max-w-2xl">
		<CardHeader class="text-center space-y-4">
			<div class="flex justify-center">
				<div class="h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
					<div class="i-lucide:mail h-8 w-8 text-white"></div>
				</div>
			</div>
			<CardTitle class="text-3xl">Wedding Workspace Invitation</CardTitle>
			<CardDescription class="text-base">
				You've been invited to collaborate on a wedding planning workspace
			</CardDescription>
		</CardHeader>

		<CardContent class="space-y-6">
			<!-- Organization Details -->
			<div class="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-6 space-y-3">
				<div class="flex items-center gap-2 text-sm text-muted-foreground">
					<div class="i-lucide:heart h-4 w-4"></div>
					<span>Wedding Workspace</span>
				</div>
				<h3 class="text-2xl font-bold text-purple-900">
					{organization?.name || 'Wedding Planning'}
				</h3>
				{#if organization?.metadata}
					<div class="flex flex-wrap gap-2 text-sm text-muted-foreground">
						{#if organization.metadata.weddingDate}
							<div class="flex items-center gap-1">
								<div class="i-lucide:calendar h-4 w-4"></div>
								<span>{new Date(organization.metadata.weddingDate).toLocaleDateString()}</span>
							</div>
						{/if}
						{#if organization.metadata.weddingVenue}
							<div class="flex items-center gap-1">
								<div class="i-lucide:map-pin h-4 w-4"></div>
								<span>{organization.metadata.weddingVenue}</span>
							</div>
						{/if}
					</div>
				{/if}
			</div>

			<!-- Invitation Details -->
			<div class="space-y-3">
				<div class="flex items-center justify-between">
					<span class="text-sm text-muted-foreground">Invited Email:</span>
					<span class="font-medium">{invitation.email}</span>
				</div>
				<div class="flex items-center justify-between">
					<span class="text-sm text-muted-foreground">Role:</span>
					<Badge variant="secondary">{invitation.role}</Badge>
				</div>
			</div>

			<!-- Authentication Status -->
			{#if !isAuthenticated}
				<div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 space-y-3">
					<div class="flex items-start gap-3">
						<div class="i-lucide:alert-circle h-5 w-5 text-yellow-600 mt-0.5"></div>
						<div class="flex-1">
							<p class="font-medium text-yellow-900">Sign in required</p>
							<p class="text-sm text-yellow-700 mt-1">
								You need to sign in or create an account to accept this invitation.
							</p>
						</div>
					</div>
					<div class="flex gap-2">
						<Button href="/login?redirect=/accept-invitation/{invitation.id}" class="flex-1">
							Sign In
						</Button>
						<Button href="/register?redirect=/accept-invitation/{invitation.id}" variant="outline" class="flex-1">
							Create Account
						</Button>
					</div>
				</div>
			{:else if !emailMatches}
				<div class="bg-red-50 border border-red-200 rounded-lg p-4">
					<div class="flex items-start gap-3">
						<div class="i-lucide:alert-triangle h-5 w-5 text-red-600 mt-0.5"></div>
						<div class="flex-1">
							<p class="font-medium text-red-900">Email mismatch</p>
							<p class="text-sm text-red-700 mt-1">
								This invitation was sent to <strong>{invitation.email}</strong>, but you're signed in as <strong>{userEmail}</strong>.
								Please sign in with the correct account or contact the workspace owner.
							</p>
						</div>
					</div>
				</div>
			{:else}
				<!-- Accept/Reject Actions -->
				<div class="flex gap-3 pt-4">
					<form method="POST" action="?/accept" use:enhance class="flex-1">
						<Button type="submit" class="w-full" size="lg">
							<div class="i-lucide:check h-5 w-5 mr-2"></div>
							Accept Invitation
						</Button>
					</form>
					<form method="POST" action="?/reject" use:enhance>
						<Button type="submit" variant="outline" size="lg">
							<div class="i-lucide:x h-5 w-5 mr-2"></div>
							Decline
						</Button>
					</form>
				</div>
			{/if}

			<!-- Features Preview -->
			<div class="border-t pt-6 mt-6">
				<p class="text-sm font-medium mb-4">What you'll be able to do:</p>
				<div class="grid grid-cols-2 gap-3">
					<div class="flex items-start gap-2 text-sm">
						<div class="i-lucide:check-circle h-4 w-4 text-green-600 mt-0.5"></div>
						<span>Manage tasks together</span>
					</div>
					<div class="flex items-start gap-2 text-sm">
						<div class="i-lucide:check-circle h-4 w-4 text-green-600 mt-0.5"></div>
						<span>Track budget & expenses</span>
					</div>
					<div class="flex items-start gap-2 text-sm">
						<div class="i-lucide:check-circle h-4 w-4 text-green-600 mt-0.5"></div>
						<span>Coordinate vendors</span>
					</div>
					<div class="flex items-start gap-2 text-sm">
						<div class="i-lucide:check-circle h-4 w-4 text-green-600 mt-0.5"></div>
						<span>Share documents</span>
					</div>
					<div class="flex items-start gap-2 text-sm">
						<div class="i-lucide:check-circle h-4 w-4 text-green-600 mt-0.5"></div>
						<span>Plan schedules</span>
					</div>
					<div class="flex items-start gap-2 text-sm">
						<div class="i-lucide:check-circle h-4 w-4 text-green-600 mt-0.5"></div>
						<span>View unified calendar</span>
					</div>
				</div>
			</div>
		</CardContent>
	</Card>
</div>