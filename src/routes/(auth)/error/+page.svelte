<script lang="ts">
	import { Button } from '$lib/components/ui/button/index';
</script>

<div class="flex flex-col gap-8">
	<div class="flex flex-col items-center gap-2 text-center">
		<div class="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
			<div class="i-lucide:heart-crack w-6 h-6 text-red-600"></div>
		</div>
		<h1 class="text-2xl font-bold text-red-900">Oops... something went wrong</h1>
		<p class="text-muted-foreground text-balance text-sm">
			Don’t worry, our team is already looking into it. Try refreshing the page, or go back home.
		</p>
	</div>
	<div class="flex flex-col items-center gap-2 text-center">
		<Button
			href="/login"
			variant="outline"
			class="w-full">Back to Login</Button
		>
		<Button
			href="/register"
			variant="outline"
			class="w-full">Create New Account</Button
		>
	</div>
</div>
