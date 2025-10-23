import {
	pgTable,
	jsonb,
	uuid,
	timestamp,
	varchar,
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

export const invitationStatusEnum = pgEnum('invitation_status', ['draft', 'published', 'expired']);

export const rsvpStatusEnum = pgEnum('rsvp_status', ['pending', 'attending', 'declined']);

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
	'expense_categories',
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

export const savingsEntries = pgTable(
	'savings_entry',
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
		weddingIdIdx: index('savings_entries_wedding_id_idx').on(table.weddingId),
		savingTargetIdIdx: index('savings_entries_goal_id_idx').on(table.savingTargetId),
		savingsIdIdx: index('savings_entries_savings_id_idx').on(table.savingsId),
		dateIdx: index('savings_entries_date_idx').on(table.date),
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

export const dowryItems = pgTable('dowry_items', {
	id: uuid('id').primaryKey().defaultRandom(),
	weddingId: uuid('wedding_id')
		.notNull()
		.references(() => weddings.id, { onDelete: 'cascade' }),
	description: varchar('description', { length: 255 }),
});

// RELATIONS

export const weddingsRelations = relations(weddings, ({ many }) => ({
	tasks: many(tasks),
	documents: many(documents),
	expenseCategories: many(expenseCategories),
	expenseItems: many(expenseItems),
	savingsSummaries: many(savingsSummaries),
	savingsEntries: many(savingsEntries),
	vendors: many(vendors),
	rundowns: many(rundowns),
	dowryItems: many(dowryItems),
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
		fields: [expenseItems.weddingId],
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
	entries: many(savingsEntries),
}));

export const savingsEntriesRelations = relations(savingsEntries, ({ one }) => ({
	wedding: one(weddings, {
		fields: [savingsEntries.weddingId],
		references: [weddings.id],
	}),
	goal: one(savingsSummaries, {
		fields: [savingsEntries.savingTargetId],
		references: [savingsSummaries.id],
	}),
	summary: one(savingsSummaries, {
		fields: [savingsEntries.savingsId],
		references: [savingsSummaries.id],
	}),
}));
