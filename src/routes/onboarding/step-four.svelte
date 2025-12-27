<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { superForm } from 'sveltekit-superforms';
	import { valibot } from 'sveltekit-superforms/adapters';

	import { Button } from '$lib/components/ui/button';
	import { Content as FieldSetContent, Footer as FieldSetFooter, Root as FieldSetRoot, Title as FieldSetTitle } from '$lib/components/ui/field-set';
	import { Control as FormControl, Field as FormField, FieldErrors as FormFieldErrors, Label as FormLabel } from '$lib/components/ui/form/index';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';

	import { FormToasts } from '$lib/utils/toasts';
	import { inviteSchema } from '$lib/validation/workspace';

	let { handleBack, handleNext, handleSkipToEnd, wizardFormState, data } = $props();

	const form = superForm(data?.inviteForm || wizardFormState.inviteForm, {
		validators: valibot(inviteSchema),
		dataType: 'json',
		onUpdate: async ({ form: f }) => {
			if (f.valid) {
				toast.success('Invitation sent successfully');
				handleNext();
			} else {
				FormToasts.emptyFormError();
			}
		},
	});
	const { form: formData, enhance } = form;

	function handleSubmit() {
		// Trigger form validation by submitting the form
		const formElement = document.getElementById('invite-form') as HTMLFormElement;
		if (formElement) {
			formElement.requestSubmit();
		}
	}
</script>

<div class="w-full h-xl pt-4">
	<FieldSetRoot class=" justify-between rounded-xl overflow-hidden">
		<FieldSetTitle class="p-6 font-bold flex flex-col gap-1">
			<h1 class="font-semibold text-lg">Plan together with your partner</h1>
			<span class="text-sm text-balance text-muted-foreground">
				Send an invitation so your partner can join, decide, and prepare everything with you.
			</span>
		</FieldSetTitle>
		<FieldSetContent class="p-6 text-balance text-center text-foreground">
			<form
				id="invite-form"
				use:enhance
				method="POST"
				action="?/invitePartner"
				class="flex flex-col gap-2"
			>
				<FormField
					{form}
					name="partnerEmail"
					class="w-full"
				>
					<FormControl>
						{#snippet children({ props })}
							<FormLabel>Email</FormLabel>
							<Input
								{...props}
								type="email"
								placeholder="yourpartner@mail.com"
								bind:value={$formData.partnerEmail}
							/>
						{/snippet}
					</FormControl>
					<FormFieldErrors class="text-xs text-red-500 text-left" />
				</FormField>
			</form>
		</FieldSetContent>
		<FieldSetFooter class="flex px-4 py-6 justify-between">
			<Button
				onclick={handleBack}
				size="sm"
				class="bg-gray-200 text-gray-800 hover:bg-gray-300">Back</Button
			>
			<div class="flex gap-2">
				<Button
					onclick={handleSkipToEnd}
					size="sm"
					class="bg-gray-200 text-gray-800 hover:bg-gray-300">I'll do it later</Button
				>
				<Button
					type="button"
					onclick={handleSubmit}
					size="sm"
					class="bg-orange-200 text-orange-800 hover:bg-orange-300">Send Invite</Button
				>
			</div>
		</FieldSetFooter>
	</FieldSetRoot>
</div>
