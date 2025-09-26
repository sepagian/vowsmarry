import { writable } from 'svelte/store';
import type { Category, VendorStatus, Item, ColumnType } from '$lib/types';

export type { Item, ColumnType };

export interface Vendor {
	vendorName: string;
	vendorCategory: Category;
	vendorEmail?: string;
	vendorPhone?: string;
	vendorWebsite?: string;
	vendorPrice?: string;
	vendorAddress?: string;
	vendorDesc?: string;
	vendorRating?: 1 | 2 | 3 | 4 | 5;
	vendorStatus: VendorStatus;
}

const initialVendors: Vendor[] = [
	{
		vendorName: 'The Wedding Venue',
		vendorCategory: 'venue',
		vendorEmail: 'venue@email.com',
		vendorPhone: '(512) 555-5555',
		vendorWebsite: 'https://www.weddingvenue.com',
		vendorPrice: '$10,000',
		vendorAddress: '123 Main St, Anytown, USA',
		vendorDesc: 'Ranch style venue',
		vendorRating: 4,
		vendorStatus: 'researching',
	},
	{
		vendorName: 'The Catering Company',
		vendorCategory: 'catering',
		vendorEmail: 'catering@email.com',
		vendorPhone: '(512) 555-5555',
		vendorWebsite: 'https://www.cateringcompany.com',
		vendorPrice: '$10,000',
		vendorAddress: '123 Main St, Anytown, USA',
		vendorDesc: 'Ranch style food',
		vendorRating: 4,
		vendorStatus: 'researching',
	},
	{
		vendorName: 'The Decor Company',
		vendorCategory: 'decoration',
		vendorEmail: 'decoration@email.com',
		vendorPhone: '(512) 555-5555',
		vendorWebsite: 'https://www.decorationcompany.com',
		vendorPrice: '$10,000',
		vendorAddress: '123 Main St, Anytown, USA',
		vendorDesc: 'Ranch style decorations',
		vendorRating: 4,
		vendorStatus: 'researching',
	},
	{
		vendorName: 'The Entertainment Company',
		vendorCategory: 'entertainment',
		vendorEmail: 'entertainment@email.com',
		vendorPhone: '(512) 555-5555',
		vendorWebsite: 'https://www.entertainmentcompany.com',
		vendorPrice: '$10,000',
		vendorAddress: '123 Main St, Anytown, USA',
		vendorDesc: 'Ranch style entertainment',
		vendorRating: 4,
		vendorStatus: 'researching',
	},
];

export const vendorsStore = writable<Vendor[]>(initialVendors);
