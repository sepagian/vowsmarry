import {
	pgTable,
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
	documentStatusEnum,
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

//
// CORE SCHEMA
//

export const weddings = pgTable(
	'weddings',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		userId: uuid('user_id').notNull(),
		groomName: varchar('groom_name', { length: 200 }),
		brideName: varchar('bride_name', { length: 200 }),
		weddingDate: date('wedding_date'),
		weddingVenue: varchar('wedding_venue'),
		weddingBudget: numeric('wedding_budget', { precision: 12, scale: 2 }),
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
		userName: varchar('user_name', { length: 255 }),
		userEmail: varchar('user_email', { length: 255 }),
		userPhone: varchar('user_phone', { length: 50 }),
		userRole: userRoleEnum('user_role').default('partner'),
		userAvatarUrl: varchar('avatar_url'),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull(),
	},
	(table) => ({
		weddingIdIdx: index('users_wedding_id_idx').on(table.weddingId),
		emailIdx: index('users_email_idx').on(table.userEmail),
		roleIdx: index('users_role_idx').on(table.userRole),
	}),
);

//
// TASKS SCHEMA
//

export const tasks = pgTable(
	'tasks',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		weddingId: uuid('wedding_id')
			.notNull()
			.references(() => weddings.id, { onDelete: 'cascade' }),
		taskDescription: varchar('task_description', { length: 255 }).notNull(),
		taskCategory: categoryEnum('task_category').notNull(),
		taskStatus: taskStatusEnum('status').default('pending').notNull(),
		taskPriority: taskPriorityEnum('priority').default('low').notNull(),
		taskDueDate: date('due_date').notNull(),
		completedAt: timestamp('completed_at'),
		assignedTo: uuid('assigned_to'),
		createdBy: uuid('created_by').notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull(),
	},
	(table) => ({
		weddingIdIdx: index('tasks_wedding_id_idx').on(table.weddingId),
		statusIdx: index('tasks_status_idx').on(table.taskStatus),
		priorityIdx: index('tasks_priority_idx').on(table.taskPriority),
		dueDateIdx: index('tasks_due_date_idx').on(table.taskDueDate),
		createdByIdx: index('tasks_created_by_idx').on(table.createdBy),
		assignedToIdx: index('tasks_assigned_to_idx').on(table.assignedTo),
	}),
);

//
// DOCUMENTS SCHEMA
//

export const documents = pgTable(
	'documents',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		weddingId: uuid('wedding_id')
			.notNull()
			.references(() => weddings.id, { onDelete: 'cascade' }),
		documentName: varchar('name', { length: 255 }).notNull(),
		documentCategory: documentCategoryEnum('document_category').notNull(),
		documentDate: date('document_date').notNull(),
		documentStatus: documentStatusEnum('status').default('pending').notNull(),
		documentDueDate: date('due_date'),
		fileUrl: varchar('file_url').notNull(),
		fileName: varchar('file_name', { length: 255 }).notNull(),
		fileSize: integer('filesize').notNull(),
		mimeType: varchar('mimetype', { length: 255 }).notNull(),
		reminderSent: boolean('reminder_sent').default(false).notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull(),
	},
	(table) => ({
		weddingIdIdx: index('documents_wedding_id_idx').on(table.weddingId),
		documentCategoryIdx: index('documents_type_idx').on(table.documentCategory),
	}),
);

//
// FINANCE SCHEMA
//

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
		expenseDescription: varchar('description', { length: 255 }).notNull(),
		expenseCategory: categoryEnum('category').notNull(),
		expenseAmount: numeric('amount', { precision: 12, scale: 2 }).default('0').notNull(),
		expensePaymentStatus: expensePaymentStatusEnum('payment_status').default('unpaid').notNull(),
		expenseDueDate: date('due_date').notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull(),
	},
	(table) => ({
		weddingIdIdx: index('expense_items_wedding_id_idx').on(table.weddingId),
		categoryIdIdx: index('expense_items_category_idx').on(table.expenseCategory),
		amountIdx: index('expense_items_amount_idx').on(table.expenseAmount),
		paymentStatusIdx: index('expense_items_payment_status_idx').on(table.expensePaymentStatus),
		dueDateIdx: index('expense_items_due_date_idx').on(table.expenseDueDate),
	}),
);

export const savingsItems = pgTable(
	'savings_items',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		weddingId: uuid('wedding_id')
			.notNull()
			.references(() => weddings.id, { onDelete: 'cascade' }),
		savingAmount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
		savingDescription: varchar('description', { length: 255 }),
		savingDate: date('date').defaultNow().notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
	},
	(table) => ({
		weddingIdIdx: index('savings_items_wedding_id_idx').on(table.weddingId),
		dateIdx: index('savings_items_date_idx').on(table.savingDate),
	}),
);

//
// VENDOR SCHEMA
//

