<script lang="ts">
	import { isAuthenticated, isAuthLoading, isAuthInitialized } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	interface Props {
		/**
		 * Whether authentication is required to view this content
		 */
		requireAuth?: boolean;
		/**
		 * Redirect URL when authentication is required but user is not authenticated
		 */
		redirectTo?: string;
		/**
		 * Content to show while authentication is loading
		 */
		loadingContent?: any;
		/**
		 * Content to show when user is not authenticated (if requireAuth is false)
		 */
		unauthenticatedContent?: any;
		/**
		 * The main content to render
		 */
		children: any;
	}

	let {
		requireAuth = false,
		redirectTo = '/login',
		loadingContent,
		unauthenticatedContent,
		children,
	}: Props = $props();

	// Handle redirect when auth is required but user is not authenticated
	onMount(() => {
		if (requireAuth && $isAuthInitialized && !$isAuthenticated) {
			goto(redirectTo);
		}
	});

	// Reactive redirect when auth state changes
	$effect(() => {
		if (requireAuth && $isAuthInitialized && !$isAuthenticated) {
			goto(redirectTo);
		}
	});
</script>

<!-- Show loading state while auth is initializing -->
{#if $isAuthLoading || !$isAuthInitialized}
	{#if loadingContent}
		{@render loadingContent()}
	{:else}
		<div class="flex items-center justify-center p-4">
			<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
		</div>
	{/if}
	<!-- Show content based on auth requirements -->
{:else if requireAuth}
	{#if $isAuthenticated}
		{@render children()}
	{/if}
{:else}
	<!-- No auth required, show appropriate content -->
	{#if $isAuthenticated}
		{@render children()}
	{:else if unauthenticatedContent}
		{@render unauthenticatedContent()}
	{:else}
		{@render children()}
	{/if}
{/if}
