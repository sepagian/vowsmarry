import { sqliteTable, text, integer, real, index } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import { weddings } from './planner';
import {
	invitationStatusValues,
	guestCategoryValues,
	rsvpStatusValues,
	giftTypeValues,
	galleryTypeValues,
} from './enums';
import { users } from './planner';

// INVITATIONS MODULE

export const invitations = sqliteTable(
	'invitations',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		weddingId: text('wedding_id')
			.notNull()
			.references(() => weddings.id, { onDelete: 'cascade' }),
		slug: text('slug').notNull().unique(),
		template: text('template').notNull(),
		status: text('status', { enum: invitationStatusValues }).default('draft'),
		coupleDetails: text('couple_details', { mode: 'json' }).notNull(),
		eventDetails: text('event_details', { mode: 'json' }).notNull(),
		customizations: text('customizations', { mode: 'json' }).notNull(),
		maxGuestCount: integer('max_guest_count').notNull(),
		isPublic: integer('is_public', { mode: 'boolean' }).default(false).notNull(),
		viewCount: integer('view_count').default(0).notNull(),
		publishedAt: integer('published_at', { mode: 'timestamp' }),
		expiredAt: integer('expired_at', { mode: 'timestamp' }),
		createdAt: integer('created_at', { mode: 'timestamp' })
			.$defaultFn(() => new Date())
			.notNull(),
		updatedAt: integer('updated_at', { mode: 'timestamp' })
			.$defaultFn(() => new Date())
			.notNull(),
	},
	(table) => ({
		slugIdx: index('invitations_slug_idx').on(table.slug),
		weddingIdIdx: index('invitations_wedding_id_idx').on(table.weddingId),
		statusIdx: index('invitations_status_idx').on(table.status),
	}),
);

// GUESTS MODULE

export const guests = sqliteTable(
	'guests',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		invitationId: text('invitation_id')
			.notNull()
			.references(() => invitations.id, { onDelete: 'cascade' }),
		name: text('name').notNull(),
		phone: text('phone'),
		email: text('email'),
		invitationToken: text('invitation_token').unique(),
		category: text('category', { enum: guestCategoryValues }),
		createdAt: integer('created_at', { mode: 'timestamp' })
			.$defaultFn(() => new Date())
			.notNull(),
		updatedAt: integer('updated_at', { mode: 'timestamp' })
			.$defaultFn(() => new Date())
			.notNull(),
	},
	(table) => ({
		invitationIdIdx: index('guests_invitation_id_idx').on(table.invitationId),
		tokenIdx: index('guests_invitation_token_idx').on(table.invitationToken),
		phoneIdx: index('guests_phone_idx').on(table.phone),
		emailIdx: index('guests_email_idx').on(table.email),
	}),
);

// RSVPS MODULE

export const rsvps = sqliteTable(
	'rsvps',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		guestId: text('guest_id')
			.notNull()
			.references(() => guests.id, { onDelete: 'cascade' }),
		status: text('status', { enum: rsvpStatusValues }).notNull(), // attending, declined
		plusOneCount: integer('plus_one_count').default(0).notNull(),
		plusOneNames: text('plus_one_names', { mode: 'json' }), // array of names
		guestMessage: text('guest_message'),
		submittedAt: integer('submitted_at', { mode: 'timestamp' })
			.$defaultFn(() => new Date())
			.notNull(),
		isPublic: integer('is_public', { mode: 'boolean' }).default(false).notNull(),
		createdAt: integer('created_at', { mode: 'timestamp' })
			.$defaultFn(() => new Date())
			.notNull(),
		updatedAt: integer('updated_at', { mode: 'timestamp' })
			.$defaultFn(() => new Date())
			.notNull(),
	},
	(table) => ({
		guestIdIdx: index('rsvps_guest_id_idx').on(table.guestId),
		statusIdx: index('rsvps_status_idx').on(table.status),
	}),
);

// GALLERY MODULE

export const gallery = sqliteTable(
	'gallery',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		invitationId: text('invitation_id')
			.notNull()
			.references(() => invitations.id, { onDelete: 'cascade' }),
		type: text('type', { enum: galleryTypeValues }).notNull(),
		url: text('url').notNull(),
		description: text('description'),
		fileName: text('file_name').notNull(),
		fileSize: integer('filesize').notNull(),
		mimeType: text('mime_type').notNull(),
		caption: text('caption'),
		sortOrder: integer('sort_order').notNull(),
		isPublic: integer('is_public', { mode: 'boolean' }).default(false).notNull(),
		uploadedBy: text('uploaded_by').notNull(),
		createdAt: integer('created_at', { mode: 'timestamp' })
			.$defaultFn(() => new Date())
			.notNull(),
		updatedAt: integer('updated_at', { mode: 'timestamp' })
			.$defaultFn(() => new Date())
			.notNull(),
	},
	(table) => ({
		invitationIdIdx: index('gallery_invitation_id_idx').on(table.invitationId),
		typeIdx: index('gallery_type_idx').on(table.type),
		sortOrderIdx: index('gallery_sort_order_idx').on(table.sortOrder),
	}),
);

// LOVE STORY MODULE

export const love_story = sqliteTable(
	'love_story',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		invitationId: text('invitation_id')
			.notNull()
			.references(() => invitations.id, { onDelete: 'cascade' }),
		title: text('title').notNull(),
		content: text('content').notNull(),
		date: text('date'), // ISO date string (YYYY-MM-DD)
		mediaUrl: text('media_url'),
		mediaType: text('media_type'), // photo, video
		sortOrder: integer('sort_order').notNull(),
		isPublic: integer('is_public', { mode: 'boolean' }).default(false).notNull(),
		createdAt: integer('created_at', { mode: 'timestamp' })
			.$defaultFn(() => new Date())
			.notNull(),
		updatedAt: integer('updated_at', { mode: 'timestamp' })
			.$defaultFn(() => new Date())
			.notNull(),
	},
	(table) => ({
		invitationIdIdx: index('love_story_invitation_id_idx').on(table.invitationId),
		sortOrderIdx: index('love_story_sort_order_idx').on(table.sortOrder),
		dateIdx: index('love_story_date_idx').on(table.date),
	}),
);

// GIFTS MODULE

export const gifts = sqliteTable(
	'gifts',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		invitationId: text('invitation_id')
			.notNull()
			.references(() => invitations.id, { onDelete: 'cascade' }),
		type: text('type', { enum: giftTypeValues }).notNull(),
		title: text('title').notNull(),
		description: text('description'),
		bankAccount: text('bank_account'),
		bankNumber: real('bank_number'),
		registryURL: text('registry_url'),
		isActive: integer('is_active', { mode: 'boolean' }).default(true).notNull(),
		isPublic: integer('is_public', { mode: 'boolean' }).default(false).notNull(),
		sortOrder: integer('sort_order').notNull(),
		createdAt: integer('created_at', { mode: 'timestamp' })
			.$defaultFn(() => new Date())
			.notNull(),
		updatedAt: integer('updated_at', { mode: 'timestamp' })
			.$defaultFn(() => new Date())
			.notNull(),
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
}));

export const rsvpsRelations = relations(rsvps, ({ one }) => ({
	guest: one(guests, {
		fields: [rsvps.guestId],
		references: [guests.id],
	}),
}));

export const giftsRelations = relations(gifts, ({ one }) => ({
	invitation: one(invitations, {
		fields: [gifts.invitationId],
		references: [invitations.id],
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
