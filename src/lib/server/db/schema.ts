import { 
	pgTable, 
	text, 
	timestamp, 
	boolean, 
	integer, 
	decimal, 
	date,
	jsonb,
	pgEnum,
	uuid
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const documentTypeEnum = pgEnum('document_type', ['permit', 'license', 'contract', 'other']);
export const documentStatusEnum = pgEnum('document_status', ['pending', 'approved', 'rejected']);
export const budgetStatusEnum = pgEnum('budget_status', ['planned', 'paid', 'overdue']);
export const todoStatusEnum = pgEnum('todo_status', ['todo', 'in_progress', 'done']);
export const todoPriorityEnum = pgEnum('todo_priority', ['low', 'medium', 'high']);
export const vendorStatusEnum = pgEnum('vendor_status', ['contacted', 'negotiating', 'booked', 'completed']);
export const dresscodeTypeEnum = pgEnum('dresscode_type', ['formal', 'semi_formal', 'casual', 'traditional', 'custom']);
export const savingsEntryTypeEnum = pgEnum('savings_entry_type', ['deposit', 'withdrawal', 'interest', 'transfer']);
export const dowryTypeEnum = pgEnum('dowry_type', ['cash', 'gold', 'property', 'jewelry', 'vehicle', 'electronics', 'furniture', 'other']);
export const dowryStatusEnum = pgEnum('dowry_status', ['promised', 'received', 'documented', 'verified']);
export const souvenirCategoryEnum = pgEnum('souvenir_category', ['edible', 'decorative', 'practical', 'religious', 'custom']);
export const souvenirStatusEnum = pgEnum('souvenir_status', ['planned', 'ordered', 'received', 'distributed']);
export const rundownEventTypeEnum = pgEnum('rundown_event_type', ['ceremony', 'reception', 'preparation', 'photography', 'transportation', 'other']);
export const rundownEventStatusEnum = pgEnum('rundown_event_status', ['planned', 'confirmed', 'in_progress', 'completed', 'cancelled']);
export const weddingStatusEnum = pgEnum('wedding_status', ['planning', 'active', 'completed']);
export const invitationStatusEnum = pgEnum('invitation_status', ['draft', 'published', 'expired']);
export const rsvpStatusEnum = pgEnum('rsvp_status', ['attending', 'declined']);
export const giftOptionTypeEnum = pgEnum('gift_option_type', ['digital_envelope', 'registry', 'cash']);

// Core Tables
export const users = pgTable('users', {
	id: uuid('id').primaryKey().defaultRandom(),
	email: text('email').notNull().unique(),
	firstName: text('first_name').notNull(),
	lastName: text('last_name').notNull(),
	passwordHash: text('password_hash').notNull(),
	emailVerified: boolean('email_verified').default(false),
	emailVerificationToken: text('email_verification_token'),
	passwordResetToken: text('password_reset_token'),
	passwordResetExpiresAt: timestamp('password_reset_expires_at'),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
});

export const sessions = pgTable('sessions', {
	id: text('id').primaryKey(),
	userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull(),
	createdAt: timestamp('created_at').defaultNow()
});

export const weddings = pgTable('weddings', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
	partnerName: text('partner_name'),
	weddingDate: date('wedding_date'),
	venue: text('venue'),
	budget: decimal('budget', { precision: 12, scale: 2 }),
	status: weddingStatusEnum('status').default('planning'),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
});

// Paperwork Module
export const documents = pgTable('documents', {
	id: uuid('id').primaryKey().defaultRandom(),
	weddingId: uuid('wedding_id').notNull().references(() => weddings.id, { onDelete: 'cascade' }),
	title: text('title').notNull(),
	type: documentTypeEnum('type').notNull(),
	status: documentStatusEnum('status').default('pending'),
	dueDate: date('due_date'),
	fileUrl: text('file_url'),
	fileName: text('file_name'),
	fileSize: integer('file_size'),
	mimeType: text('mime_type'),
	notes: text('notes'),
	reminderSent: boolean('reminder_sent').default(false),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
});

