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

type Category = keyof typeof categorySchema;

export const documentFormSchema = z.object({
	name: z.string().min(1, { message: 'Please insert document name' }),
	category: z.enum(Object.keys(categorySchema) as [Category, ...Category[]]),
	file: z
		.instanceof(File, { message: 'Please upload a file.' })
		.refine((f) => f.size < 100_000, 'Max 100 kB upload size.'),
	date: z.iso.date({ message: 'Please select date' }),
});

export const documentSchema = z.discriminatedUnion('action', [
	documentFormSchema.extend({ action: z.literal('default') }),
]);

export type DocumentSchema = typeof documentSchema;
