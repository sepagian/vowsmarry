import { createMutation, useQueryClient } from "@tanstack/svelte-query";

import { broadcastInvalidate } from "$lib/utils/broadcast";
import type { Document } from "$lib/types";

export function useCreateDocument() {
  const queryClient = useQueryClient();

  return createMutation(() => ({
    mutationFn: async (documentData: {
      documentName: string;
      documentCategory: Document["documentCategory"];
      documentDate: string;
      file: File;
    }) => {
      const formData = new FormData();
      formData.append("documentName", documentData.documentName);
      formData.append("documentCategory", documentData.documentCategory);
      formData.append("documentDate", documentData.documentDate);
      formData.append("file", documentData.file);

      const response = await fetch("/api/documents", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create document");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      broadcastInvalidate(["documents", "dashboard"]);
    },
  }));
}

export function useUpdateDocument() {
  const queryClient = useQueryClient();

  return createMutation(() => ({
    mutationFn: async ({
      id,
      ...updates
    }: { id: string } & Partial<Document> & { file?: File }) => {
      const formData = new FormData();
      formData.append("id", id);

      if (updates.documentName) {
        formData.append("documentName", updates.documentName);
      }
      if (updates.documentCategory) {
        formData.append("documentCategory", updates.documentCategory);
      }
      if (updates.documentDate) {
        formData.append("documentDate", updates.documentDate);
      }
      if (updates.file) {
        formData.append("file", updates.file);
      }

      const response = await fetch(`/api/documents/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update document");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      broadcastInvalidate(["documents", "dashboard"]);
    },
  }));
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return createMutation(() => ({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/documents/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete document");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      broadcastInvalidate(["documents", "dashboard"]);
    },
  }));
}
