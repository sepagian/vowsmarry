<script lang="ts">
  import { toast } from "svelte-sonner";

  import WorkspaceForm from "$lib/components/form/workspace-form.svelte";
  import { Button } from "$lib/components/ui/button";
  import {
    Content as FieldSetContent,
    Footer as FieldSetFooter,
    Root as FieldSetRoot,
    Title as FieldSetTitle,
  } from "$lib/components/ui/field-set";

  let { handleBack, handleNext, wizardFormState } = $props();

  function handleSubmit() {
    // Trigger form validation by submitting the form
    const form = document.getElementById("workspace-form") as HTMLFormElement;
    if (form) {
      form.requestSubmit();
    }
  }

  function handleSuccess() {
    toast.success("Workspace details saved successfully");
    handleNext();
  }
</script>

<div class="w-full h-xl pt-4">
  <FieldSetRoot class=" justify-between rounded-xl overflow-hidden">
    <div class="flex flex-col">
      <FieldSetTitle class="p-6 font-bold flex flex-col gap-1">
        <h1 class="font-semibold text-lg">Name your wedding space</h1>
        <span class="text-sm text-balance text-muted-foreground">
          This is the home for every plan, task, and memory you'll build
          together. A name makes it feel real, a little moment to smile at.
        </span>
      </FieldSetTitle>
      <FieldSetContent class="p-6 text-balance text-center text-foreground">
        <WorkspaceForm data={wizardFormState} onSuccess={handleSuccess} />
      </FieldSetContent>
    </div>
    <FieldSetFooter class="flex px-4 py-6 justify-between">
      <Button
        onclick={handleBack}
        size="sm"
        class="bg-gray-200 text-gray-800 hover:bg-gray-300">Back</Button
      >

      <Button
        type="button"
        onclick={handleSubmit}
        size="sm"
        class="bg-orange-200 text-orange-800 hover:bg-orange-300">Next</Button
      >
    </FieldSetFooter>
  </FieldSetRoot>
</div>
