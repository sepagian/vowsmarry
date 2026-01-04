import { createQuery } from "@tanstack/svelte-query";
import type { Document } from "$lib/types";

type DocumentsResponse = {
  documents: Document[];
};

async function fetchDocuments(): Promise<DocumentsResponse> {
  const response = await fetch("/api/documents");
  if (!response.ok) {
    throw new Error("Failed to fetch documents");
  }
  return response.json();
}

export function useDocuments() {
  return createQuery(() => ({
    queryKey: ["documents"],
    queryFn: fetchDocuments,
    staleTime: 1000 * 60 * 5,
  }));
}
