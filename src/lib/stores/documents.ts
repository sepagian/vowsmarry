import { writable } from 'svelte/store';

export type DocType = 'legal-formal' | 'vendor-finance' | 'guest-ceremony' | 'personal-keepsake';

export interface Document {
	id: string;
	description: string;
	type: DocType;
	footer: string;
	action?: string;
}

const initialDocuments: Document[] = [
	{
		id: '1',
		description: 'Official paperwork required to legally tie the knot.',
		type: 'legal-formal',
		footer: 'Sep 1, 2025',
	},
	{
		id: '2',
		description: 'Agreement with Rosewood Hall including deposit details.',
		type: 'vendor-finance',
		footer: 'Aug 28, 2025',
	},
	{
		id: '3',
		description: 'Package details and payment terms for wedding photography.',
		type: 'vendor-finance',
		footer: 'Aug 25, 2025',
	},
	{
		id: '4',
		description: 'Running order of events including readings and vows.',
		type: 'guest-ceremony',
		footer: 'Sep 3, 2025',
	},
	{
		id: '5',
		description: 'Personal vow draft, marked as private.',
		type: 'personal-keepsake',
		footer: 'Sep 5, 2025',
	},
	{
		id: '6',
		description: 'Detailed expense tracking for all vendors and extra.',
		type: 'vendor-finance',
		footer: 'Sep 7, 2025',
	},
	{
		id: '7',
		description: 'Compliance letter',
		type: 'legal-formal',
		footer: 'Sep 7, 2025',
	},
];

export const documentsStore = writable<Document[]>(initialDocuments);
