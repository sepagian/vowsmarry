<script lang="ts">
  import { filesProxy, superForm } from "sveltekit-superforms";
  import { valibot } from "sveltekit-superforms/adapters";
  import { useQueryClient } from "@tanstack/svelte-query";

  import { Button } from "$lib/components/ui/button/index";
  import {
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from "$lib/components/ui/dialog/index";
  import {
    displaySize,
    FileDropZone,
    type FileDropZoneProps,
    MEGABYTE,
  } from "$lib/components/ui/file-drop-zone";
  import {
    FormButton,
    FormControl,
    FormField,
    FormFieldErrors,
    FormLabel,
  } from "$lib/components/ui/form/index";
  import { Input } from "$lib/components/ui/input/index";
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
  } from "$lib/components/ui/select/index";

  import { broadcastInvalidate } from "$lib/utils/broadcast";
  import { CrudToasts, FormToasts } from "$lib/utils/toasts";
  import { TOAST_CONFIG } from "$lib/constants/config";
  import type { Document } from "$lib/types";
  import { useUpdateDocument } from "$lib/mutation/document";

  import {
    documentCategoryEnum,
    documentSchema,
  } from "$lib/validation/planner";

  let {
    data,
    document,
    open = $bindable(),
  }: {
    data: { documentForm: unknown };
    document: Document;
    open: boolean;
  } = $props();

  const updateDocumentMutation = useUpdateDocument();
  const queryClient = useQueryClient();

  const form = superForm(data.documentForm, {
    validators: valibot(documentSchema),
    dataType: "form",
    resetForm: false,
    onResult: ({ result }) => {
      if (result.type === "success") {
        const documentName = $formData.documentName || "Document";
        CrudToasts.success("update", "document", { itemName: documentName });
        queryClient.invalidateQueries({ queryKey: ["documents"] });
        queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        broadcastInvalidate(["documents", "dashboard"]);
        open = false;
      } else if (result.type === "failure") {
        FormToasts.emptyFormError();
      } else if (result.type === "error") {
        CrudToasts.error(
          "update",
          "An error occurred while updating the document",
          "document"
        );
      }
    },
  });
  const { form: formData, enhance } = form;

  const files = filesProxy(form, "file");

  const isLoading = $derived(updateDocumentMutation.isPending.value);

  $effect(() => {
    if (document && open) {
      $formData.documentName = document.documentName;
      $formData.documentCategory = document.documentCategory;
      $formData.documentDate = document.documentDate;
    }
  });

  const selectedCategory = $derived(
    $formData.documentCategory
      ? documentCategoryEnum.find((c) => c.value === $formData.documentCategory)
          ?.label
      : "Choose category"
  );

  const onUpload: FileDropZoneProps["onUpload"] = async (uploadedFiles) => {
    files.set([...Array.from($files), ...uploadedFiles]);
  };

  const onFileRejected: FileDropZoneProps["onFileRejected"] = async ({
    reason,
  }) => {
    FormToasts.submitError(reason, {
      formName: "document upload",
      duration: TOAST_CONFIG.ERROR_DURATION,
    });
  };
</script>

<DialogContent class="w-full sm:w-[120rem]">
  <DialogHeader>
    <DialogTitle>Edit Document</DialogTitle>
    <DialogDescription>
      <p>Update document information and optionally replace the file.</p>
    </DialogDescription>
  </DialogHeader>
  <form
    use:enhance
    method="POST"
    action="?/updateDocument"
    class="flex flex-col gap-2"
    enctype="multipart/form-data"
    onsubmit={(e) => {
      if (!$formData.valid) {
        e.preventDefault();
      }
    }}
  >
    <input type="hidden" name="id" value={document.id}>
    <FormField {form} name="documentName">
      <FormControl>
        {#snippet children({ props })}
          <FormLabel>Description</FormLabel>
          <Input {...props} type="text" bind:value={$formData.documentName} />
        {/snippet}
      </FormControl>
      <FormFieldErrors class="text-xs text-red-500"/>
    </FormField>
    <FormField {form} name="documentCategory">
      <FormControl>
        {#snippet children({ props })}
          <FormLabel>Category</FormLabel>
          <Select
            type="single"
            bind:value={$formData.documentCategory}
            name={props.name}
          >
            <SelectTrigger {...props} class="w-full">
              {selectedCategory}
            </SelectTrigger>
            <SelectContent>
              {#each documentCategoryEnum as option (option.value)}
                <SelectItem value={option.value}>
                  {option.label}
                </SelectItem>
              {/each}
            </SelectContent>
          </Select>
        {/snippet}
      </FormControl>
      <FormFieldErrors/>
    </FormField>
    <FormField {form} name="documentDate">
      <FormControl>
        {#snippet children({ props })}
          <FormLabel>Document Date</FormLabel>
          <Input {...props} type="date" bind:value={$formData.documentDate} />
        {/snippet}
      </FormControl>
      <FormFieldErrors class="text-xs text-red-500"/>
    </FormField>

    {#if document.fileName && $files.length === 0}
      <div class="flex flex-col gap-2 p-3 bg-gray-50 rounded-md border">
        <div class="text-sm font-medium text-gray-700">Current File</div>
        <div class="flex items-center justify-between gap-2">
          <div class="flex flex-col">
            <span class="text-sm">{document.fileName}</span>
            <span class="text-muted-foreground text-xs"
              >{document.fileSize
                ? displaySize(document.fileSize)
                : "Unknown size"}</span
            >
          </div>
        </div>
        <div class="text-xs text-gray-500">
          Upload a new file below to replace the current one
        </div>
      </div>
    {/if}

    <FormField {form} name="file">
      <FormControl>
        {#snippet children({ props })}
          <FileDropZone
            {...props}
            {onUpload}
            {onFileRejected}
            maxFileSize={10 * MEGABYTE}
            accept="image/*, application/pdf"
            maxFiles={1}
            fileCount={$files.length}
          >
            <div class="flex flex-col gap-2 w-full items-center justify-center">
              <div class="i-lucide:upload h-12 w-12 bg-neutral-500"></div>
              <div class="flex flex-col w-full gap-0 items-center justify-center">
                <h2 class="text-base font-bold text-neutral-500">
                  {$files.length > 0 ? "Replace file" : "Upload new file (optional)"}
                </h2>
                <span class="text-sm text-neutral-500"
                  >You can upload PDF, JPEG, or PNG files up to 10 MB</span
                >
              </div>
            </div>
          </FileDropZone>
          <input name="file" type="file" bind:files={$files} class="hidden" />
          <div class="flex flex-col gap-2">
            {#each Array.from($files) as file, i (file.name)}
              <div class="flex place-items-center justify-between gap-2">
                <div class="flex flex-col">
                  <span>{file.name}</span>
                  <span class="text-muted-foreground text-xs"
                    >{displaySize(file.size)}</span
                  >
                </div>
                <button
                  type="button"
                  class="i-lucide:x h-4 w-4 text-muted-foreground hover:text-foreground"
                  onclick={() => {
                    files.set([
                      ...Array.from($files).slice(0, i),
                      ...Array.from($files).slice(i + 1),
                    ]);
                  }}
                ></button>
              </div>
            {/each}
          </div>
        {/snippet}
      </FormControl>
      <FormFieldErrors class="text-xs text-red-500"/>
    </FormField>

    <DialogFooter>
      <FormButton disabled={isLoading}>
        {isLoading ? "Updating..." : "Update Document"}
      </FormButton>
    </DialogFooter>
  </form>
</DialogContent>
