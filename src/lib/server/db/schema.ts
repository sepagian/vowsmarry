import {
	pgTable,
	jsonb,
	uuid,
	timestamp,
	varchar,
	text,
	decimal,
	boolean,
	integer,
	pgEnum,
	index,
	uniqueIndex,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

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

export const taskStatusEnum = pgEnum('task_status', ['pending', 'on_progress', 'completed']);
export const taskPriorityEnum = pgEnum('task_priority', ['low', 'medium', 'high']);

export const documentCategoryEnum = pgEnum('document_category', [
	'legal_formal',
	'vendor_finance',
	'guest-ceremony',
	'personal-keepsake',
]);

export const expensePaymentStatusEnum = pgEnum('expense_payment_status', ['paid', 'unpaid']);

export const vendorStatusEnum = pgEnum('vendor_status', [
	'researching',
	'contacted',
	'quoted',
	'booked',
]);

export const dowryTypeEnum = pgEnum('dowry_type', ['cash', 'gold', 'jewelry', 'property']);

export const dowryStatusEnum = pgEnum('dowry_status', ['pending', 'delivered', 'received']);

export const dowryRecipientEnum = pgEnum('dowry_recipient', ['groom', 'bride']);

export const dresscodeRoleEnum = pgEnum('dresscode_role', [
	'groom',
	'bride',
	'groom_family',
	'bride_family',
	'groomsmen',
	'bridesmaids',
	'other',
]);

export const souvenirStatusEnum = pgEnum('souvenir_status', [
	'planned',
	'ordered',
	'delivered',
	'received',
]);

export const invitationStatusEnum = pgEnum('invitation_status', ['draft', 'published']);

export const guestCategoryEnum = pgEnum('guest_category', ['family', 'friend', 'colleague']);

export const rsvpStatusEnum = pgEnum('rsvp_status', ['attending', 'declined']);

export const galleryTypeEnum = pgEnum('gallery_type', ['photo', 'video']);

export const moderationStatusEnum = pgEnum('moderation_status', ['pending', 'approved']);

export const giftTypeEnum = pgEnum('gift_type', ['digital wallet', 'registry']);

// CORE TABLES

export const weddings = pgTable(
	'weddings',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		userId: uuid('user_id').notNull(),
		partnerName: varchar('partner_name', { length: 200 }),
		weddingDate: timestamp('wedding_date'),
		venue: varchar('venue'),
		budget: decimal('budget', { precision: 12, scale: 2 }),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull(),
	},
	(table) => ({
		userIdIdx: index('weddings_user_id_idx').on(table.userId),
	}),
);

// TASK MODULE

export const tasks = pgTable(
	'tasks',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		weddingId: uuid('wedding_id')
			.notNull()
			.references(() => weddings.id, { onDelete: 'cascade' }),
		description: varchar('description', { length: 255 }).notNull(),
		status: taskStatusEnum('status').default('pending').notNull(),
		priority: taskPriorityEnum('priority').default('low').notNull(),
		dueDate: timestamp('due_date').notNull(),
		completedAt: timestamp('completed_at'),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull(),
	},
	(table) => ({
		weddingIdIdx: index('tasks_wedding_id_idx').on(table.weddingId),
		statusIdx: index('tasks_status_idx').on(table.status),
		priorityIdx: index('tasks_priority_idx').on(table.priority),
		dueDateIdx: index('tasks_due_date_idx').on(table.dueDate),
	}),
);

// PAPERWORK MODULE

export const documents = pgTable(
	'documents',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		weddingId: uuid('wedding_id')
			.notNull()
			.references(() => weddings.id, { onDelete: 'cascade' }),
		name: varchar('name', { length: 255 }).notNull(),
		documentCategory: documentCategoryEnum('document_category').notNull(),
		documentDate: timestamp('document_date'),
		fileUrl: varchar('file_url'),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull(),
	},
	(table) => ({
		weddingIdIdx: index('documents_wedding_id_idx').on(table.weddingId),
		documentCategoryIdx: index('documents_type_idx').on(table.documentCategory),
	}),
);

// FINANCE MODULE

export const expenseCategories = pgTable(
	'expense_categories',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		weddingId: uuid('wedding_id')
			.notNull()
			.references(() => weddings.id, { onDelete: 'cascade' }),
		name: categoryEnum('name'),
		allocatedAmount: decimal('allocated_amount', { precision: 12, scale: 2 })
			.default('0')
			.notNull(),
		spentAmount: decimal('spent_amount', { precision: 12, scale: 2 }).default('0').notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull(),
	},
	(table) => ({
		weddingIdIdx: index('expense_categories_wedding_id_idx').on(table.weddingId),
	}),
);

