<script lang="ts">
	import { Separator } from '$lib/components/ui/separator/index';
	import { Button } from '$lib/components/ui/button/index';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Card from '$lib/components/ui/card';
	import { formatDistanceToNow } from 'date-fns';

	interface Props {
		activeSessions: Array<{
			id: string;
			createdAt: Date;
			ipAddress: string | null;
			userAgent: string | null;
			expiresAt: Date;
		}>;
	}

	let { activeSessions }: Props = $props();

	let dialogOpen = $state(false);
	let deletingSessionId = $state<string | null>(null);

	function parseUserAgent(ua: string | null) {
		if (!ua) return { browser: 'Unknown', os: 'Unknown' };

		// Simple user agent parsing
		let browser = 'Unknown';
		let os = 'Unknown';

		if (ua.includes('Chrome')) browser = 'Chrome';
		else if (ua.includes('Firefox')) browser = 'Firefox';
		else if (ua.includes('Safari')) browser = 'Safari';
		else if (ua.includes('Edge')) browser = 'Edge';

		if (ua.includes('Windows')) os = 'Windows';
		else if (ua.includes('Mac')) os = 'macOS';
		else if (ua.includes('Linux')) os = 'Linux';
		else if (ua.includes('Android')) os = 'Android';
		else if (ua.includes('iOS')) os = 'iOS';

		return { browser, os };
	}

	async function deleteSession(sessionId: string) {
		deletingSessionId = sessionId;
		try {
			const formData = new FormData();
			formData.append('sessionId', sessionId);

			const response = await fetch('?/deleteSession', {
				method: 'POST',
				body: formData,
			});

			if (response.ok) {
				window.location.reload();
			}
		} finally {
			deletingSessionId = null;
		}
	}
</script>

<div class="flex flex-row items-center justify-between">
	<div class="flex flex-col">
		<h1 class="font-extrabold text-xl">Active Sessions</h1>
		<span class="text-muted-foreground text-sm text-balance"
			>Review recent devices and sign out of anything you don't recognize.</span
		>
	</div>
	<Dialog.Root bind:open={dialogOpen}>
		<Dialog.Trigger>
			<Button>View Sessions ({activeSessions.length})</Button>
		</Dialog.Trigger>
		<Dialog.Content class="max-w-2xl max-h-[80vh] overflow-y-auto">
			<Dialog.Header>
				<Dialog.Title>Active Sessions</Dialog.Title>
				<Dialog.Description>
					These are the devices currently signed in to your account.
				</Dialog.Description>
			</Dialog.Header>

			<div class="space-y-4">
				{#each activeSessions as session (session.id)}
					{@const { browser, os } = parseUserAgent(session.userAgent)}
					<Card.Root>
						<Card.Content class="pt-6">
							<div class="flex items-start justify-between">
								<div class="flex-1 space-y-1">
									<div class="flex items-center gap-2">
										<span class="i-lucide:monitor text-lg"></span>
										<h3 class="font-semibold">{browser} on {os}</h3>
									</div>
									<div class="text-sm text-muted-foreground space-y-1">
										{#if session.ipAddress}
											<div class="flex items-center gap-2">
												<span class="i-lucide:map-pin text-xs"></span>
												<span>{session.ipAddress}</span>
											</div>
										{/if}
										<div class="flex items-center gap-2">
											<span class="i-lucide:clock text-xs"></span>
											<span>Last active {formatDistanceToNow(session.createdAt, { addSuffix: true })}</span>
										</div>
										<div class="flex items-center gap-2">
											<span class="i-lucide:calendar text-xs"></span>
											<span>Expires {formatDistanceToNow(session.expiresAt, { addSuffix: true })}</span>
										</div>
									</div>
								</div>
								<form method="POST" action="?/deleteSession">
									<input type="hidden" name="sessionId" value={session.id} />
									<Button
										type="submit"
										variant="ghost"
										size="sm"
										disabled={deletingSessionId === session.id}
									>
										{deletingSessionId === session.id ? 'Signing out...' : 'Sign out'}
									</Button>
								</form>
							</div>
						</Card.Content>
					</Card.Root>
				{/each}
			</div>

			{#if activeSessions.length > 1}
				<form method="POST" action="?/deleteAllSessions" class="mt-4">
					<input type="hidden" name="currentSessionId" value={activeSessions[0]?.id} />
					<Button type="submit" variant="destructive" class="w-full">
						Sign out from all other devices
					</Button>
				</form>
			{/if}
		</Dialog.Content>
	</Dialog.Root>
</div>
<Separator />
