import { sqliteTable, text, integer, real, index, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import { invitations } from './invitation';
import { organization } from './auth-schema';
import {
	categoryValues,
	taskPriorityValues,
	taskStatusValues,
	documentCategoryValues,
	documentStatusValues,
	expensePaymentStatusValues,
	vendorStatusValues,
	vendorRatingValues,
	rundownTypeValues,
	dowryRecipientValues,
	dowryStatusValues,
	dowryTypeValues,
	souvenirStatusValues,
	dresscodeRoleValues,
} from './enums';

//
// TASKS SCHEMA
//

export const tasks = sqliteTable(
	'tasks',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		organizationId: text('organization_id')
			.notNull()
			.references(() => organization.id, { onDelete: 'cascade' }),
		taskDescription: text('task_description').notNull(),
		taskCategory: text('task_category', { enum: categoryValues }).notNull(),
		taskStatus: text('task_status', { enum: taskStatusValues }).default('pending').notNull(),
		taskPriority: text('task_priority', { enum: taskPriorityValues }).default('low').notNull(),
		taskDueDate: text('task_due_date').notNull(), // ISO date string (YYYY-MM-DD)
		completedAt: integer('completed_at', { mode: 'timestamp' }),
		assignedTo: text('assigned_to'),
		createdBy: text('created_by').notNull(),
		createdAt: integer('created_at', { mode: 'timestamp' })
			.$defaultFn(() => new Date())
			.notNull(),
		updatedAt: integer('updated_at', { mode: 'timestamp' })
			.$defaultFn(() => new Date())
			.notNull(),
	},
	(table) => ({
		organizationIdIdx: index('tasks_organization_id_idx').on(table.organizationId),
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

export const documents = sqliteTable(
	'documents',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		organizationId: text('organization_id')
			.notNull()
			.references(() => organization.id, { onDelete: 'cascade' }),
		documentName: text('document_name').notNull(),
		documentCategory: text('document_category', { enum: documentCategoryValues }).notNull(),
		documentDate: text('document_date').notNull(), // ISO date string (YYYY-MM-DD)
		documentStatus: text('document_status', { enum: documentStatusValues }).default('pending').notNull(),
		documentDueDate: text('document_due_date'), // ISO date string (YYYY-MM-DD)
		fileUrl: text('file_url').notNull(),
		fileName: text('file_name').notNull(),
		fileSize: integer('file_size').notNull(),
		mimeType: text('mime_type').notNull(),
		reminderSent: integer('reminder_sent', { mode: 'boolean' }).default(false).notNull(),
		createdAt: integer('created_at', { mode: 'timestamp' })
			.$defaultFn(() => new Date())
			.notNull(),
		updatedAt: integer('updated_at', { mode: 'timestamp' })
			.$defaultFn(() => new Date())
			.notNull(),
	},
	(table) => ({
		organizationIdIdx: index('documents_organization_id_idx').on(table.organizationId),
		documentCategoryIdx: index('documents_type_idx').on(table.documentCategory),
	}),
);

//
// FINANCE SCHEMA
//

export const expenseCategories = sqliteTable(
	'expense_categories',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		organizationId: text('organization_id')
			.notNull()
			.references(() => organization.id, { onDelete: 'cascade' }),
		category: text('category', { enum: categoryValues }),
		allocatedAmount: real('allocated_amount').default(0).notNull(),
		spentAmount: real('spent_amount').default(0).notNull(),
		createdAt: integer('created_at', { mode: 'timestamp' })
			.$defaultFn(() => new Date())
			.notNull(),
		updatedAt: integer('updated_at', { mode: 'timestamp' })
			.$defaultFn(() => new Date())
			.notNull(),
	},
	(table) => ({
		organizationIdIdx: index('expense_categories_organization_id_idx').on(table.organizationId),
		organizationCategoryIdx: uniqueIndex('expense_categories_organization_category_idx').on(
			table.organizationId,
			table.category,
		),
	}),
);

export const expenseItems = sqliteTable(
	'expense_items',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		organizationId: text('organization_id')
			.notNull()
			.references(() => organization.id, { onDelete: 'cascade' }),
		expenseDescription: text('expense_description').notNull(),
		expenseCategory: text('expense_category', { enum: categoryValues }).notNull(),
		expenseAmount: real('expense_amount').default(0).notNull(),
		expensePaymentStatus: text('expense_payment_status', { enum: expensePaymentStatusValues })
			.default('unpaid')
			.notNull(),
		expenseDueDate: text('expense_due_date').notNull(), // ISO date string (YYYY-MM-DD)
		createdAt: integer('created_at', { mode: 'timestamp' })
			.$defaultFn(() => new Date())
			.notNull(),
		updatedAt: integer('updated_at', { mode: 'timestamp' })
			.$defaultFn(() => new Date())
			.notNull(),
	},
	(table) => ({
		organizationIdIdx: index('expense_items_organization_id_idx').on(table.organizationId),
		categoryIdIdx: index('expense_items_category_idx').on(table.expenseCategory),
		amountIdx: index('expense_items_amount_idx').on(table.expenseAmount),
		paymentStatusIdx: index('expense_items_payment_status_idx').on(table.expensePaymentStatus),
		dueDateIdx: index('expense_items_due_date_idx').on(table.expenseDueDate),
	}),
);

