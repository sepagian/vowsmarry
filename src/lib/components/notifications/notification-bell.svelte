<script lang="ts">
	import { notifications, unreadCount, notificationStore } from '$lib/stores/notifications';
	import { Button } from '$lib/components/ui/button/index';
	import { onMount } from 'svelte';
	import { Bell } from 'lucide-svelte';

	let showDropdown = $state(false);
	let dropdownElement: HTMLDivElement;

	// Close dropdown when clicking outside
	function handleClickOutside(event: MouseEvent) {
		if (dropdownElement && !dropdownElement.contains(event.target as Node)) {
			showDropdown = false;
		}
	}

	onMount(() => {
		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});

	function formatTimeAgo(date: Date) {
		const now = new Date();
		const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

		if (diffInSeconds < 60) return 'Just now';
		if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
		if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
		return `${Math.floor(diffInSeconds / 86400)}d ago`;
	}

	function getPriorityColor(priority: string) {
		switch (priority) {
			case 'high':
				return 'text-red-600';
			case 'medium':
				return 'text-yellow-600';
			default:
				return 'text-blue-600';
		}
	}

	function getPriorityIcon(priority: string) {
		switch (priority) {
			case 'high':
				return '🔴';
			case 'medium':
				return '🟡';
			default:
				return '🔵';
		}
	}

	function handleNotificationClick(notification: any) {
		if (!notification.isRead) {
			notificationStore.markAsRead(notification.id);
		}

		if (notification.actionUrl) {
			window.location.href = notification.actionUrl;
		}

		showDropdown = false;
	}
</script>

<div class="relative" bind:this={dropdownElement}>
	<Button
		variant="outline"
		size="icon"
		onclick={() => (showDropdown = !showDropdown)}
		class="relative"
	>
		<Bell class="h-[1.2rem] w-[1.2rem]" />
		{#if $unreadCount > 0}
			<span
				class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
			>
				{$unreadCount > 9 ? '9+' : $unreadCount}
			</span>
		{/if}
	</Button>

	{#if showDropdown}
		<div
			class="absolute right-0 mt-2 w-80 bg-base-100 border rounded-lg shadow-lg z-50 max-h-96 overflow-hidden"
		>
			<div class="p-3 border-b bg-base-100">
				<div class="flex items-center justify-between">
					<h3 class="font-semibold">Notifications</h3>
					{#if $unreadCount > 0}
						<Button
							variant="ghost"
							size="sm"
							onclick={() => notificationStore.markAllAsRead()}
							class="text-xs"
						>
							Mark all read
						</Button>
					{/if}
				</div>
			</div>

			<div class="max-h-80 overflow-y-auto">
				{#if $notifications.length > 0}
					{#each $notifications as notification, i (i)}
						<button
							type="button"
							class="w-full p-3 border-b hover:bg-gray-50 cursor-pointer transition-colors {!notification.isRead
								? 'bg-blue-50'
								: ''} text-left"
							onclick={() => handleNotificationClick(notification)}
							aria-label="Mark notification as read: {notification.title}"
						>
							<div class="flex items-start gap-3">
								<span class="text-sm">{getPriorityIcon(notification.priority)}</span>
								<div class="flex-1 min-w-0">
									<div class="flex items-center gap-2 mb-1">
										<h4 class="font-medium text-sm truncate">{notification.title}</h4>
										{#if !notification.isRead}
											<div class="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
										{/if}
									</div>
									<p class="text-sm text-gray-600 line-clamp-2">{notification.message}</p>
									<p class="text-xs text-gray-400 mt-1">{formatTimeAgo(notification.createdAt)}</p>
								</div>
							</div>
						</button>
					{/each}
				{:else}
					<div class="p-6 text-center font-base-500">
						<Bell class="h-12 w-12 mx-auto text-gray-400 p-2 rounded-full mb-4" />
						<p class="text-sm">No notifications yet</p>
					</div>
				{/if}
			</div>

			{#if $notifications.length > 0}
				<div class="p-2 border-t bg-gray-50">
					<Button
						variant="ghost"
						size="sm"
						onclick={() => notificationStore.clear()}
						class="w-full text-xs"
					>
						Clear all notifications
					</Button>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
