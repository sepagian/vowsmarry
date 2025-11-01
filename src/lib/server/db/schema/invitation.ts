import {
	pgTable,
	jsonb,
	uuid,
	date,
	timestamp,
	varchar,
	text,
	numeric,
	boolean,
	integer,
	index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { weddings } from './planner';
import {
	invitationStatusEnum,
	guestCategoryEnum,
	rsvpStatusEnum,
	giftTypeEnum,
	galleryTypeEnum,
} from './enums';
import { users } from './planner';

// INVITATIONS MODULE

export const invitations = pgTable(
	'invitations',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		weddingId: uuid('wedding_id')
			.notNull()
			.references(() => weddings.id, { onDelete: 'cascade' }),
		slug: varchar('slug', { length: 255 }).notNull().unique(),
		template: varchar('template', { length: 255 }).notNull(),
		status: invitationStatusEnum('status').default('draft'),
		coupleDetails: jsonb('couple_details').notNull(),
		eventDetails: jsonb('event_details').notNull(),
		customizations: jsonb('customizations').notNull(),
		maxGuestCount: integer('max_guest_count').notNull(),
		isPublic: boolean('is_public').default(false).notNull(),
		viewCount: integer('view_count').default(0).notNull(),
		publishedAt: timestamp('published_at'),
		expiredAt: timestamp('expired_at'),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull(),
	},
	(table) => ({
		slugIdx: index('invitations_slug_idx').on(table.slug),
		weddingIdIdx: index('invitations_wedding_id_idx').on(table.weddingId),
		statusIdx: index('invitations_status_idx').on(table.status),
	}),
);

// GUESTS MODULE

export const guests = pgTable(
	'guests',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		invitationId: uuid('invitation_id')
			.notNull()
			.references(() => invitations.id, { onDelete: 'cascade' }),
		name: varchar('name', { length: 255 }).notNull(),
		phone: varchar('phone', { length: 50 }),
		email: varchar('email', { length: 255 }),
		invitationToken: varchar('invitation_token', { length: 255 }).unique(),
		category: guestCategoryEnum('category'),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull(),
	},
	(table) => ({
		invitationIdIdx: index('guests_invitation_id_idx').on(table.invitationId),
		tokenIdx: index('guests_invitation_token_idx').on(table.invitationToken),
		phoneIdx: index('guests_phone_idx').on(table.phone),
		emailIdx: index('guests_email_idx').on(table.email),
	}),
);

// RSVPS MODULE

export const rsvps = pgTable(
	'rsvps',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		guestId: uuid('guest_id')
			.notNull()
			.references(() => guests.id, { onDelete: 'cascade' }),
		status: rsvpStatusEnum('status').notNull(), // attending, declined
		plusOneCount: integer('plus_one_count').default(0).notNull(),
		plusOneNames: jsonb('plus_one_names'), // array of names
		guestMessage: text('guest_message'),
		submittedAt: timestamp('submitted_at').defaultNow().notNull(),
		isPublic: boolean('is_public').default(false).notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull(),
	},
	(table) => ({
		guestIdIdx: index('rsvps_guest_id_idx').on(table.guestId),
		statusIdx: index('rsvps_status_idx').on(table.status),
	}),
);

// GALLERY MODULE

export const gallery = pgTable(
	'gallery',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		invitationId: uuid('invitation_id')
			.notNull()
			.references(() => invitations.id, { onDelete: 'cascade' }),
		type: galleryTypeEnum('type').notNull(),
		url: varchar('url', { length: 255 }).notNull(),
		description: text('description'),
		fileName: varchar('file_name', { length: 255 }).notNull(),
		fileSize: integer('filesize').notNull(),
		mimeType: varchar('mime_type', { length: 255 }).notNull(),
		caption: varchar('caption', { length: 255 }),
		sortOrder: integer('sort_order').notNull(),
		isPublic: boolean('is_public').default(false).notNull(),
		uploadedBy: uuid('uploaded_by').notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull(),
	},
	(table) => ({
		invitationIdIdx: index('gallery_invitation_id_idx').on(table.invitationId),
		typeIdx: index('gallery_type_idx').on(table.type),
		sortOrderIdx: index('gallery_sort_order_idx').on(table.sortOrder),
	}),
);

// LOVE STORY MODULE

export const love_story = pgTable(
	'love_story',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		invitationId: uuid('invitation_id')
			.notNull()
			.references(() => invitations.id, { onDelete: 'cascade' }),
		title: varchar('title', { length: 200 }).notNull(),
		content: text('content').notNull(),
		date: date('date'),
		mediaUrl: text('media_url'),
		mediaType: varchar('media_type', { length: 20 }), // photo, video
		sortOrder: integer('sort_order').notNull(),
		isPublic: boolean('is_public').default(false).notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull(),
	},
	(table) => ({
		invitationIdIdx: index('love_story_invitation_id_idx').on(table.invitationId),
		sortOrderIdx: index('love_story_sort_order_idx').on(table.sortOrder),
		dateIdx: index('love_story_date_idx').on(table.date),
	}),
);

// GIFTS MODULE

export const gifts = pgTable(
	'gifts',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		invitationId: uuid('invitation_id')
			.notNull()
			.references(() => invitations.id, { onDelete: 'set null' }),
		type: giftTypeEnum('type').notNull(),
		title: varchar('title', { length: 200 }).notNull(),
		description: text('description'),
		bankAccount: varchar('bank_account', { length: 30 }),
		bankNumber: numeric('bank_number'),
		registryURL: varchar('registry_url', { length: 255 }),
		isActive: boolean('is_active').default(true).notNull(),
		isPublic: boolean('is_public').default(false).notNull(),
		sortOrder: integer('sort_order').notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull(),
	},
	(table) => ({
		invitationIdIdx: index('gifts_invitation_id_idx').on(table.invitationId),
		typeIdx: index('gifts_type_idx').on(table.type),
		isActiveIdx: index('gifts_is_active_idx').on(table.isActive),
	}),
);

// RELATIONS
//
export const invitationsRelations = relations(invitations, ({ one, many }) => ({
	wedding: one(weddings, {
		fields: [invitations.weddingId],
		references: [weddings.id],
	}),
	guests: many(guests),
	gallery: many(gallery),
	love_story: many(love_story),
	gifts: many(gifts),
}));

export const guestsRelations = relations(guests, ({ one, many }) => ({
	invitation: one(invitations, {
		fields: [guests.invitationId],
		references: [invitations.id],
	}),
	rsvps: many(rsvps),
	galleryUploads: many(gallery),
}));

export const rsvpsRelations = relations(rsvps, ({ one }) => ({
	guest: one(guests, {
		fields: [rsvps.guestId],
		references: [guests.id],
	}),
}));

export const galleryRelations = relations(gallery, ({ one }) => ({
	invitation: one(invitations, {
		fields: [gallery.invitationId],
		references: [invitations.id],
	}),
	uploadedBy: one(users, {
		fields: [gallery.uploadedBy],
		references: [users.id],
	}),
}));

export const love_storyRelations = relations(love_story, ({ one }) => ({
	invitation: one(invitations, {
		fields: [love_story.invitationId],
		references: [invitations.id],
	}),
}));