export const savingsItems = sqliteTable(
	'savings_items',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		organizationId: text('organization_id')
			.notNull()
			.references(() => organization.id, { onDelete: 'cascade' }),
		savingAmount: real('amount').notNull(),
		savingDescription: text('description'),
		savingDate: text('date')
			.$defaultFn(() => new Date().toISOString().split('T')[0])
			.notNull(), // ISO date string (YYYY-MM-DD)
		createdAt: integer('created_at', { mode: 'timestamp' })
			.$defaultFn(() => new Date())
			.notNull(),
	},
	(table) => ({
		organizationIdIdx: index('savings_items_organization_id_idx').on(table.organizationId),
		dateIdx: index('savings_items_date_idx').on(table.savingDate),
	}),
);

//
// VENDOR SCHEMA
//

export const vendors = sqliteTable(
	'vendors',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		organizationId: text('organization_id')
			.notNull()
			.references(() => organization.id, { onDelete: 'cascade' }),
		vendorName: text('vendor_name').notNull(),
		vendorCategory: text('vendor_category', { enum: categoryValues }).notNull(),
		vendorInstagram: text('vendor_instagram'),
		vendorEmail: text('vendor_email'),
		vendorPhone: text('vendor_phone'),
		vendorWebsite: text('vendor_website'),
		vendorStatus: text('vendor_status', { enum: vendorStatusValues }).default('researching').notNull(),
		vendorRating: text('vendor_rating', { enum: vendorRatingValues }).notNull(), // 1-5 stars
		vendorTotalCost: real('vendor_total_cost'),
		createdAt: integer('created_at', { mode: 'timestamp' })
			.$defaultFn(() => new Date())
			.notNull(),
		updatedAt: integer('updated_at', { mode: 'timestamp' })
			.$defaultFn(() => new Date())
			.notNull(),
	},
	(table) => ({
		organizationIdIdx: index('vendors_organization_id_idx').on(table.organizationId),
		categoryIdx: index('vendors_category_idx').on(table.vendorCategory),
		statusIdx: index('vendors_status_idx').on(table.vendorStatus),
		ratingIdx: index('vendors_rating_idx').on(table.vendorRating),
	}),
);

//
// SCHEDULE SCHEMA
//

export const schedules = sqliteTable(
	'schedules',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		organizationId: text('organization_id')
			.notNull()
			.references(() => organization.id, { onDelete: 'cascade' }),
		scheduleName: text('schedule_name').notNull(),
		scheduleCategory: text('schedule_category', { enum: rundownTypeValues }).notNull(), // ceremony, reception, party, etc.
		scheduleDate: text('schedule_date').notNull(), // ISO date string (YYYY-MM-DD)
		scheduleStartTime: text('schedule_start_time').notNull(), // ISO time string (HH:MM:SS)
		scheduleEndTime: text('schedule_end_time').notNull(), // ISO time string (HH:MM:SS)
		scheduleLocation: text('schedule_location').notNull(),
		scheduleVenue: text('schedule_venue').notNull(),
		scheduleAttendees: text('schedule_attendees').notNull(),
		isPublic: integer('is_public', { mode: 'boolean' }).default(false).notNull(), // visible to guests
		createdAt: integer('created_at', { mode: 'timestamp' })
			.$defaultFn(() => new Date())
			.notNull(),
		updatedAt: integer('updated_at', { mode: 'timestamp' })
			.$defaultFn(() => new Date())
			.notNull(),
	},
	(table) => ({
		organizationIdIdx: index('schedules_organization_id_idx').on(table.organizationId),
		startTimeIdx: index('schedules_start_time_idx').on(table.scheduleStartTime),
	}),
);

//
// DOWRY SCHEMA
//

export const dowry = sqliteTable(
	'dowry',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		organizationId: text('organization_id')
			.notNull()
			.references(() => organization.id, { onDelete: 'cascade' }),
		dowryDescription: text('description'),
		dowryCategory: text('type', { enum: dowryTypeValues }).notNull(),
		dowryPrice: real('price').notNull(),
		dowryQuantity: integer('quantity'),
		dowryStatus: text('status', { enum: dowryStatusValues }).default('pending'),
		dowryDateReceived: integer('date_received', { mode: 'timestamp' }),
		dowryRecipient: text('recipient', { enum: dowryRecipientValues }).notNull(),
		createdAt: integer('created_at', { mode: 'timestamp' })
			.$defaultFn(() => new Date())
			.notNull(),
		updatedAt: integer('updated_at', { mode: 'timestamp' })
			.$defaultFn(() => new Date())
			.notNull(),
	},
	(table) => ({
		organizationIdIdx: index('dowry_organization_id_idx').on(table.organizationId),
		typeIdx: index('dowry_type_idx').on(table.dowryCategory),
		statusIdx: index('dowry_status_idx').on(table.dowryStatus),
	}),
);

