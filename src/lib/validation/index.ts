import { z } from 'zod/v4';

// Category
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

export const taskStatusSchema = {
	pending: 'Pending',
	'on-progress': 'On Progress',
	completed: 'Completed',
} as const;

export const taskPrioritySchema = { low: 'Low', medium: 'Medium', high: 'High' } as const;

export const paymentStatusSchema = {
	pending: 'Pending',
	paid: 'Paid',
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
type Priority = keyof typeof taskPrioritySchema;
type VendorStatus = keyof typeof vendorStatusSchema;
type PaymentStatus = keyof typeof paymentStatusSchema;
type TaskStatus = keyof typeof taskStatusSchema;

// Document
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

// Expense
export const expenseFormSchema = z.object({
	description: z.string().min(5, { message: 'Description must be more than 5 characters long' }),
	amount: z.number().min(1, { message: 'Amount must be more than 0' }),
	category: z.enum(Object.keys(categorySchema) as [Category, ...Category[]]),
	status: z
		.enum(Object.keys(paymentStatusSchema) as [PaymentStatus, ...PaymentStatus[]])
		.default('pending'),
	date: z.iso.date({ message: 'Please select date' }),
});

export const expenseSchema = z.discriminatedUnion('action', [
	expenseFormSchema.extend({ action: z.literal('default') }),
]);

export type ExpenseSchema = typeof expenseSchema;

// Task
export const taskFormSchema = z.object({
	description: z.string().min(5, { message: 'Description must be more than 5 characters long' }),
	category: z.enum(Object.keys(categorySchema) as [Category, ...Category[]]),
	priority: z.enum(Object.keys(taskPrioritySchema) as [Priority, ...Priority[]]),
	status: z.enum(Object.keys(taskStatusSchema) as [TaskStatus, ...TaskStatus[]]).default('pending'),
	date: z.iso.date({ message: 'Please select date' }),
});

export const taskSchema = z.discriminatedUnion('action', [
	taskFormSchema.extend({ action: z.literal('default') }),
]);

export type TaskSchema = typeof taskSchema;

// Vendor
export const vendorFormSchema = z.object({
	name: z.string().min(1, { message: 'Please insert vendor name' }),
	category: z.enum(Object.keys(categorySchema) as [Category, ...Category[]]),
	instagram: z.string().min(1, { message: 'Please insert instagram handle' }),
	price: z.coerce.number().min(1, { message: 'Price must be more than 0' }),
	rating: z.enum(Object.keys(vendorRatingSchema)),
	status: z
		.enum(Object.keys(vendorStatusSchema) as [VendorStatus, ...VendorStatus[]])
		.default('researching'),
});

export const vendorSchema = z.discriminatedUnion('action', [
	vendorFormSchema.extend({ action: z.literal('default') }),
]);

export type VendorSchema = typeof vendorSchema;