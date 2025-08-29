<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-svelte';
	import type { Toast } from '$lib/stores/toast';
	import { toast } from '$lib/stores/toast';
	import { Button } from '$lib/components/ui/button';

	export let toastItem: Toast;

	// Icon mapping for different toast types
	const icons = {
		success: CheckCircle,
		error: AlertCircle,
		warning: AlertTriangle,
		info: Info
	};

	// Color classes for different toast types
	const colorClasses = {
		success: 'border-green-200 bg-green-50 text-green-800',
		error: 'border-red-200 bg-red-50 text-red-800',
		warning: 'border-yellow-200 bg-yellow-50 text-yellow-800',
		info: 'border-blue-200 bg-blue-50 text-blue-800'
	};

	// Icon color classes
	const iconColorClasses = {
		success: 'text-green-400',
		error: 'text-red-400',
		warning: 'text-yellow-400',
		info: 'text-blue-400'
	};

	function handleDismiss() {
		toast.removeToast(toastItem.id);
	}

	function handleAction() {
		if (toastItem.action) {
			toastItem.action.handler();
			handleDismiss();
		}
	}

	$: IconComponent = icons[toastItem.type];
</script>

<div
	class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg border shadow-lg {colorClasses[toastItem.type]}"
	in:fly={{ x: 300, duration: 300, easing: quintOut }}
	out:fade={{ duration: 200 }}
	role="alert"
	aria-live="polite"
>
	<div class="p-4">
		<div class="flex items-start">
			<!-- Icon -->
			<div class="flex-shrink-0">
				<IconComponent class="h-5 w-5 {iconColorClasses[toastItem.type]}" />
			</div>

			<!-- Content -->
			<div class="ml-3 w-0 flex-1">
				<p class="text-sm font-medium">
					{toastItem.title}
				</p>
				{#if toastItem.message}
					<p class="mt-1 text-sm opacity-90">
						{toastItem.message}
					</p>
				{/if}

				<!-- Action button -->
				{#if toastItem.action}
					<div class="mt-3">
						<Button
							variant="outline"
							size="sm"
							on:click={handleAction}
							class="text-xs"
						>
							{toastItem.action.label}
						</Button>
					</div>
				{/if}
			</div>

			<!-- Dismiss button -->
			{#if toastItem.dismissible}
				<div class="ml-4 flex flex-shrink-0">
					<button
						type="button"
						class="inline-flex rounded-md p-1.5 transition-colors hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-offset-2"
						on:click={handleDismiss}
						aria-label="Dismiss notification"
					>
						<X class="h-4 w-4" />
					</button>
				</div>
			{/if}
		</div>
	</div>

	<!-- Progress bar for timed toasts -->
	{#if toastItem.duration && toastItem.duration > 0}
		<div class="h-1 w-full bg-black/10">
			<div
				class="h-full bg-current opacity-50"
				style="animation: toast-progress {toastItem.duration}ms linear forwards;"
			></div>
		</div>
	{/if}
</div>

<style>
	@keyframes toast-progress {
		from {
			width: 100%;
		}
		to {
			width: 0%;
		}
	}
</style>