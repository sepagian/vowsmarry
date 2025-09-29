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

export const paymentStatusSchema = {
	pending: 'Pending',
	paid: 'Paid',
} as const;

type Category = keyof typeof categorySchema;
type Status = keyof typeof paymentStatusSchema;

export const expenseFormSchema = z.object({
	description: z.string().min(5, { message: 'Description must be more than 5 characters long' }),
	amount: z.number().min(1, { message: 'Amount must be more than 0' }),
	category: z.enum(Object.keys(categorySchema) as [Category, ...Category[]]),
	status: z.enum(Object.keys(paymentStatusSchema) as [Status, ...Status[]]).default('pending'),
	date: z.iso.date({ message: 'Please select date' }),
});

export const expenseSchema = z.discriminatedUnion('action', [
	expenseFormSchema.extend({ action: z.literal('default') }),
]);

export type ExpenseSchema = typeof expenseSchema;