export const vendors = pgTable(
	'vendors',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		weddingId: uuid('wedding_id')
			.notNull()
			.references(() => weddings.id, { onDelete: 'cascade' }),
		vendorName: varchar('name', { length: 200 }).notNull(),
		vendorCategory: categoryEnum('category').notNull(),
		vendorInstagram: varchar('instagram', { length: 50 }),
		vendorEmail: varchar('email', { length: 255 }),
		vendorPhone: varchar('phone', { length: 50 }),
		vendorWebsite: varchar('website', { length: 50 }),
		vendorStatus: vendorStatusEnum('status').default('researching').notNull(),
		vendorRating: vendorRatingEnum('rating').notNull(), // 1-5 stars
		vendorTotalCost: numeric('total_cost', { precision: 12, scale: 2 }),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull(),
	},
	(table) => ({
		weddingIdIdx: index('vendors_wedding_id_idx').on(table.weddingId),
		categoryIdx: index('vendors_category_idx').on(table.vendorCategory),
		statusIdx: index('vendors_status_idx').on(table.vendorStatus),
		ratingIdx: index('vendors_rating_idx').on(table.vendorRating),
	}),
);

//
// SCHEDULE SCHEMA
//

export const schedules = pgTable(
	'schedules',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		weddingId: uuid('wedding_id')
			.notNull()
			.references(() => weddings.id, { onDelete: 'cascade' }),
		scheduleName: varchar('schedule_name', { length: 200 }).notNull(),
		scheduleCategory: rundownTypeEnum('schedule_category').notNull(), // ceremony, reception, party, etc.
		scheduleDate: date('schedule_date').notNull(),
		scheduleStartTime: time('schedule_start_time').notNull(),
		scheduleEndTime: time('schedule_end_time').notNull(),
		scheduleLocation: varchar('schedule_location', { length: 255 }).notNull(),
		scheduleVenue: varchar('schedule_venue', { length: 255 }).notNull(),
		scheduleAttendees: varchar('schedule_attendees', { length: 255 }).notNull(),
		isPublic: boolean('is_public').default(false).notNull(), // visible to guests
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull(),
	},
	(table) => ({
		weddingIdIdx: index('rundown_events_wedding_id_idx').on(table.weddingId),
		startTimeIdx: index('rundown_events_start_time_idx').on(table.scheduleStartTime),
	}),
);

//
// DOWRY SCHEMA
//

export const dowry = pgTable(
	'dowry',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		weddingId: uuid('wedding_id')
			.notNull()
			.references(() => weddings.id, { onDelete: 'cascade' }),
		dowryDescription: varchar('description', { length: 255 }),
		dowryCategory: dowryTypeEnum('type').notNull(),
		dowryPrice: numeric('price', { precision: 12, scale: 2 }).notNull(),
		dowryQuantity: integer('quantity'),
		dowryStatus: dowryStatusEnum('status').default('pending'),
		dowryDateReceived: timestamp('date_received'),
		dowryRecipient: dowryRecipientEnum('recipient').notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull(),
	},
	(table) => ({
		weddingIdx: index('dowry_wedding_id_idx').on(table.weddingId),
		typeIdx: index('dowry_type_idx').on(table.dowryCategory),
		statusIdx: index('dowry_status_idx').on(table.dowryStatus),
	}),
);

//
// SOUVENIR SCHEMA
//

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
		souvenirName: varchar('name', { length: 255 }).notNull(),
		souvenirQuantity: integer('quantity').notNull(),
		souvenirPrice: numeric('unit_price', { precision: 12, scale: 2 }).notNull(),
		souvenirTotalCost: numeric('total_cost', { precision: 12, scale: 2 }).notNull(),
		souvenirStatus: souvenirStatusEnum('status').default('planned'),
		souvenirOrderDate: timestamp('order_date'),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull(),
	},
	(table) => ({
		weddingIdIdx: index('souvenirs_wedding_id_idx').on(table.weddingId),
		vendorIdIdx: index('souvenirs_vendor_id_idx').on(table.vendorId),
		statusIdx: index('souvenirs_status_idx').on(table.souvenirStatus),
	}),
);

//
// DRESSCODE SCHEMA
//

export const dresscodes = pgTable(
	'dresscodes',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		weddingId: uuid('wedding_id')
			.notNull()
			.references(() => weddings.id, { onDelete: 'cascade' }),
		rundownId: uuid('rundown_id')
			.notNull()
			.references(() => schedules.id, { onDelete: 'cascade' }),
		dresscodeDescription: varchar('description', { length: 255 }).notNull(),
		dresscodeRole: dresscodeRoleEnum('dresscode_role').notNull(),
		dresscodeImageUrl: varchar('image_url', { length: 255 }),
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
	savingsItems: many(savingsItems),
	vendors: many(vendors),
	schedules: many(schedules),
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
}));

export const savingsItemsRelations = relations(savingsItems, ({ one }) => ({
	weddings: one(weddings, {
		fields: [savingsItems.weddingId],
		references: [weddings.id],
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

export const schedulesRelations = relations(schedules, ({ one, many }) => ({
	weddings: one(weddings, {
		fields: [schedules.weddingId],
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
	schedules: one(schedules, {
		fields: [dresscodes.rundownId],
		references: [schedules.id],
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
