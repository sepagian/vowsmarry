import { sqliteTable, text, integer, real, index, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import { invitations } from './invitation';
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
	userRoleValues,
} from './enums';

//
// CORE SCHEMA
//

export const weddings = sqliteTable(
	'weddings',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		userId: text('user_id').notNull(),
		groomName: text('groom_name'),
		brideName: text('bride_name'),
		weddingDate: text('wedding_date'), // ISO date string (YYYY-MM-DD)
		weddingVenue: text('wedding_venue'),
		weddingBudget: real('wedding_budget'),
		createdAt: integer('created_at', { mode: 'timestamp' })
			.$defaultFn(() => new Date())
			.notNull(),
		updatedAt: integer('updated_at', { mode: 'timestamp' })
			.$defaultFn(() => new Date())
			.notNull(),
	},
	(table) => ({
		userIdIdx: index('weddings_user_id_idx').on(table.userId),
	}),
);

export const users = sqliteTable(
	'users',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		weddingId: text('wedding_id')
			.notNull()
			.references(() => weddings.id, { onDelete: 'cascade' }),
		userName: text('user_name'),
		userEmail: text('user_email'),
		userPhone: text('user_phone'),
		userRole: text('user_role', { enum: userRoleValues }).default('partner'),
		userAvatarUrl: text('avatar_url'),
		createdAt: integer('created_at', { mode: 'timestamp' })
			.$defaultFn(() => new Date())
			.notNull(),
		updatedAt: integer('updated_at', { mode: 'timestamp' })
			.$defaultFn(() => new Date())
			.notNull(),
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

export const tasks = sqliteTable(
	'tasks',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		weddingId: text('wedding_id')
			.notNull()
			.references(() => weddings.id, { onDelete: 'cascade' }),
		organizationId: text('organization_id'),
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
		weddingIdIdx: index('tasks_wedding_id_idx').on(table.weddingId),
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
		weddingId: text('wedding_id')
			.notNull()
			.references(() => weddings.id, { onDelete: 'cascade' }),
		organizationId: text('organization_id'),
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
		weddingIdIdx: index('documents_wedding_id_idx').on(table.weddingId),
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
		weddingId: text('wedding_id')
			.notNull()
			.references(() => weddings.id, { onDelete: 'cascade' }),
		organizationId: text('organization_id'),
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
		weddingIdIdx: index('expense_categories_wedding_id_idx').on(table.weddingId),
		organizationIdIdx: index('expense_categories_organization_id_idx').on(table.organizationId),
		weddingCategoryIdx: uniqueIndex('expense_categories_wedding_category_idx').on(
			table.weddingId,
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
		weddingId: text('wedding_id')
			.notNull()
			.references(() => weddings.id, { onDelete: 'cascade' }),
		organizationId: text('organization_id'),
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
		weddingIdIdx: index('expense_items_wedding_id_idx').on(table.weddingId),
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
		weddingId: text('wedding_id')
			.notNull()
			.references(() => weddings.id, { onDelete: 'cascade' }),
		organizationId: text('organization_id'),
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
		weddingIdIdx: index('savings_items_wedding_id_idx').on(table.weddingId),
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
		weddingId: text('wedding_id')
			.notNull()
			.references(() => weddings.id, { onDelete: 'cascade' }),
		organizationId: text('organization_id'),
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
		weddingIdIdx: index('vendors_wedding_id_idx').on(table.weddingId),
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
		weddingId: text('wedding_id')
			.notNull()
			.references(() => weddings.id, { onDelete: 'cascade' }),
		organizationId: text('organization_id'),
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
		weddingIdIdx: index('rundown_events_wedding_id_idx').on(table.weddingId),
		organizationIdIdx: index('schedules_organization_id_idx').on(table.organizationId),
		startTimeIdx: index('rundown_events_start_time_idx').on(table.scheduleStartTime),
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
		weddingId: text('wedding_id')
			.notNull()
			.references(() => weddings.id, { onDelete: 'cascade' }),
		organizationId: text('organization_id'),
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
		weddingIdx: index('dowry_wedding_id_idx').on(table.weddingId),
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
		weddingId: text('wedding_id')
			.notNull()
			.references(() => weddings.id, { onDelete: 'cascade' }),
		organizationId: text('organization_id'),
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
		weddingIdIdx: index('souvenirs_wedding_id_idx').on(table.weddingId),
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
		weddingId: text('wedding_id')
			.notNull()
			.references(() => weddings.id, { onDelete: 'cascade' }),
		organizationId: text('organization_id'),
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
		weddingIdIdx: index('dresscodes_wedding_id_idx').on(table.weddingId),
		organizationIdIdx: index('dresscodes_organization_id_idx').on(table.organizationId),
		dresscodeRoleIdx: index('dresscodes_dresscode_role_idx').on(table.dresscodeRole),
		scheduleIdIdx: index('dresscodes_rundown_id_idx').on(table.scheduleId),
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
		fields: [dresscodes.scheduleId],
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