export const expenseItems = pgTable(
	'expense_items',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		weddingId: uuid('wedding_id')
			.notNull()
			.references(() => weddings.id, { onDelete: 'cascade' }),
		description: varchar('description', { length: 255 }).notNull(),
		categoryId: uuid('category_id').references(() => expenseCategories.id, {
			onDelete: 'set null',
		}),
		category: categoryEnum('expense_category'),
		vendorId: uuid('vendor_id').references(() => vendors.id, { onDelete: 'set null' }),
		paymentStatus: expensePaymentStatusEnum('payment_status').default('unpaid'),
		dueDate: timestamp('due_date'),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull(),
	},
	(table) => ({
		weddingIdIdx: index('expense_items_wedding_id_idx').on(table.weddingId),
		categoryIdIdx: index('expense_items_category_id_idx').on(table.categoryId),
		categoryIdx: index('expense_items_category_idx').on(table.category),
		vendorIdIdx: index('expense_items_vendor_id_idx').on(table.vendorId),
		paymentStatusIdx: index('expense_items_payment_status_idx').on(table.paymentStatus),
		dueDateIdx: index('expense_items_due_date_idx').on(table.dueDate),
	}),
);

export const savingsSummaries = pgTable(
	'savings_summary',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		weddingId: uuid('wedding_id')
			.notNull()
			.references(() => weddings.id, { onDelete: 'cascade' }),
		totalSaved: decimal('total_saved', { precision: 12, scale: 2 }).default('0').notNull(),
		totalTarget: decimal('total_target', { precision: 12, scale: 2 }).default('0').notNull(),
		targetAmount: decimal('target_amount', { precision: 12, scale: 2 }).default('0').notNull(), // alias for totalTarget
		currentAmount: decimal('current_amount', { precision: 12, scale: 2 }).default('0').notNull(), // alias for totalSaved
		monthlyAverage: decimal('monthly_average', { precision: 12, scale: 2 }).default('0').notNull(),
		lastUpdated: timestamp('last_updated').defaultNow().notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull(),
	},
	(table) => ({
		weddingIdIdx: uniqueIndex('savings_summaries_wedding_id_idx').on(table.weddingId),
	}),
);

export const savingsItems = pgTable(
	'savings_items',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		weddingId: uuid('wedding_id')
			.notNull()
			.references(() => weddings.id, { onDelete: 'cascade' }),
		savingTargetId: uuid('saving_target_id').references(() => savingsSummaries.id, {
			onDelete: 'cascade',
		}),
		savingsId: uuid('savings_id').references(() => savingsSummaries.id, { onDelete: 'cascade' }), // for compatibility
		amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
		description: varchar('description', { length: 255 }),
		date: timestamp('date').defaultNow().notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
	},
	(table) => ({
		weddingIdIdx: index('savings_items_wedding_id_idx').on(table.weddingId),
		savingTargetIdIdx: index('savings_items_goal_id_idx').on(table.savingTargetId),
		savingsIdIdx: index('savings_items_savings_id_idx').on(table.savingsId),
		dateIdx: index('savings_items_date_idx').on(table.date),
	}),
);

// VENDOR MODULE

export const vendors = pgTable(
	'vendors',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		weddingId: uuid('wedding_id')
			.notNull()
			.references(() => weddings.id, { onDelete: 'cascade' }),
		name: varchar('name', { length: 200 }).notNull(),
		category: categoryEnum('category'),
		status: vendorStatusEnum('status').default('researching'),
		rating: integer('rating'), // 1-5 stars
		totalCost: decimal('total_cost', { precision: 12, scale: 2 }),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull(),
	},
	(table) => ({
		weddingIdIdx: index('vendors_wedding_id_idx').on(table.weddingId),
		categoryIdx: index('vendors_category_idx').on(table.category),
		statusIdx: index('vendors_status_idx').on(table.status),
		ratingIdx: index('vendors_rating_idx').on(table.rating),
	}),
);

// RUNDOWN / SCHEDULE MODULE

