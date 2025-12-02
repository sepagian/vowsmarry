<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as FieldSet from '$lib/components/ui/field-set';
	import OnboardingIllustration from './onboarding-illustration.svelte';

	let { handleNext } = $props();
</script>

<div class="w-full h-xl pt-4">
	<FieldSet.Root class="h-full justify-between rounded-xl overflow-hidden">
		<FieldSet.Title class="p-6 font-bold flex flex-col gap-1">
			<h1 class="font-semibold text-lg">Welcome to Vowsmarry</h1>
			<span class="text-sm text-balance text-muted-foreground">
				All your plans, notes, and wedding details live here in one calm space. Start gently, so the
				journey feels lighter.
			</span>
		</FieldSet.Title>
		<FieldSet.Content class="p-6 text-balance text-center text-foreground">
			<OnboardingIllustration />
		</FieldSet.Content>
		<FieldSet.Footer class="flex px-4 py-6 justify-end">
			<Button
				onclick={handleNext}
				size="sm"
				class="bg-orange-200 text-orange-800 hover:bg-orange-300">Start Setup</Button
			>
		</FieldSet.Footer>
	</FieldSet.Root>
</div>
