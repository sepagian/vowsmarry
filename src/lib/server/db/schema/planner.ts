import {
	pgTable,
	jsonb,
	uuid,
	timestamp,
	time,
	date,
	varchar,
	numeric,
	boolean,
	integer,
	index,
	uniqueIndex,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { invitations } from './invitation';
import {
	categoryEnum,
	taskPriorityEnum,
	taskStatusEnum,
	documentCategoryEnum,
	expensePaymentStatusEnum,
	vendorStatusEnum,
	vendorRatingEnum,
	rundownTypeEnum,
	dowryRecipientEnum,
	dowryStatusEnum,
	dowryTypeEnum,
	souvenirStatusEnum,
	dresscodeRoleEnum,
	userRoleEnum,
} from './enums';

// CORE TABLES

export const weddings = pgTable(
	'weddings',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		userId: uuid('user_id').notNull(),
		partnerName: varchar('partner_name', { length: 200 }),
		weddingDate: date('wedding_date'),
		venue: varchar('venue'),
		budget: numeric('budget', { precision: 12, scale: 2 }),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull(),
	},
	(table) => ({
		userIdIdx: index('weddings_user_id_idx').on(table.userId),
	}),
);

export const users = pgTable(
	'users',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		weddingId: uuid('wedding_id')
			.notNull()
			.references(() => weddings.id, { onDelete: 'cascade' }),
		name: varchar('name', { length: 255 }),
		email: varchar('email', { length: 255 }),
		phone: varchar('phone', { length: 50 }),
		avatarUrl: varchar('avatar_url'),
		role: userRoleEnum('role').default('collaborator'),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull(),
	},
	(table) => ({
		weddingIdIdx: index('users_wedding_id_idx').on(table.weddingId),
		emailIdx: index('users_email_idx').on(table.email),
		roleIdx: index('users_role_idx').on(table.role),
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
		category: categoryEnum('category').notNull(),
		status: taskStatusEnum('status').default('pending').notNull(),
		priority: taskPriorityEnum('priority').default('low').notNull(),
		dueDate: date('due_date').notNull(),
		completedAt: timestamp('completed_at'),
		assignedTo: uuid('assigned_to'),
		createdBy: uuid('created_by').notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull(),
	},
	(table) => ({
		weddingIdIdx: index('tasks_wedding_id_idx').on(table.weddingId),
		statusIdx: index('tasks_status_idx').on(table.status),
		priorityIdx: index('tasks_priority_idx').on(table.priority),
		dueDateIdx: index('tasks_due_date_idx').on(table.dueDate),
		createdByIdx: index('tasks_created_by_idx').on(table.createdBy),
		assignedToIdx: index('tasks_assigned_to_idx').on(table.assignedTo),
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
		documentDate: date('document_date').notNull(),
		fileUrl: varchar('file_url').notNull(),
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
		category: categoryEnum('category'),
		allocatedAmount: numeric('allocated_amount', { precision: 12, scale: 2 })
			.default('0')
			.notNull(),
		spentAmount: numeric('spent_amount', { precision: 12, scale: 2 }).default('0').notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull(),
	},
	(table) => ({
		weddingIdIdx: index('expense_categories_wedding_id_idx').on(table.weddingId),
		weddingCategoryIdx: uniqueIndex('expense_categories_wedding_category_idx').on(
			table.weddingId,
			table.category,
		),
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
		expenseCategoryId: uuid('expense_category_id')
			.references(() => expenseCategories.id, {
				onDelete: 'cascade',
			})
			.notNull(),
		category: categoryEnum('category').notNull(),
		amount: numeric('amount', { precision: 12, scale: 2 }).default('0').notNull(),
		vendorId: uuid('vendor_id').references(() => vendors.id, { onDelete: 'set null' }),
		paymentStatus: expensePaymentStatusEnum('payment_status').default('unpaid').notNull(),
		dueDate: date('due_date').notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull(),
	},
	(table) => ({
		weddingIdIdx: index('expense_items_wedding_id_idx').on(table.weddingId),
		categoryIdIdx: index('expense_items_category_idx').on(table.category),
		amountIdx: index('expense_items_amount_idx').on(table.amount),
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
		totalSaved: numeric('total_saved', { precision: 12, scale: 2 }).default('0').notNull(),
		totalTarget: numeric('total_target', { precision: 12, scale: 2 }).default('0').notNull(),
		monthlyAverage: numeric('monthly_average', { precision: 12, scale: 2 }).default('0').notNull(),
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
		savingsId: uuid('savings_id').references(() => savingsSummaries.id, { onDelete: 'cascade' }),
		amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
		description: varchar('description', { length: 255 }),
		date: date('date').defaultNow().notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
	},
	(table) => ({
		weddingIdIdx: index('savings_items_wedding_id_idx').on(table.weddingId),
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
		category: categoryEnum('category').notNull(),
		instagram: varchar('instagram', { length: 50 }),
		email: varchar('email', { length: 255 }),
		phone: varchar('phone', { length: 50 }),
		website: varchar('website', { length: 50 }),
		status: vendorStatusEnum('status').default('researching').notNull(),
		rating: vendorRatingEnum('rating').notNull(), // 1-5 stars
		totalCost: numeric('total_cost', { precision: 12, scale: 2 }),
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
		rundownName: varchar('rundown_name', { length: 200 }).notNull(),
		rundownType: rundownTypeEnum('rundown_type'), // ceremony, reception, party, etc.
		startTime: time('start_time').notNull(),
		endTime: time('end_time').notNull(),
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
		price: numeric('price', { precision: 12, scale: 2 }).notNull(),
		quantity: integer('quantity'),
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
			.references(() => vendors.id, { onDelete: 'cascade' }),
		name: varchar('name', { length: 255 }).notNull(),
		quantity: integer('quantity').notNull(),
		unitPrice: numeric('unit_price', { precision: 12, scale: 2 }).notNull(),
		totalCost: numeric('total_cost', { precision: 12, scale: 2 }).notNull(),
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
			.references(() => rundowns.id, { onDelete: 'cascade' }),
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

// RELATIONS

export const weddingsRelations = relations(weddings, ({ many }) => ({
	tasks: many(tasks),
	users: many(users),
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

export const usersRelations = relations(users, ({ one }) => ({
	weddings: one(weddings, {
		fields: [users.weddingId],
		references: [weddings.id],
	}),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
	weddings: one(weddings, {
		fields: [tasks.weddingId],
		references: [weddings.id],
	}),
	assignedTo: one(users, {
		fields: [tasks.assignedTo],
		references: [users.id],
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
	weddings: one(weddings, {
		fields: [expenseItems.weddingId],
		references: [weddings.id],
	}),
	category: one(expenseCategories, {
		fields: [expenseItems.expenseCategoryId],
		references: [expenseCategories.id],
	}),
	vendor: one(vendors, {
		fields: [expenseItems.vendorId],
		references: [vendors.id],
	}),
}));

export const savingsSummariesRelations = relations(savingsSummaries, ({ one, many }) => ({
	weddings: one(weddings, {
		fields: [savingsSummaries.weddingId],
		references: [weddings.id],
	}),
	entries: many(savingsItems),
}));

export const savingsItemsRelations = relations(savingsItems, ({ one }) => ({
	weddings: one(weddings, {
		fields: [savingsItems.weddingId],
		references: [weddings.id],
	}),
	summary: one(savingsSummaries, {
		fields: [savingsItems.savingsId],
		references: [savingsSummaries.id],
	}),
}));

export const vendorsRelations = relations(vendors, ({ one, many }) => ({
	weddings: one(weddings, {
		fields: [vendors.weddingId],
		references: [weddings.id],
	}),
	expenseItems: many(expenseItems),
	souvenirs: many(souvenirs),
}));

export const rundownsRelations = relations(rundowns, ({ one, many }) => ({
	weddings: one(weddings, {
		fields: [rundowns.weddingId],
		references: [weddings.id],
	}),
	dresscodes: many(dresscodes),
}));

export const dowryRelations = relations(dowry, ({ one }) => ({
	weddings: one(weddings, {
		fields: [dowry.weddingId],
		references: [weddings.id],
	}),
}));

export const dresscodeRelations = relations(dresscodes, ({ one }) => ({
	weddings: one(weddings, {
		fields: [dresscodes.weddingId],
		references: [weddings.id],
	}),
	rundowns: one(rundowns, {
		fields: [dresscodes.rundownId],
		references: [rundowns.id],
	}),
}));

export const souvenirsRelations = relations(souvenirs, ({ one }) => ({
	weddings: one(weddings, {
		fields: [souvenirs.weddingId],
		references: [weddings.id],
	}),
	vendors: one(vendors, {
		fields: [souvenirs.vendorId],
		references: [vendors.id],
	}),
}));