// Budget Module
export const budgetItems = pgTable('budget_items', {
	id: uuid('id').primaryKey().defaultRandom(),
	weddingId: uuid('wedding_id').notNull().references(() => weddings.id, { onDelete: 'cascade' }),
	category: text('category').notNull(),
	description: text('description').notNull(),
	plannedAmount: decimal('planned_amount', { precision: 10, scale: 2 }).notNull(),
	actualAmount: decimal('actual_amount', { precision: 10, scale: 2 }),
	vendorId: uuid('vendor_id'),
	dueDate: date('due_date'),
	status: budgetStatusEnum('status').default('planned'),
	receiptUrl: text('receipt_url'),
	paymentMethod: text('payment_method'),
	notes: text('notes'),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
});

// Todo Module
export const todos = pgTable('todos', {
	id: uuid('id').primaryKey().defaultRandom(),
	weddingId: uuid('wedding_id').notNull().references(() => weddings.id, { onDelete: 'cascade' }),
	title: text('title').notNull(),
	description: text('description'),
	status: todoStatusEnum('status').default('todo'),
	priority: todoPriorityEnum('priority').default('medium'),
	dueDate: date('due_date'),
	assignedTo: text('assigned_to'),
	assignedToName: text('assigned_to_name'),
	completedAt: timestamp('completed_at'),
	completedBy: text('completed_by'),
	estimatedHours: integer('estimated_hours'),
	actualHours: integer('actual_hours'),
	tags: jsonb('tags').$type<string[]>(),
	dependencies: jsonb('dependencies').$type<string[]>(),
	attachments: jsonb('attachments').$type<string[]>(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
});

// Vendor Module
export const vendors = pgTable('vendors', {
	id: uuid('id').primaryKey().defaultRandom(),
	weddingId: uuid('wedding_id').notNull().references(() => weddings.id, { onDelete: 'cascade' }),
	name: text('name').notNull(),
	category: text('category').notNull(),
	contactInfo: jsonb('contact_info').$type<{
		phone?: string;
		email?: string;
		address?: string;
		website?: string;
	}>(),
	status: vendorStatusEnum('status').default('contacted'),
	contractUrl: text('contract_url'),
	rating: integer('rating'),
	review: text('review'),
	totalCost: decimal('total_cost', { precision: 10, scale: 2 }),
	depositPaid: decimal('deposit_paid', { precision: 10, scale: 2 }),
	finalPaymentDue: date('final_payment_due'),
	services: jsonb('services').$type<string[]>(),
	notes: text('notes'),
	tags: jsonb('tags').$type<string[]>(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
});

// Dresscode Module
export const dresscodes = pgTable('dresscodes', {
	id: uuid('id').primaryKey().defaultRandom(),
	weddingId: uuid('wedding_id').notNull().references(() => weddings.id, { onDelete: 'cascade' }),
	eventName: text('event_name').notNull(),
	description: text('description').notNull(),
	colorScheme: jsonb('color_scheme').$type<string[]>(),
	dresscodeType: dresscodeTypeEnum('dresscode_type').notNull(),
	inspirationImages: jsonb('inspiration_images').$type<string[]>().default([]),
	guestInstructions: text('guest_instructions'),
	maleAttire: jsonb('male_attire').$type<{
		clothing: string[];
		colors: string[];
		fabrics?: string[];
		accessories?: string[];
		footwear?: string[];
		restrictions?: string[];
	}>(),
	femaleAttire: jsonb('female_attire').$type<{
		clothing: string[];
		colors: string[];
		fabrics?: string[];
		accessories?: string[];
		footwear?: string[];
		restrictions?: string[];
	}>(),
	childrenAttire: jsonb('children_attire').$type<{
		clothing: string[];
		colors: string[];
		fabrics?: string[];
		accessories?: string[];
		footwear?: string[];
		restrictions?: string[];
	}>(),
	weatherConsiderations: text('weather_considerations'),
	culturalRequirements: text('cultural_requirements'),
	accessoryGuidelines: text('accessory_guidelines'),
	isPublic: boolean('is_public').default(false),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
});

// Savings Module
export const savingsSummaries = pgTable('savings_summaries', {
	id: uuid('id').primaryKey().defaultRandom(),
	weddingId: uuid('wedding_id').notNull().references(() => weddings.id, { onDelete: 'cascade' }),
	goalAmount: decimal('goal_amount', { precision: 12, scale: 2 }).notNull(),
	currentAmount: decimal('current_amount', { precision: 12, scale: 2 }).default('0'),
	targetDate: date('target_date'),
	monthlyTarget: decimal('monthly_target', { precision: 10, scale: 2 }),
	autoSaveAmount: decimal('auto_save_amount', { precision: 10, scale: 2 }),
	autoSaveFrequency: text('auto_save_frequency'),
	bankAccountId: text('bank_account_id'),
	interestRate: decimal('interest_rate', { precision: 5, scale: 4 }),
	projectedCompletion: date('projected_completion'),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
});

export const savingsEntries = pgTable('savings_entries', {
	id: uuid('id').primaryKey().defaultRandom(),
	savingsId: uuid('savings_id').notNull().references(() => savingsSummaries.id, { onDelete: 'cascade' }),
	amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
	type: savingsEntryTypeEnum('type').notNull(),
	source: text('source'),
	description: text('description'),
	date: date('date').notNull(),
	receiptUrl: text('receipt_url'),
	bankTransactionId: text('bank_transaction_id'),
	createdAt: timestamp('created_at').defaultNow()
});

// Dowry Module
export const dowryItems = pgTable('dowry_items', {
	id: uuid('id').primaryKey().defaultRandom(),
	weddingId: uuid('wedding_id').notNull().references(() => weddings.id, { onDelete: 'cascade' }),
	type: dowryTypeEnum('type').notNull(),
	subType: text('sub_type'),
	description: text('description').notNull(),
	value: decimal('value', { precision: 12, scale: 2 }).notNull(),
	currency: text('currency').notNull().default('IDR'),
	status: dowryStatusEnum('status').default('promised'),
	proofUrl: jsonb('proof_url').$type<string[]>(),
	certificateUrl: text('certificate_url'),
	appraisalUrl: text('appraisal_url'),
	giver: text('giver').notNull(),
	giverRelation: text('giver_relation'),
	receiver: text('receiver').notNull(),
	receiverRelation: text('receiver_relation'),
	witnessNames: jsonb('witness_names').$type<string[]>(),
	religiousRequirement: boolean('religious_requirement').default(false),
	legalRequirement: boolean('legal_requirement').default(false),
	customaryRequirement: boolean('customary_requirement').default(false),
	location: text('location'),
	receivedDate: date('received_date'),
	documentedDate: date('documented_date'),
	notes: text('notes'),
	tags: jsonb('tags').$type<string[]>(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
});

// Souvenir Module
export const souvenirs = pgTable('souvenirs', {
	id: uuid('id').primaryKey().defaultRandom(),
	weddingId: uuid('wedding_id').notNull().references(() => weddings.id, { onDelete: 'cascade' }),
	name: text('name').notNull(),
	description: text('description'),
	category: souvenirCategoryEnum('category').notNull(),
	vendorId: uuid('vendor_id').references(() => vendors.id),
	vendorName: text('vendor_name'),
	quantity: integer('quantity').notNull(),
	unitCost: decimal('unit_cost', { precision: 8, scale: 2 }).notNull(),
	totalCost: decimal('total_cost', { precision: 10, scale: 2 }).notNull(),
	status: souvenirStatusEnum('status').default('planned'),
	orderDate: date('order_date'),
	expectedDelivery: date('expected_delivery'),
	actualDelivery: date('actual_delivery'),
	distributionPlan: text('distribution_plan'),
	distributionDate: date('distribution_date'),
	packaging: jsonb('packaging').$type<{
		type: string;
		color?: string;
		material?: string;
		customLabel?: boolean;
		labelText?: string;
		ribbonColor?: string;
		specialInstructions?: string;
	}>(),
	customization: jsonb('customization').$type<{
		personalized: boolean;
		coupleNames?: boolean;
		weddingDate?: boolean;
		customMessage?: string;
		logoUrl?: string;
		fontStyle?: string;
		colorScheme?: string[];
	}>(),
	qualityCheck: boolean('quality_check').default(false),
	qualityNotes: text('quality_notes'),
	storageLocation: text('storage_location'),
	expiryDate: date('expiry_date'),
	tags: jsonb('tags').$type<string[]>(),
	imageUrl: jsonb('image_url').$type<string[]>(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
});

// Rundown Module
export const rundownEvents = pgTable('rundown_events', {
	id: uuid('id').primaryKey().defaultRandom(),
	weddingId: uuid('wedding_id').notNull().references(() => weddings.id, { onDelete: 'cascade' }),
	eventName: text('event_name').notNull(),
	eventType: rundownEventTypeEnum('event_type').notNull(),
	startTime: timestamp('start_time').notNull(),
	endTime: timestamp('end_time').notNull(),
	duration: integer('duration'),
	location: text('location'),
	venue: text('venue'),
	description: text('description'),
	assignedTo: jsonb('assigned_to').$type<string[]>(),
	assignedRoles: jsonb('assigned_roles').$type<{
		personName: string;
		role: string;
		contactInfo?: {
			phone?: string;
			email?: string;
			address?: string;
			website?: string;
		};
		responsibilities: string[];
		arrivalTime?: Date;
		briefingRequired?: boolean;
	}[]>(),
	requirements: jsonb('requirements').$type<string[]>(),
	equipment: jsonb('equipment').$type<string[]>(),
	vendors: jsonb('vendors').$type<string[]>(),
	guestCount: integer('guest_count'),
	dresscode: text('dresscode'),
	musicPlaylist: text('music_playlist'),
	specialInstructions: text('special_instructions'),
	backupPlan: text('backup_plan'),
	status: rundownEventStatusEnum('status').default('planned'),
	priority: todoPriorityEnum('priority').default('medium'),
	dependencies: jsonb('dependencies').$type<string[]>(),
	bufferTime: integer('buffer_time'),
	notes: text('notes'),
	sortOrder: integer('sort_order').default(0),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
});

// Invitation Module
export const invitations = pgTable('invitations', {
	id: uuid('id').primaryKey().defaultRandom(),
	weddingId: uuid('wedding_id').notNull().references(() => weddings.id, { onDelete: 'cascade' }),
	slug: text('slug').notNull().unique(),
	template: text('template').notNull(),
	coupleDetails: jsonb('couple_details').$type<{
		brideName: string;
		groomName: string;
		brideParents?: string;
		groomParents?: string;
		brideFamily?: string;
		groomFamily?: string;
	}>().notNull(),
	eventDetails: jsonb('event_details').$type<{
		ceremonyDate?: Date;
		ceremonyTime?: string;
		ceremonyVenue?: string;
		ceremonyAddress?: string;
		receptionDate?: Date;
		receptionTime?: string;
		receptionVenue?: string;
		receptionAddress?: string;
		dresscode?: string;
		specialInstructions?: string;
	}>().notNull(),
	status: invitationStatusEnum('status').default('draft'),
	publishedAt: timestamp('published_at'),
	expiresAt: timestamp('expires_at'),
	viewCount: integer('view_count').default(0),
	rsvpCount: integer('rsvp_count').default(0),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
});

export const guests = pgTable('guests', {
	id: uuid('id').primaryKey().defaultRandom(),
	invitationId: uuid('invitation_id').notNull().references(() => invitations.id, { onDelete: 'cascade' }),
	name: text('name').notNull(),
	phone: text('phone'),
	email: text('email'),
	invitationToken: text('invitation_token').notNull().unique(),
	invitedAt: timestamp('invited_at'),
	viewedAt: timestamp('viewed_at'),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
});

export const rsvps = pgTable('rsvps', {
	id: uuid('id').primaryKey().defaultRandom(),
	guestId: uuid('guest_id').notNull().references(() => guests.id, { onDelete: 'cascade' }),
	status: rsvpStatusEnum('status').notNull(),
	plusOneCount: integer('plus_one_count').default(0),
	mealPreferences: jsonb('meal_preferences').$type<string[]>(),
	specialRequests: text('special_requests'),
	submittedAt: timestamp('submitted_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
});

// Gallery Module
export const galleryItems = pgTable('gallery_items', {
	id: uuid('id').primaryKey().defaultRandom(),
	invitationId: uuid('invitation_id').notNull().references(() => invitations.id, { onDelete: 'cascade' }),
	mediaUrl: text('media_url').notNull(),
	mediaType: text('media_type').notNull(),
	caption: text('caption'),
	sortOrder: integer('sort_order').default(0),
	uploadedBy: text('uploaded_by'),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
});

// Love Story Module
export const loveStoryItems = pgTable('love_story_items', {
	id: uuid('id').primaryKey().defaultRandom(),
	invitationId: uuid('invitation_id').notNull().references(() => invitations.id, { onDelete: 'cascade' }),
	title: text('title').notNull(),
	content: text('content').notNull(),
	date: date('date'),
	mediaUrl: text('media_url'),
	mediaType: text('media_type'),
	sortOrder: integer('sort_order').default(0),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
});

// Gift Module
export const giftOptions = pgTable('gift_options', {
	id: uuid('id').primaryKey().defaultRandom(),
	invitationId: uuid('invitation_id').notNull().references(() => invitations.id, { onDelete: 'cascade' }),
	type: giftOptionTypeEnum('type').notNull(),
	title: text('title').notNull(),
	description: text('description'),
	bankInfo: jsonb('bank_info').$type<{
		bankName: string;
		accountName: string;
		accountNumber: string;
		qrCode?: string;
	}>(),
	registryInfo: jsonb('registry_info').$type<{
		platform: string;
		registryUrl: string;
		registryId?: string;
	}>(),
	isActive: boolean('is_active').default(true),
	sortOrder: integer('sort_order').default(0),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
});

export const giftContributions = pgTable('gift_contributions', {
	id: uuid('id').primaryKey().defaultRandom(),
	giftOptionId: uuid('gift_option_id').notNull().references(() => giftOptions.id, { onDelete: 'cascade' }),
	guestId: uuid('guest_id').references(() => guests.id),
	contributorName: text('contributor_name').notNull(),
	amount: decimal('amount', { precision: 10, scale: 2 }),
	message: text('message'),
	paymentStatus: text('payment_status').default('pending'),
	paymentReference: text('payment_reference'),
	thankYouSent: boolean('thank_you_sent').default(false),
	contributedAt: timestamp('contributed_at').defaultNow(),
	createdAt: timestamp('created_at').defaultNow()
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
	sessions: many(sessions),
	weddings: many(weddings)
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id]
	})
}));

export const weddingsRelations = relations(weddings, ({ one, many }) => ({
	user: one(users, {
		fields: [weddings.userId],
		references: [users.id]
	}),
	documents: many(documents),
	budgetItems: many(budgetItems),
	todos: many(todos),
	vendors: many(vendors),
	dresscodes: many(dresscodes),
	savingsSummaries: many(savingsSummaries),
	dowryItems: many(dowryItems),
	souvenirs: many(souvenirs),
	rundownEvents: many(rundownEvents),
	invitations: many(invitations)
}));

export const documentsRelations = relations(documents, ({ one }) => ({
	wedding: one(weddings, {
		fields: [documents.weddingId],
		references: [weddings.id]
	})
}));

export const budgetItemsRelations = relations(budgetItems, ({ one }) => ({
	wedding: one(weddings, {
		fields: [budgetItems.weddingId],
		references: [weddings.id]
	}),
	vendor: one(vendors, {
		fields: [budgetItems.vendorId],
		references: [vendors.id]
	})
}));

export const todosRelations = relations(todos, ({ one }) => ({
	wedding: one(weddings, {
		fields: [todos.weddingId],
		references: [weddings.id]
	})
}));

export const vendorsRelations = relations(vendors, ({ one, many }) => ({
	wedding: one(weddings, {
		fields: [vendors.weddingId],
		references: [weddings.id]
	}),
	budgetItems: many(budgetItems),
	souvenirs: many(souvenirs)
}));

export const dresscodesRelations = relations(dresscodes, ({ one }) => ({
	wedding: one(weddings, {
		fields: [dresscodes.weddingId],
		references: [weddings.id]
	})
}));

export const savingsSummariesRelations = relations(savingsSummaries, ({ one, many }) => ({
	wedding: one(weddings, {
		fields: [savingsSummaries.weddingId],
		references: [weddings.id]
	}),
	entries: many(savingsEntries)
}));

export const savingsEntriesRelations = relations(savingsEntries, ({ one }) => ({
	savingsSummary: one(savingsSummaries, {
		fields: [savingsEntries.savingsId],
		references: [savingsSummaries.id]
	})
}));

export const dowryItemsRelations = relations(dowryItems, ({ one }) => ({
	wedding: one(weddings, {
		fields: [dowryItems.weddingId],
		references: [weddings.id]
	})
}));

export const souvenirsRelations = relations(souvenirs, ({ one }) => ({
	wedding: one(weddings, {
		fields: [souvenirs.weddingId],
		references: [weddings.id]
	}),
	vendor: one(vendors, {
		fields: [souvenirs.vendorId],
		references: [vendors.id]
	})
}));

export const rundownEventsRelations = relations(rundownEvents, ({ one }) => ({
	wedding: one(weddings, {
		fields: [rundownEvents.weddingId],
		references: [weddings.id]
	})
}));

export const invitationsRelations = relations(invitations, ({ one, many }) => ({
	wedding: one(weddings, {
		fields: [invitations.weddingId],
		references: [weddings.id]
	}),
	guests: many(guests),
	galleryItems: many(galleryItems),
	loveStoryItems: many(loveStoryItems),
	giftOptions: many(giftOptions)
}));

export const guestsRelations = relations(guests, ({ one, many }) => ({
	invitation: one(invitations, {
		fields: [guests.invitationId],
		references: [invitations.id]
	}),
	rsvps: many(rsvps),
	giftContributions: many(giftContributions)
}));

export const rsvpsRelations = relations(rsvps, ({ one }) => ({
	guest: one(guests, {
		fields: [rsvps.guestId],
		references: [guests.id]
	})
}));

export const galleryItemsRelations = relations(galleryItems, ({ one }) => ({
	invitation: one(invitations, {
		fields: [galleryItems.invitationId],
		references: [invitations.id]
	})
}));

export const loveStoryItemsRelations = relations(loveStoryItems, ({ one }) => ({
	invitation: one(invitations, {
		fields: [loveStoryItems.invitationId],
		references: [invitations.id]
	})
}));

export const giftOptionsRelations = relations(giftOptions, ({ one, many }) => ({
	invitation: one(invitations, {
		fields: [giftOptions.invitationId],
		references: [invitations.id]
	}),
	contributions: many(giftContributions)
}));

export const giftContributionsRelations = relations(giftContributions, ({ one }) => ({
	giftOption: one(giftOptions, {
		fields: [giftContributions.giftOptionId],
		references: [giftOptions.id]
	}),
	guest: one(guests, {
		fields: [giftContributions.guestId],
		references: [guests.id]
	})
}));

// Type exports
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
export type Wedding = typeof weddings.$inferSelect;
export type NewWedding = typeof weddings.$inferInsert;
export type Document = typeof documents.$inferSelect;
export type NewDocument = typeof documents.$inferInsert;
export type BudgetItem = typeof budgetItems.$inferSelect;
export type NewBudgetItem = typeof budgetItems.$inferInsert;
export type Todo = typeof todos.$inferSelect;
export type NewTodo = typeof todos.$inferInsert;
export type Vendor = typeof vendors.$inferSelect;
export type NewVendor = typeof vendors.$inferInsert;
export type Dresscode = typeof dresscodes.$inferSelect;
export type NewDresscode = typeof dresscodes.$inferInsert;
export type SavingsSummary = typeof savingsSummaries.$inferSelect;
export type NewSavingsSummary = typeof savingsSummaries.$inferInsert;
export type SavingsEntry = typeof savingsEntries.$inferSelect;
export type NewSavingsEntry = typeof savingsEntries.$inferInsert;
export type DowryItem = typeof dowryItems.$inferSelect;
export type NewDowryItem = typeof dowryItems.$inferInsert;
export type Souvenir = typeof souvenirs.$inferSelect;
export type NewSouvenir = typeof souvenirs.$inferInsert;
export type RundownEvent = typeof rundownEvents.$inferSelect;
export type NewRundownEvent = typeof rundownEvents.$inferInsert;
export type Invitation = typeof invitations.$inferSelect;
export type NewInvitation = typeof invitations.$inferInsert;
export type Guest = typeof guests.$inferSelect;
export type NewGuest = typeof guests.$inferInsert;
export type RSVP = typeof rsvps.$inferSelect;
export type NewRSVP = typeof rsvps.$inferInsert;
export type GalleryItem = typeof galleryItems.$inferSelect;
export type NewGalleryItem = typeof galleryItems.$inferInsert;
export type LoveStoryItem = typeof loveStoryItems.$inferSelect;
export type NewLoveStoryItem = typeof loveStoryItems.$inferInsert;
export type GiftOption = typeof giftOptions.$inferSelect;
export type NewGiftOption = typeof giftOptions.$inferInsert;
export type GiftContribution = typeof giftContributions.$inferSelect;
export type NewGiftContribution = typeof giftContributions.$inferInsert;
