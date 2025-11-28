import type { Document, DocumentCategory, DocumentStatus } from '$lib/types';
import { SvelteMap } from 'svelte/reactivity';
import { BaseStore } from './base-store.svelte';

/**
 * Svelte 5 runes-based document state management
 */
class DocumentsState extends BaseStore<Document> {
	/**
	 * Alias for items to maintain backward compatibility
	 */
	get documents(): Document[] {
		return this.items;
	}

	/**
	 * Get documents by status
	 */
	get pending(): Document[] {
		return this.documents.filter((d) => d.documentStatus === 'pending');
	}

	get approved(): Document[] {
		return this.documents.filter((d) => d.documentStatus === 'approved');
	}

	get rejected(): Document[] {
		return this.documents.filter((d) => d.documentStatus === 'rejected');
	}

	/**
	 * Get documents with due dates
	 */
	get withDueDate(): Document[] {
		return this.documents.filter((d) => d.documentDueDate);
	}

	/**
	 * Get overdue documents
	 */
	get overdue(): Document[] {
		const now = new Date();
		return this.documents.filter((d) => {
			if (!d.documentDueDate) return false;
			return new Date(d.documentDueDate) < now && d.documentStatus === 'pending';
		});
	}

	/**
	 * Get statistics
	 */
	override get stats() {
		return {
			...super.stats,
			pending: this.pending.length,
			approved: this.approved.length,
			rejected: this.rejected.length,
			overdue: this.overdue.length,
			withDueDate: this.withDueDate.length,
		};
	}

	/**
	 * Group documents by category
	 */
	get byCategory() {
		const grouped = new SvelteMap<DocumentCategory, Document[]>();
		for (const doc of this.documents) {
			const category = doc.documentCategory;
			if (!grouped.has(category)) {
				grouped.set(category, []);
			}
			grouped.get(category)!.push(doc);
		}
		return grouped;
	}

	/**
	 * Get total file size
	 */
	get totalFileSize(): number {
		return this.documents.reduce((sum, doc) => sum + doc.fileSize, 0);
	}

	/**
	 * Filter by status
	 */
	filterByStatus(status: DocumentStatus): Document[] {
		return this.documents.filter((d) => d.documentStatus === status);
	}

	/**
	 * Filter by category
	 */
	filterByCategory(category: DocumentCategory): Document[] {
		return this.documents.filter((d) => d.documentCategory === category);
	}

	/**
	 * Sort by date
	 */
	sortByDate(): Document[] {
		return [...this.documents].sort(
			(a, b) => new Date(b.documentDate).getTime() - new Date(a.documentDate).getTime(),
		);
	}
}

/**
 * Global documents state instance
 */
export const documentsState = new DocumentsState();
