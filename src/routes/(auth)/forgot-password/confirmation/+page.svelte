<script lang="ts">
	import { Button } from '$lib/components/ui/button/index';
</script>

<div class="flex flex-col gap-8">
	<div class="flex flex-col items-center gap-4 text-center">
		<div class="rounded-full bg-green-100 p-3">
			<svg
				class="h-6 w-6 text-green-600"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M5 13l4 4L19 7"
				></path>
			</svg>
		</div>
		<h1 class="text-2xl font-bold">Check your email</h1>
		<p class="text-muted-foreground text-balance text-sm max-w-md">
			We've sent a password reset link to your email address. Please check your inbox and click
			the link to reset your password.
		</p>
	</div>

	<div class="flex flex-col gap-4">
		<div class="rounded-lg border bg-muted/50 p-4">
			<h3 class="font-medium text-sm mb-2">What to do next:</h3>
			<ol class="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
				<li>Check your email inbox (and spam folder)</li>
				<li>Click the "Reset Password" link in the email</li>
				<li>Follow the instructions to set a new password</li>
			</ol>
		</div>

		<div class="flex flex-col gap-2">
			<a href="/login" class="w-full">
				<Button variant="outline" class="w-full">
					Back to Login
				</Button>
			</a>
			
			<a href="/forgot-password" class="w-full">
				<Button variant="ghost" class="w-full text-sm">
					Didn't receive an email? Try again
				</Button>
			</a>
		</div>
	</div>
</div>