//
// SOUVENIR SCHEMA
//

export const souvenirs = sqliteTable(
	'souvenirs',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		organizationId: text('organization_id')
			.notNull()
			.references(() => organization.id, { onDelete: 'cascade' }),
		vendorId: text('vendor_id')
			.notNull()
			.references(() => vendors.id, { onDelete: 'cascade' }),
		souvenirName: text('name').notNull(),
		souvenirQuantity: integer('quantity').notNull(),
		souvenirPrice: real('unit_price').notNull(),
		souvenirTotalCost: real('total_cost').notNull(),
		souvenirStatus: text('status', { enum: souvenirStatusValues }).default('planned'),
		souvenirOrderDate: integer('order_date', { mode: 'timestamp' }),
		createdAt: integer('created_at', { mode: 'timestamp' })
			.$defaultFn(() => new Date())
			.notNull(),
		updatedAt: integer('updated_at', { mode: 'timestamp' })
			.$defaultFn(() => new Date())
			.notNull(),
	},
	(table) => ({
		organizationIdIdx: index('souvenirs_organization_id_idx').on(table.organizationId),
		vendorIdIdx: index('souvenirs_vendor_id_idx').on(table.vendorId),
		statusIdx: index('souvenirs_status_idx').on(table.souvenirStatus),
	}),
);

//
// DRESSCODE SCHEMA
//

export const dresscodes = sqliteTable(
	'dresscodes',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		organizationId: text('organization_id')
			.notNull()
			.references(() => organization.id, { onDelete: 'cascade' }),
		scheduleId: text('schedule_id')
			.notNull()
			.references(() => schedules.id, { onDelete: 'cascade' }),
		dresscodeDescription: text('description').notNull(),
		dresscodeRole: text('dresscode_role', { enum: dresscodeRoleValues }).notNull(),
		dresscodeImageUrl: text('image_url'),
		createdAt: integer('created_at', { mode: 'timestamp' })
			.$defaultFn(() => new Date())
			.notNull(),
		updatedAt: integer('updated_at', { mode: 'timestamp' })
			.$defaultFn(() => new Date())
			.notNull(),
	},
	(table) => ({
		organizationIdIdx: index('dresscodes_organization_id_idx').on(table.organizationId),
		dresscodeRoleIdx: index('dresscodes_dresscode_role_idx').on(table.dresscodeRole),
		scheduleIdIdx: index('dresscodes_schedule_id_idx').on(table.scheduleId),
	}),
);

// RELATIONS

export const organizationRelations = relations(organization, ({ many }) => ({
	tasks: many(tasks),
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

export const tasksRelations = relations(tasks, ({ one }) => ({
	organization: one(organization, {
		fields: [tasks.organizationId],
		references: [organization.id],
	}),
}));

export const documentsRelations = relations(documents, ({ one }) => ({
	organization: one(organization, {
		fields: [documents.organizationId],
		references: [organization.id],
	}),
}));

export const expenseCategoriesRelations = relations(expenseCategories, ({ one, many }) => ({
	organization: one(organization, {
		fields: [expenseCategories.organizationId],
		references: [organization.id],
	}),
	expenseItems: many(expenseItems),
}));

export const expenseItemsRelations = relations(expenseItems, ({ one }) => ({
	organization: one(organization, {
		fields: [expenseItems.organizationId],
		references: [organization.id],
	}),
}));

export const savingsItemsRelations = relations(savingsItems, ({ one }) => ({
	organization: one(organization, {
		fields: [savingsItems.organizationId],
		references: [organization.id],
	}),
}));

export const vendorsRelations = relations(vendors, ({ one, many }) => ({
	organization: one(organization, {
		fields: [vendors.organizationId],
		references: [organization.id],
	}),
	expenseItems: many(expenseItems),
	souvenirs: many(souvenirs),
}));

export const schedulesRelations = relations(schedules, ({ one, many }) => ({
	organization: one(organization, {
		fields: [schedules.organizationId],
		references: [organization.id],
	}),
	dresscodes: many(dresscodes),
}));

export const dowryRelations = relations(dowry, ({ one }) => ({
	organization: one(organization, {
		fields: [dowry.organizationId],
		references: [organization.id],
	}),
}));

export const dresscodeRelations = relations(dresscodes, ({ one }) => ({
	organization: one(organization, {
		fields: [dresscodes.organizationId],
		references: [organization.id],
	}),
	schedules: one(schedules, {
		fields: [dresscodes.scheduleId],
		references: [schedules.id],
	}),
}));

export const souvenirsRelations = relations(souvenirs, ({ one }) => ({
	organization: one(organization, {
		fields: [souvenirs.organizationId],
		references: [organization.id],
	}),
	vendors: one(vendors, {
		fields: [souvenirs.vendorId],
		references: [vendors.id],
	}),
}));