export const rundowns = pgTable(
	'rundowns',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		weddingId: uuid('wedding_id')
			.notNull()
			.references(() => weddings.id, { onDelete: 'cascade' }),
		eventName: varchar('event_name', { length: 200 }).notNull(),
		eventType: varchar('event_type', { length: 50 }), // ceremony, reception, party, etc.
		startTime: timestamp('start_time').notNull(),
		endTime: timestamp('end_time').notNull(),
		location: varchar('location', { length: 255 }),
		venue: varchar('venue', { length: 255 }),
		attendees: varchar('attendees', { length: 255 }),
		assignedTo: jsonb('assigned_to'), // array of person names/roles
		vendorIds: jsonb('vendor_ids'), // array of vendor UUIDs
		isPublic: boolean('is_public').default(false).notNull(), // visible to guests
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull(),
	},
	(table) => ({
		weddingIdIdx: index('rundown_events_wedding_id_idx').on(table.weddingId),
		startTimeIdx: index('rundown_events_start_time_idx').on(table.startTime),
	}),
);

// DOWRY MODULE

export const dowry = pgTable(
	'dowry',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		weddingId: uuid('wedding_id')
			.notNull()
			.references(() => weddings.id, { onDelete: 'cascade' }),
		description: varchar('description', { length: 255 }),
		type: dowryTypeEnum('type').notNull(),
		amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
		quantity: integer('quantity'),
		estimatedValue: decimal('estimated_value', { precision: 12, scale: 2 }),
		status: dowryStatusEnum('status').default('pending'),
		dateReceived: timestamp('date_received'),
		recipient: dowryRecipientEnum('recipient').notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull(),
	},
	(table) => ({
		weddingIdx: index('dowry_wedding_id_idx').on(table.weddingId),
		typeIdx: index('dowry_type_idx').on(table.type),
		statusIdx: index('dowry_status_idx').on(table.status),
	}),
);

// SOUVENIRS MODULE

export const souvenirs = pgTable(
	'souvenirs',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		weddingId: uuid('wedding_id')
			.notNull()
			.references(() => weddings.id, { onDelete: 'cascade' }),
		vendorId: uuid('vendor_id')
			.notNull()
			.references(() => vendors.id, { onDelete: 'set null' }),
		name: varchar('name', { length: 255 }).notNull(),
		quantity: integer('quantity').notNull(),
		unitPrice: decimal('unit_price', { precision: 12, scale: 2 }).notNull(),
		totalCost: decimal('total_cost', { precision: 12, scale: 2 }).notNull(),
		status: souvenirStatusEnum('status').default('planned'),
		orderDate: timestamp('order_date'),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull(),
	},
	(table) => ({
		weddingIdIdx: index('souvenirs_wedding_id_idx').on(table.weddingId),
		vendorIdIdx: index('souvenirs_vendor_id_idx').on(table.vendorId),
		statusIdx: index('souvenirs_status_idx').on(table.status),
	}),
);

// DRESSCODES MODULE

export const dresscodes = pgTable(
	'dresscodes',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		weddingId: uuid('wedding_id')
			.notNull()
			.references(() => weddings.id, { onDelete: 'cascade' }),
		rundownId: uuid('rundown_id')
			.notNull()
			.references(() => rundowns.id, { onDelete: 'set null' }),
		description: varchar('description', { length: 255 }).notNull(),
		dresscodeRole: dresscodeRoleEnum('dresscode_role').notNull(),
		imageUrl: varchar('image_url', { length: 255 }),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull(),
	},
	(table) => ({
		weddingIdIdx: index('dresscodes_wedding_id_idx').on(table.weddingId),
		dresscodeRoleIdx: index('dresscodes_dresscode_role_idx').on(table.dresscodeRole),
		rundownIdIdx: index('dresscodes_rundown_id_idx').on(table.rundownId),
	}),
);

// INVITATIONS MODULE

