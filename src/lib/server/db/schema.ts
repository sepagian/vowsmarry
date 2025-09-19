import {
	pgTable,
	serial,
	uuid,
	text,
	timestamp,
	varchar,
	decimal,
	boolean,
	integer,
	pgEnum,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Assuming Supabase Auth users table is referenced via uuid
// Define enums for statuses where applicable
export const documentStatusEnum = pgEnum('document_status', ['pending', 'approved']);
export const taskStatusEnum = pgEnum('task_status', ['pending', 'in_progress', 'completed']);
export const vendorStatusEnum = pgEnum('vendor_status', [
	'contacted',
	'negotiating',
	'booked',
	'completed',
]);
export const invitationStatusEnum = pgEnum('invitation_status', ['draft', 'published', 'expired']);
export const rsvpStatusEnum = pgEnum('rsvp_status', ['pending', 'attending', 'declined']);
export const categoryEnum = pgEnum('category', [
	'accommodation',
	'catering',
	'decoration',
	'entertainment',
	'makeup-attire',
	'paperwork',
	'photo-video',
	'venue',
	'miscellaneous',
]);

// Planner Modules Tables

export const documents = pgTable('documents', {
	id: serial('id').primaryKey(),
	userId: uuid('user_id').notNull(), // references auth.users(id)
	title: text('title').notNull(),
	type: text('type').notNull(),
	status: documentStatusEnum('status').default('pending').notNull(),
	dueDate: timestamp('due_date'),
	fileUrl: text('file_url'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const budgets = pgTable('budgets', {
	id: serial('id').primaryKey(),
	userId: uuid('user_id').notNull(),
	category: categoryEnum('category').notNull(),
	plannedAmount: decimal('planned_amount', { precision: 10, scale: 2 }).notNull(),
	actualAmount: decimal('actual_amount', { precision: 10, scale: 2 }).default('0.00'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const tasks = pgTable('tasks', {
	id: serial('id').primaryKey(),
	userId: uuid('user_id').notNull(),
	title: text('title').notNull(),
	description: text('description'),
	status: taskStatusEnum('status').default('pending').notNull(),
	dueDate: timestamp('due_date'),
	assignedTo: text('assigned_to'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const vendors = pgTable('vendors', {
	id: serial('id').primaryKey(),
	userId: uuid('user_id').notNull(),
	name: text('name').notNull(),
	category: categoryEnum('category').notNull(),
	contactInfo: text('contact_info'),
	status: vendorStatusEnum('status').default('contacted').notNull(),
	contractUrl: text('contract_url'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const schedules = pgTable('schedules', {
	id: serial('id').primaryKey(),
	userId: uuid('user_id').notNull(),
	eventName: text('event_name').notNull(),
	startTime: timestamp('start_time').notNull(),
	endTime: timestamp('end_time').notNull(),
	description: text('description'),
	assignedTo: text('assigned_to'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Invitations Modules Tables

export const invitations = pgTable('invitations', {
	id: serial('id').primaryKey(),
	userId: uuid('user_id').notNull(),
	slug: varchar('slug', { length: 255 }).unique().notNull(),
	template: text('template').notNull(),
	status: invitationStatusEnum('status').default('draft').notNull(),
	expiredAt: timestamp('expired_at'),
});

export const coupleDetails = pgTable('couple_details', {
	id: serial('id').primaryKey(),
	invitationId: integer('invitation_id')
		.references(() => invitations.id, { onDelete: 'cascade' })
		.notNull(),
	brideName: text('bride_name').notNull(),
	groomName: text('groom_name').notNull(),
	eventDate: timestamp('event_date').notNull(),
	location: text('location').notNull(),
	mapsUrl: text('maps_url'),
	greeting: text('greeting'),
});

export const parents = pgTable('parents', {
	id: serial('id').primaryKey(),
	invitationId: integer('invitation_id')
		.references(() => invitations.id, { onDelete: 'cascade' })
		.notNull(),
	side: text('side').notNull(), // e.g., 'bride', 'groom'
	role: text('role').notNull(), // e.g., 'father', 'mother'
	name: text('name').notNull(),
});

export const loveStories = pgTable('love_story', {
	id: serial('id').primaryKey(),
	invitationId: integer('invitation_id')
		.references(() => invitations.id, { onDelete: 'cascade' })
		.notNull(),
	title: text('title').notNull(),
	content: text('content').notNull(),
	mediaUrl: text('media_url'),
	sortOrder: integer('sort_order').default(0),
	createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const guests = pgTable('guests', {
	id: serial('id').primaryKey(),
	invitationId: integer('invitation_id')
		.references(() => invitations.id, { onDelete: 'cascade' })
		.notNull(),
	name: text('name').notNull(),
	phone: varchar('phone', { length: 20 }),
	token: uuid('token').defaultRandom(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const rsvps = pgTable('rsvp', {
	id: serial('id').primaryKey(),
	invitationId: integer('invitation_id')
		.references(() => invitations.id, { onDelete: 'cascade' })
		.notNull(),
	guestId: integer('guest_id')
		.references(() => guests.id, { onDelete: 'cascade' })
		.notNull(),
	status: rsvpStatusEnum('status').default('pending').notNull(),
	plusOne: boolean('plus_one').default(false),
	mealPref: text('meal_pref'),
	qrCode: text('qr_code'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const messages = pgTable('messages', {
	id: serial('id').primaryKey(),
	guestId: integer('guest_id')
		.references(() => guests.id, { onDelete: 'cascade' })
		.notNull(),
	invitationId: integer('invitation_id')
		.references(() => invitations.id, { onDelete: 'cascade' })
		.notNull(),
	name: text('name').notNull(),
	content: text('content').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const galleries = pgTable('gallery', {
	id: serial('id').primaryKey(),
	invitationId: integer('invitation_id')
		.references(() => invitations.id, { onDelete: 'cascade' })
		.notNull(),
	type: text('type').notNull(), // e.g., 'photo', 'video'
	key: text('key').notNull(),
	url: text('url').notNull(),
	sortOrder: integer('sort_order').default(0),
	createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const gifts = pgTable('gifts', {
	id: serial('id').primaryKey(),
	invitationId: integer('invitation_id')
		.references(() => invitations.id, { onDelete: 'cascade' })
		.notNull(),
	type: text('type').notNull(), // e.g., 'bank_transfer', 'qris'
	provider: text('provider'),
	accountInfo: text('account_info'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations (optional, for Drizzle queries)
export const invitationsRelations = relations(invitations, ({ many }) => ({
	coupleDetails: many(coupleDetails),
	parents: many(parents),
	loveStories: many(loveStories),
	guests: many(guests),
	galleries: many(galleries),
	gifts: many(gifts),
}));

export const coupleDetailsRelations = relations(coupleDetails, ({ one }) => ({
	invitation: one(invitations, {
		fields: [coupleDetails.invitationId],
		references: [invitations.id],
	}),
}));

// Add similar relations for other tables as needed
