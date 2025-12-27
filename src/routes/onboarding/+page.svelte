<script lang="ts">
	import { WizardComponent } from "svelte-wizard";

	import StepFive from "./step-five.svelte";
	import StepFour from "./step-four.svelte";
	import StepOne from "./step-one.svelte";
	import StepThree from "./step-three.svelte";
	import StepTwo from "./step-two.svelte";

	let { data } = $props();

	// Initialize wizard state with form data from server
	let wizardFormState = $state({
		weddingForm: data.weddingForm,
		workspaceForm: data.workspaceForm,
		inviteForm: data.inviteForm,
		user: data.user,
		organizationId: null,
	});

	let stepsList = [
		{ step: StepOne, title: "Welcome" },
		{ step: StepTwo, title: "Wedding Details" },
		{ step: StepThree, title: "Workspace Setup" },
		{ step: StepFour, title: "Invite Partner" },
		{ step: StepFive, title: "Complete" },
	];
	let options = $state({
		showTitle: true,
		showOneTitle: true,
		showProgressBar: false,
		showCheckIcon: true,
	});
</script>

<div class="max-w-2xl mx-auto">
	<WizardComponent {stepsList} {options} bind:wizardFormState/>
</div>
