<script lang="ts">
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { AlertTriangle } from 'lucide-svelte';
</script>

<div class="flex items-center justify-center">
	<Card class="w-full max-w-md bg-base-200">
		<CardHeader class="text-center">
			<div class="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
				<AlertTriangle class="w-6 h-6 text-red-600" />
			</div>
			<CardTitle class="text-red-900">Authentication Error</CardTitle>
			<CardDescription>
				Sorry, we encountered an error during authentication. This could be due to an expired or
				invalid link.
			</CardDescription>
		</CardHeader>
		<CardContent class="space-y-4">
			<div class="text-center space-y-2">
				<Button href="/login" class="w-full">Back to Login</Button>
				<Button href="/register" variant="outline" class="w-full">Create New Account</Button>
			</div>
		</CardContent>
	</Card>
</div>
