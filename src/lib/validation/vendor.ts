import { z } from 'zod/v4';

export const categorySchema = {
	accommodation: 'Accommodation',
	catering: 'Catering',
	decoration: 'Decoration',
	entertainment: 'Entertainment',
	'makeup-attire': 'Makeup & Attire',
	paperwork: 'Paperwork',
	'photo-video': 'Photo & Video',
	venue: 'Venue',
	miscellaneous: 'Miscellaneous',
} as const;

export const vendorRatingSchema = {
	1: '1',
	2: '2',
	3: '3',
	4: '4',
	5: '5',
} as const;

export const vendorStatusSchema = {
	researching: 'Researching',
	contacted: 'Contacted',
	quoted: 'Quoted',
	booked: 'Booked',
} as const;

type Category = keyof typeof categorySchema;
type Status = keyof typeof vendorStatusSchema;

export const vendorFormSchema = z.object({
	name: z.string({ message: 'Please insert vendor name' }),
	category: z.enum(Object.keys(categorySchema) as [Category, ...Category[]]),
	instagram: z.string(),
	price: z.number().min(1, { message: 'Price must be more than 0' }),
	rating: z.enum(Object.keys(vendorRatingSchema)),
	status: z.enum(Object.keys(vendorStatusSchema) as [Status, ...Status[]]).default('researching'),
	date: z.iso.date({ message: 'Please select date' }),
});

export const vendorSchema = z.discriminatedUnion('action', [
	vendorFormSchema.extend({ action: z.literal('default') }),
]);

export type VendorSchema = typeof vendorSchema;
