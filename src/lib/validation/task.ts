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

export const taskStatusSchema = {
	pending: 'Pending',
	'on-progress': 'On Progress',
	completed: 'Completed',
} as const;

export const taskPrioritySchema = { low: 'Low', medium: 'Medium', high: 'High' } as const;

type Category = keyof typeof categorySchema;
type Status = keyof typeof taskStatusSchema;
type Priority = keyof typeof taskPrioritySchema;

export const taskFormSchema = z.object({
	description: z.string().min(5, { message: 'Description must be more than 5 characters long' }),
	category: z.enum(Object.keys(categorySchema) as [Category, ...Category[]]),
	priority: z.enum(Object.keys(taskPrioritySchema) as [Priority, ...Priority[]]),
	status: z.enum(Object.keys(taskStatusSchema) as [Status, ...Status[]]).default('pending'),
	date: z.iso.date({ message: 'Please select date' }),
});

export const taskSchema = z.discriminatedUnion('action', [
	taskFormSchema.extend({ action: z.literal('default') }),
]);

export type TaskSchema = typeof taskSchema;