export const invitations = pgTable(
	'invitations',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		weddingId: uuid('wedding_id')
			.notNull()
			.references(() => weddings.id, { onDelete: 'cascade' }),
		slug: varchar('slug', { length: 255 }).notNull(),
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
		phone: varchar('phone', { length: 255 }),
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
		fileName: varchar('file_name', { length: 255 }).notNull(),
		fileSize: integer('filesize').notNull(),
		mimeType: varchar('mime_type', { length: 255 }).notNull(),
		caption: varchar('caption', { length: 255 }),
		sortOrder: integer('sort_order').notNull(),
		moderationStatus: moderationStatusEnum('moderation_status').default('pending'),
		isPublic: boolean('is_public').default(false).notNull(),
		uploadedBy: varchar('uploaded_by', { length: 255 }).notNull(),
		uploadedByGuestId: uuid('uploaded_by_guest_id').references(() => guests.id, {
			onDelete: 'set null',
		}),
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
		date: timestamp('date'),
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
		bankNumber: decimal('bank_number'),
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

export const gift_contributions = pgTable('gift_contributions', {
	id: uuid('id').primaryKey().defaultRandom(),
	giftId: uuid('gift_id').references(() => gifts.id, { onDelete: 'cascade' }),
	guestId: uuid('guest_id').references(() => guests.id, { onDelete: 'set null' }),
	contributorName: varchar('contributor_name', { length: 255 }),
	contributorPhone: varchar('contributor_phone', { length: 255 }),
	amount: decimal('amount'),
	message: text('message'),
});

// RELATIONS

export const weddingsRelations = relations(weddings, ({ many }) => ({
	tasks: many(tasks),
	documents: many(documents),
	expenseCategories: many(expenseCategories),
	expenseItems: many(expenseItems),
	savingsSummaries: many(savingsSummaries),
	savingsItems: many(savingsItems),
	vendors: many(vendors),
	rundowns: many(rundowns),
	dowryItems: many(dowry),
	souvenirs: many(souvenirs),
	dresscodes: many(dresscodes),
	invitations: many(invitations),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
	weddings: one(weddings, {
		fields: [tasks.weddingId],
		references: [weddings.id],
	}),
}));

export const documentsRelations = relations(documents, ({ one }) => ({
	weddings: one(weddings, {
		fields: [documents.weddingId],
		references: [weddings.id],
	}),
}));

export const expenseCategoriesRelations = relations(expenseCategories, ({ one, many }) => ({
	weddings: one(weddings, {
		fields: [expenseCategories.weddingId],
		references: [weddings.id],
	}),
	expenseItems: many(expenseItems),
}));

export const expenseItemsRelations = relations(expenseItems, ({ one }) => ({
	wedding: one(weddings, {
		fields: [expenseItems.weddingId],
		references: [weddings.id],
	}),
	category: one(expenseCategories, {
		fields: [expenseItems.categoryId],
		references: [expenseCategories.id],
	}),
	vendor: one(vendors, {
		fields: [expenseItems.vendorId],
		references: [vendors.id],
	}),
}));

export const savingsSummariesRelations = relations(savingsSummaries, ({ one, many }) => ({
	wedding: one(weddings, {
		fields: [savingsSummaries.weddingId],
		references: [weddings.id],
	}),
	entries: many(savingsItems),
}));

export const savingsItemsRelations = relations(savingsItems, ({ one }) => ({
	wedding: one(weddings, {
		fields: [savingsItems.weddingId],
		references: [weddings.id],
	}),
	goal: one(savingsSummaries, {
		fields: [savingsItems.savingTargetId],
		references: [savingsSummaries.id],
	}),
	summary: one(savingsSummaries, {
		fields: [savingsItems.savingsId],
		references: [savingsSummaries.id],
	}),
}));

export const vendorsRelations = relations(vendors, ({ one, many }) => ({
	wedding: one(weddings, {
		fields: [vendors.weddingId],
		references: [weddings.id],
	}),
	expenseItems: many(expenseItems),
	souvenirs: many(souvenirs),
}));

export const dowryRelations = relations(dowry, ({ one }) => ({
	wedding: one(weddings, {
		fields: [dowry.weddingId],
		references: [weddings.id],
	}),
}));

export const souvernirRelations = relations(souvenirs, ({ one }) => ({
	wedding: one(weddings, {
		fields: [souvenirs.weddingId],
		references: [weddings.id],
	}),
	vendor: one(vendors, {
		fields: [souvenirs.vendorId],
		references: [vendors.id],
	}),
}));

export const rundownsRelations = relations(rundowns, ({ one }) => ({
	wedding: one(weddings, {
		fields: [rundowns.weddingId],
		references: [weddings.id],
	}),
}));

export const invitationsRelations = relations(invitations, ({ one, many }) => ({
	wedding: one(weddings, {
		fields: [invitations.weddingId],
		references: [weddings.id],
	}),
	guests: many(guests),
	gallery: many(gallery),
	love_story: many(love_story),
	gifts: many(gifts),
	gift_contributions: many(gift_contributions),
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
	uploadedByGuest: one(guests, {
		fields: [gallery.uploadedByGuestId],
		references: [guests.id],
	}),
}));

export const love_storyRelations = relations(love_story, ({ one }) => ({
	invitation: one(invitations, {
		fields: [love_story.invitationId],
		references: [invitations.id],
	}),
}));
