import { pgTable, text, timestamp, boolean, integer, decimal, uuid, varchar, jsonb, index, uniqueIndex } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// ============================================================================
// CORE TABLES
// ============================================================================

export const weddings = pgTable('weddings', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull(), // Supabase auth user ID
    partnerName: varchar('partner_name', { length: 200 }),
    weddingDate: timestamp('wedding_date'),
    venue: text('venue'),
    budget: decimal('budget', { precision: 12, scale: 2 }),
    status: varchar('status', { length: 20 }).default('planning').notNull(), // planning, active, completed
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (table) => ({
    userIdIdx: index('weddings_user_id_idx').on(table.userId),
    statusIdx: index('weddings_status_idx').on(table.status)
}))

// ============================================================================
// PAPERWORK MODULE
// ============================================================================

export const documents = pgTable('documents', {
    id: uuid('id').primaryKey().defaultRandom(),
    weddingId: uuid('wedding_id').notNull().references(() => weddings.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 255 }).notNull(),
    type: varchar('type', { length: 50 }).notNull(), // permit, license, contract, other
    status: varchar('status', { length: 20 }).default('pending').notNull(), // pending, approved, rejected
    dueDate: timestamp('due_date'),
    fileUrl: text('file_url'),
    fileName: varchar('file_name', { length: 255 }),
    fileSize: integer('file_size'),
    mimeType: varchar('mime_type', { length: 100 }),
    notes: text('notes'),
    reminderSent: boolean('reminder_sent').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (table) => ({
    weddingIdIdx: index('documents_wedding_id_idx').on(table.weddingId),
    typeIdx: index('documents_type_idx').on(table.type),
    statusIdx: index('documents_status_idx').on(table.status),
    dueDateIdx: index('documents_due_date_idx').on(table.dueDate)
}))

export const documentReminders = pgTable('document_reminders', {
    id: uuid('id').primaryKey().defaultRandom(),
    documentId: uuid('document_id').notNull().references(() => documents.id, { onDelete: 'cascade' }),
    reminderDate: timestamp('reminder_date').notNull(),
    sent: boolean('sent').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull()
}, (table) => ({
    documentIdIdx: index('document_reminders_document_id_idx').on(table.documentId),
    reminderDateIdx: index('document_reminders_reminder_date_idx').on(table.reminderDate)
}))

// ============================================================================
// BUDGET MODULE
// ============================================================================

export const budgetCategories = pgTable('budget_categories', {
    id: uuid('id').primaryKey().defaultRandom(),
    weddingId: uuid('wedding_id').notNull().references(() => weddings.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 100 }).notNull(),
    allocatedAmount: decimal('allocated_amount', { precision: 12, scale: 2 }).default('0').notNull(),
    spentAmount: decimal('spent_amount', { precision: 12, scale: 2 }).default('0').notNull(),
    color: varchar('color', { length: 7 }), // hex color
    description: text('description'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (table) => ({
    weddingIdIdx: index('budget_categories_wedding_id_idx').on(table.weddingId)
}))

export const budgetItems = pgTable('budget_items', {
    id: uuid('id').primaryKey().defaultRandom(),
    weddingId: uuid('wedding_id').notNull().references(() => weddings.id, { onDelete: 'cascade' }),
    categoryId: uuid('category_id').references(() => budgetCategories.id, { onDelete: 'set null' }),
    vendorId: uuid('vendor_id').references(() => vendors.id, { onDelete: 'set null' }),
    description: varchar('description', { length: 255 }).notNull(),
    plannedAmount: decimal('planned_amount', { precision: 12, scale: 2 }).notNull(),
    actualAmount: decimal('actual_amount', { precision: 12, scale: 2 }),
    dueDate: timestamp('due_date'),
    status: varchar('status', { length: 20 }).default('planned').notNull(), // planned, paid, overdue
    receiptUrl: text('receipt_url'),
    paymentMethod: varchar('payment_method', { length: 50 }),
    notes: text('notes'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (table) => ({
    weddingIdIdx: index('budget_items_wedding_id_idx').on(table.weddingId),
    categoryIdIdx: index('budget_items_category_id_idx').on(table.categoryId),
    vendorIdIdx: index('budget_items_vendor_id_idx').on(table.vendorId),
    statusIdx: index('budget_items_status_idx').on(table.status),
    dueDateIdx: index('budget_items_due_date_idx').on(table.dueDate)
}))

export const budgetAlerts = pgTable('budget_alerts', {
    id: uuid('id').primaryKey().defaultRandom(),
    weddingId: uuid('wedding_id').notNull().references(() => weddings.id, { onDelete: 'cascade' }),
    categoryId: uuid('category_id').references(() => budgetCategories.id, { onDelete: 'cascade' }),
    type: varchar('type', { length: 30 }).notNull(), // overspend, approaching_limit, payment_due
    message: text('message').notNull(),
    threshold: decimal('threshold', { precision: 12, scale: 2 }).notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull()
}, (table) => ({
    weddingIdIdx: index('budget_alerts_wedding_id_idx').on(table.weddingId),
    typeIdx: index('budget_alerts_type_idx').on(table.type),
    isActiveIdx: index('budget_alerts_is_active_idx').on(table.isActive)
}))

// ============================================================================
// TODO/TASK MODULE
// ============================================================================

export const todos = pgTable('todos', {
    id: uuid('id').primaryKey().defaultRandom(),
    weddingId: uuid('wedding_id').notNull().references(() => weddings.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    status: varchar('status', { length: 20 }).default('todo').notNull(), // todo, in_progress, done
    priority: varchar('priority', { length: 10 }).default('medium').notNull(), // low, medium, high
    dueDate: timestamp('due_date'),
    assignedTo: varchar('assigned_to', { length: 200 }), // partner name or planner name
    assignedToName: varchar('assigned_to_name', { length: 200 }), // alias for assignedTo for compatibility
    assignedToEmail: varchar('assigned_to_email', { length: 255 }),
    completedAt: timestamp('completed_at'),
    completedBy: varchar('completed_by', { length: 200 }),
    estimatedHours: decimal('estimated_hours', { precision: 5, scale: 2 }),
    actualHours: decimal('actual_hours', { precision: 5, scale: 2 }),
    tags: jsonb('tags'), // array of strings
    attachments: jsonb('attachments'), // array of file objects
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (table) => ({
    weddingIdIdx: index('todos_wedding_id_idx').on(table.weddingId),
    statusIdx: index('todos_status_idx').on(table.status),
    priorityIdx: index('todos_priority_idx').on(table.priority),
    dueDateIdx: index('todos_due_date_idx').on(table.dueDate),
    assignedToIdx: index('todos_assigned_to_idx').on(table.assignedTo)
}))

// ============================================================================
// VENDOR MODULE
// ============================================================================

export const vendors = pgTable('vendors', {
    id: uuid('id').primaryKey().defaultRandom(),
    weddingId: uuid('wedding_id').notNull().references(() => weddings.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 200 }).notNull(),
    category: varchar('category', { length: 100 }).notNull(), // photographer, caterer, florist, etc.
    contactInfo: jsonb('contact_info').notNull(), // phone, email, address, website
    status: varchar('status', { length: 20 }).default('contacted').notNull(), // contacted, negotiating, booked, completed
    contractUrl: text('contract_url'),
    contractFileName: varchar('contract_file_name', { length: 255 }),
    rating: integer('rating'), // 1-5 stars
    review: text('review'),
    totalCost: decimal('total_cost', { precision: 12, scale: 2 }),
    depositPaid: decimal('deposit_paid', { precision: 12, scale: 2 }),
    finalPaymentDue: timestamp('final_payment_due'),
    notes: text('notes'),
    communicationHistory: jsonb('communication_history'), // array of communication records
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (table) => ({
    weddingIdIdx: index('vendors_wedding_id_idx').on(table.weddingId),
    categoryIdx: index('vendors_category_idx').on(table.category),
    statusIdx: index('vendors_status_idx').on(table.status),
    ratingIdx: index('vendors_rating_idx').on(table.rating)
}))

// ============================================================================
// SAVINGS MODULE
// ============================================================================

export const savingsGoals = pgTable('savings_goals', {
    id: uuid('id').primaryKey().defaultRandom(),
    weddingId: uuid('wedding_id').notNull().references(() => weddings.id, { onDelete: 'cascade' }),
    targetAmount: decimal('target_amount', { precision: 12, scale: 2 }).notNull(),
    currentAmount: decimal('current_amount', { precision: 12, scale: 2 }).default('0').notNull(),
    targetDate: timestamp('target_date'),
    description: text('description'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (table) => ({
    weddingIdIdx: index('savings_goals_wedding_id_idx').on(table.weddingId)
}))

export const savingsSummaries = pgTable('savings_summaries', {
    id: uuid('id').primaryKey().defaultRandom(),
    weddingId: uuid('wedding_id').notNull().references(() => weddings.id, { onDelete: 'cascade' }),
    totalSaved: decimal('total_saved', { precision: 12, scale: 2 }).default('0').notNull(),
    totalTarget: decimal('total_target', { precision: 12, scale: 2 }).default('0').notNull(),
    goalAmount: decimal('goal_amount', { precision: 12, scale: 2 }).default('0').notNull(), // alias for totalTarget
    currentAmount: decimal('current_amount', { precision: 12, scale: 2 }).default('0').notNull(), // alias for totalSaved
    monthlyAverage: decimal('monthly_average', { precision: 12, scale: 2 }).default('0').notNull(),
    monthlyTarget: decimal('monthly_target', { precision: 12, scale: 2 }).default('0').notNull(),
    lastUpdated: timestamp('last_updated').defaultNow().notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (table) => ({
    weddingIdIdx: uniqueIndex('savings_summaries_wedding_id_idx').on(table.weddingId)
}))

export const savingsEntries = pgTable('savings_entries', {
    id: uuid('id').primaryKey().defaultRandom(),
    weddingId: uuid('wedding_id').notNull().references(() => weddings.id, { onDelete: 'cascade' }),
    goalId: uuid('goal_id').references(() => savingsGoals.id, { onDelete: 'cascade' }),
    savingsId: uuid('savings_id').references(() => savingsSummaries.id, { onDelete: 'cascade' }), // for compatibility
    amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
    type: varchar('type', { length: 20 }).notNull(), // deposit, withdrawal
    description: text('description'),
    date: timestamp('date').defaultNow().notNull(),
    source: varchar('source', { length: 100 }), // salary, gift, bonus, etc.
    createdAt: timestamp('created_at').defaultNow().notNull()
}, (table) => ({
    weddingIdIdx: index('savings_entries_wedding_id_idx').on(table.weddingId),
    goalIdIdx: index('savings_entries_goal_id_idx').on(table.goalId),
    savingsIdIdx: index('savings_entries_savings_id_idx').on(table.savingsId),
    typeIdx: index('savings_entries_type_idx').on(table.type),
    dateIdx: index('savings_entries_date_idx').on(table.date)
}))

// ============================================================================
// DOWRY MODULE
// ============================================================================

export const dowryItems = pgTable('dowry_items', {
    id: uuid('id').primaryKey().defaultRandom(),
    weddingId: uuid('wedding_id').notNull().references(() => weddings.id, { onDelete: 'cascade' }),
    type: varchar('type', { length: 50 }).notNull(), // cash, gold, property, jewelry, other
    description: text('description').notNull(),
    value: decimal('value', { precision: 15, scale: 2 }).notNull(),
    currency: varchar('currency', { length: 3 }).default('USD').notNull(),
    status: varchar('status', { length: 20 }).default('promised').notNull(), // promised, received, documented
    giver: varchar('giver', { length: 200 }), // who is giving the dowry
    receiver: varchar('receiver', { length: 200 }), // who is receiving the dowry
    proofUrl: text('proof_url'), // receipt, certificate, photo
    proofFileName: varchar('proof_file_name', { length: 255 }),
    witnessName: varchar('witness_name', { length: 200 }),
    witnessContact: varchar('witness_contact', { length: 255 }),
    dateReceived: timestamp('date_received'),
    receivedDate: timestamp('received_date'), // alias for dateReceived for compatibility
    notes: text('notes'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (table) => ({
    weddingIdIdx: index('dowry_items_wedding_id_idx').on(table.weddingId),
    typeIdx: index('dowry_items_type_idx').on(table.type),
    statusIdx: index('dowry_items_status_idx').on(table.status)
}))

// ============================================================================
// SOUVENIR MODULE
// ============================================================================

export const souvenirs = pgTable('souvenirs', {
    id: uuid('id').primaryKey().defaultRandom(),
    weddingId: uuid('wedding_id').notNull().references(() => weddings.id, { onDelete: 'cascade' }),
    vendorId: uuid('vendor_id').references(() => vendors.id, { onDelete: 'set null' }),
    name: varchar('name', { length: 200 }).notNull(),
    category: varchar('category', { length: 100 }), // custom, traditional, modern, etc.
    description: text('description'),
    quantity: integer('quantity').notNull(),
    unitCost: decimal('unit_cost', { precision: 10, scale: 2 }).notNull(),
    totalCost: decimal('total_cost', { precision: 12, scale: 2 }).notNull(),
    status: varchar('status', { length: 20 }).default('planned').notNull(), // planned, ordered, received, distributed
    orderDate: timestamp('order_date'),
    expectedDelivery: timestamp('expected_delivery'),
    actualDelivery: timestamp('actual_delivery'),
    distributionPlan: text('distribution_plan'),
    customizationDetails: jsonb('customization_details'),
    qualityNotes: text('quality_notes'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (table) => ({
    weddingIdIdx: index('souvenirs_wedding_id_idx').on(table.weddingId),
    vendorIdIdx: index('souvenirs_vendor_id_idx').on(table.vendorId),
    statusIdx: index('souvenirs_status_idx').on(table.status),
    categoryIdx: index('souvenirs_category_idx').on(table.category)
}))

export const souvenirDistribution = pgTable('souvenir_distribution', {
    id: uuid('id').primaryKey().defaultRandom(),
    souvenirId: uuid('souvenir_id').notNull().references(() => souvenirs.id, { onDelete: 'cascade' }),
    guestId: uuid('guest_id').references(() => guests.id, { onDelete: 'cascade' }),
    guestName: varchar('guest_name', { length: 200 }),
    quantity: integer('quantity').default(1).notNull(),
    distributedAt: timestamp('distributed_at'),
    distributedBy: varchar('distributed_by', { length: 200 }),
    notes: text('notes'),
    createdAt: timestamp('created_at').defaultNow().notNull()
}, (table) => ({
    souvenirIdIdx: index('souvenir_distribution_souvenir_id_idx').on(table.souvenirId),
    guestIdIdx: index('souvenir_distribution_guest_id_idx').on(table.guestId)
}))

// ============================================================================
// DRESSCODE MODULE
// ============================================================================

export const dresscodes = pgTable('dresscodes', {
    id: uuid('id').primaryKey().defaultRandom(),
    weddingId: uuid('wedding_id').notNull().references(() => weddings.id, { onDelete: 'cascade' }),
    eventName: varchar('event_name', { length: 200 }).notNull(), // ceremony, reception, etc.
    description: text('description').notNull(),
    dresscodeType: varchar('dresscode_type', { length: 30 }).notNull(), // formal, semi_formal, casual, traditional, custom
    colorScheme: jsonb('color_scheme'), // array of hex colors
    guestInstructions: text('guest_instructions'),
    inspirationPhotos: jsonb('inspiration_photos'), // array of photo URLs
    culturalRequirements: text('cultural_requirements'),
    seasonalConsiderations: text('seasonal_considerations'),
    isPublic: boolean('is_public').default(true).notNull(), // visible to guests
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (table) => ({
    weddingIdIdx: index('dresscodes_wedding_id_idx').on(table.weddingId),
    eventNameIdx: index('dresscodes_event_name_idx').on(table.eventName),
    typeIdx: index('dresscodes_type_idx').on(table.dresscodeType)
}))

// ============================================================================
// RUNDOWN/TIMELINE MODULE
// ============================================================================

export const rundownEvents = pgTable('rundown_events', {
    id: uuid('id').primaryKey().defaultRandom(),
    weddingId: uuid('wedding_id').notNull().references(() => weddings.id, { onDelete: 'cascade' }),
    eventName: varchar('event_name', { length: 200 }).notNull(),
    eventType: varchar('event_type', { length: 50 }), // ceremony, reception, party, etc.
    startTime: timestamp('start_time').notNull(),
    endTime: timestamp('end_time').notNull(),
    duration: integer('duration'), // duration in minutes
    location: varchar('location', { length: 300 }),
    venue: varchar('venue', { length: 300 }),
    description: text('description'),
    status: varchar('status', { length: 20 }).default('planned').notNull(), // planned, confirmed, in_progress, completed, cancelled
    assignedTo: jsonb('assigned_to'), // array of person names/roles
    requirements: jsonb('requirements'), // array of required items/setup
    vendorIds: jsonb('vendor_ids'), // array of vendor UUIDs
    bufferTime: integer('buffer_time'), // minutes before/after
    isPublic: boolean('is_public').default(false).notNull(), // visible to guests
    sortOrder: integer('sort_order').notNull(),
    notes: text('notes'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (table) => ({
    weddingIdIdx: index('rundown_events_wedding_id_idx').on(table.weddingId),
    startTimeIdx: index('rundown_events_start_time_idx').on(table.startTime),
    sortOrderIdx: index('rundown_events_sort_order_idx').on(table.sortOrder),
    statusIdx: index('rundown_events_status_idx').on(table.status)
}))

// ============================================================================
// INVITATION SYSTEM
// ============================================================================

export const invitations = pgTable('invitations', {
    id: uuid('id').primaryKey().defaultRandom(),
    weddingId: uuid('wedding_id').notNull().references(() => weddings.id, { onDelete: 'cascade' }),
    slug: varchar('slug', { length: 100 }).notNull().unique(),
    template: varchar('template', { length: 50 }).notNull(),
    status: varchar('status', { length: 20 }).default('draft').notNull(), // draft, published, expired
    coupleDetails: jsonb('couple_details').notNull(), // bride, groom, families info
    eventDetails: jsonb('event_details').notNull(), // ceremony, reception details
    customizations: jsonb('customizations'), // colors, fonts, layout options
    rsvpDeadline: timestamp('rsvp_deadline'),
    maxGuests: integer('max_guests'),
    isPublic: boolean('is_public').default(true).notNull(),
    viewCount: integer('view_count').default(0).notNull(),
    publishedAt: timestamp('published_at'),
    expiresAt: timestamp('expires_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (table) => ({
    slugIdx: uniqueIndex('invitations_slug_idx').on(table.slug),
    weddingIdIdx: index('invitations_wedding_id_idx').on(table.weddingId),
    statusIdx: index('invitations_status_idx').on(table.status)
}))

export const guests = pgTable('guests', {
    id: uuid('id').primaryKey().defaultRandom(),
    invitationId: uuid('invitation_id').notNull().references(() => invitations.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 200 }).notNull(),
    phone: varchar('phone', { length: 20 }),
    email: varchar('email', { length: 255 }),
    invitationToken: varchar('invitation_token', { length: 100 }).unique(),
    category: varchar('category', { length: 50 }), // family, friends, colleagues, etc.
    maxPlusOnes: integer('max_plus_ones').default(0).notNull(),
    invitationSentAt: timestamp('invitation_sent_at'),
    lastViewedAt: timestamp('last_viewed_at'),
    notes: text('notes'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (table) => ({
    invitationIdIdx: index('guests_invitation_id_idx').on(table.invitationId),
    tokenIdx: uniqueIndex('guests_token_idx').on(table.invitationToken),
    emailIdx: index('guests_email_idx').on(table.email)
}))

export const rsvps = pgTable('rsvps', {
    id: uuid('id').primaryKey().defaultRandom(),
    guestId: uuid('guest_id').notNull().references(() => guests.id, { onDelete: 'cascade' }),
    status: varchar('status', { length: 20 }).notNull(), // attending, declined
    plusOneCount: integer('plus_one_count').default(0).notNull(),
    plusOneNames: jsonb('plus_one_names'), // array of names
    mealPreferences: jsonb('meal_preferences'), // array of meal choices
    dietaryRestrictions: text('dietary_restrictions'),
    specialRequests: text('special_requests'),
    guestMessage: text('guest_message'),
    submittedAt: timestamp('submitted_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (table) => ({
    guestIdIdx: index('rsvps_guest_id_idx').on(table.guestId),
    statusIdx: index('rsvps_status_idx').on(table.status)
}))

// ============================================================================
// GALLERY MODULE
// ============================================================================

export const galleryItems = pgTable('gallery_items', {
    id: uuid('id').primaryKey().defaultRandom(),
    invitationId: uuid('invitation_id').notNull().references(() => invitations.id, { onDelete: 'cascade' }),
    type: varchar('type', { length: 20 }).notNull(), // photo, video
    url: text('url').notNull(),
    thumbnailUrl: text('thumbnail_url'),
    fileName: varchar('file_name', { length: 255 }),
    fileSize: integer('file_size'),
    mimeType: varchar('mime_type', { length: 100 }),
    caption: text('caption'),
    altText: varchar('alt_text', { length: 255 }),
    sortOrder: integer('sort_order').notNull(),
    isPublic: boolean('is_public').default(true).notNull(),
    uploadedBy: varchar('uploaded_by', { length: 200 }), // couple or guest name
    uploadedByGuestId: uuid('uploaded_by_guest_id').references(() => guests.id, { onDelete: 'set null' }),
    moderationStatus: varchar('moderation_status', { length: 20 }).default('approved').notNull(), // pending, approved, rejected
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (table) => ({
    invitationIdIdx: index('gallery_items_invitation_id_idx').on(table.invitationId),
    typeIdx: index('gallery_items_type_idx').on(table.type),
    sortOrderIdx: index('gallery_items_sort_order_idx').on(table.sortOrder),
    moderationIdx: index('gallery_items_moderation_idx').on(table.moderationStatus)
}))

// ============================================================================
// LOVE STORY MODULE
// ============================================================================

export const loveStoryItems = pgTable('love_story_items', {
    id: uuid('id').primaryKey().defaultRandom(),
    invitationId: uuid('invitation_id').notNull().references(() => invitations.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 200 }).notNull(),
    content: text('content').notNull(),
    date: timestamp('date'),
    mediaUrl: text('media_url'),
    mediaType: varchar('media_type', { length: 20 }), // photo, video
    sortOrder: integer('sort_order').notNull(),
    isPublic: boolean('is_public').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (table) => ({
    invitationIdIdx: index('love_story_items_invitation_id_idx').on(table.invitationId),
    sortOrderIdx: index('love_story_items_sort_order_idx').on(table.sortOrder),
    dateIdx: index('love_story_items_date_idx').on(table.date)
}))

// ============================================================================
// GIFT MODULE
// ============================================================================

export const giftOptions = pgTable('gift_options', {
    id: uuid('id').primaryKey().defaultRandom(),
    invitationId: uuid('invitation_id').notNull().references(() => invitations.id, { onDelete: 'cascade' }),
    type: varchar('type', { length: 30 }).notNull(), // digital_envelope, registry, custom
    title: varchar('title', { length: 200 }).notNull(),
    description: text('description'),
    configuration: jsonb('configuration').notNull(), // bank details, registry URLs, etc.
    isActive: boolean('is_active').default(true).notNull(),
    sortOrder: integer('sort_order').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (table) => ({
    invitationIdIdx: index('gift_options_invitation_id_idx').on(table.invitationId),
    typeIdx: index('gift_options_type_idx').on(table.type),
    isActiveIdx: index('gift_options_is_active_idx').on(table.isActive)
}))

export const giftContributions = pgTable('gift_contributions', {
    id: uuid('id').primaryKey().defaultRandom(),
    giftOptionId: uuid('gift_option_id').notNull().references(() => giftOptions.id, { onDelete: 'cascade' }),
    guestId: uuid('guest_id').references(() => guests.id, { onDelete: 'set null' }),
    contributorName: varchar('contributor_name', { length: 200 }).notNull(),
    contributorEmail: varchar('contributor_email', { length: 255 }),
    contributorPhone: varchar('contributor_phone', { length: 20 }),
    amount: decimal('amount', { precision: 12, scale: 2 }),
    currency: varchar('currency', { length: 3 }).default('USD').notNull(),
    message: text('message'),
    paymentMethod: varchar('payment_method', { length: 50 }),
    paymentReference: varchar('payment_reference', { length: 100 }),
    paymentStatus: varchar('payment_status', { length: 20 }).default('pending').notNull(), // pending, completed, failed
    thankYouSent: boolean('thank_you_sent').default(false).notNull(),
    thankYouSentAt: timestamp('thank_you_sent_at'),
    isAnonymous: boolean('is_anonymous').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (table) => ({
    giftOptionIdIdx: index('gift_contributions_gift_option_id_idx').on(table.giftOptionId),
    guestIdIdx: index('gift_contributions_guest_id_idx').on(table.guestId),
    paymentStatusIdx: index('gift_contributions_payment_status_idx').on(table.paymentStatus),
    thankYouIdx: index('gift_contributions_thank_you_idx').on(table.thankYouSent)
}))

// ============================================================================
// NOTIFICATION SYSTEM
// ============================================================================

export const notifications = pgTable('notifications', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull(), // Supabase auth user ID
    weddingId: uuid('wedding_id').references(() => weddings.id, { onDelete: 'cascade' }),
    type: varchar('type', { length: 50 }).notNull(), // deadline_alert, progress_update, budget_warning, system_notification
    title: varchar('title', { length: 255 }).notNull(),
    message: text('message').notNull(),
    actionUrl: text('action_url'),
    priority: varchar('priority', { length: 10 }).default('medium').notNull(), // low, medium, high, urgent
    isRead: boolean('is_read').default(false).notNull(),
    readAt: timestamp('read_at'),
    emailSent: boolean('email_sent').default(false).notNull(),
    emailSentAt: timestamp('email_sent_at'),
    expiresAt: timestamp('expires_at'),
    metadata: jsonb('metadata'), // additional context data
    createdAt: timestamp('created_at').defaultNow().notNull()
}, (table) => ({
    userIdIdx: index('notifications_user_id_idx').on(table.userId),
    weddingIdIdx: index('notifications_wedding_id_idx').on(table.weddingId),
    typeIdx: index('notifications_type_idx').on(table.type),
    priorityIdx: index('notifications_priority_idx').on(table.priority),
    isReadIdx: index('notifications_is_read_idx').on(table.isRead),
    createdAtIdx: index('notifications_created_at_idx').on(table.createdAt)
}))

// ============================================================================
// RELATIONS
// ============================================================================

export const weddingsRelations = relations(weddings, ({ many }) => ({
    documents: many(documents),
    budgetCategories: many(budgetCategories),
    budgetItems: many(budgetItems),
    budgetAlerts: many(budgetAlerts),
    todos: many(todos),
    vendors: many(vendors),
    savingsGoals: many(savingsGoals),
    savingsSummaries: many(savingsSummaries),
    savingsEntries: many(savingsEntries),
    dowryItems: many(dowryItems),
    souvenirs: many(souvenirs),
    dresscodes: many(dresscodes),
    rundownEvents: many(rundownEvents),
    invitations: many(invitations),
    notifications: many(notifications)
}))

export const documentsRelations = relations(documents, ({ one, many }) => ({
    wedding: one(weddings, {
        fields: [documents.weddingId],
        references: [weddings.id]
    }),
    reminders: many(documentReminders)
}))

export const documentRemindersRelations = relations(documentReminders, ({ one }) => ({
    document: one(documents, {
        fields: [documentReminders.documentId],
        references: [documents.id]
    })
}))

export const budgetCategoriesRelations = relations(budgetCategories, ({ one, many }) => ({
    wedding: one(weddings, {
        fields: [budgetCategories.weddingId],
        references: [weddings.id]
    }),
    budgetItems: many(budgetItems),
    budgetAlerts: many(budgetAlerts)
}))

export const budgetItemsRelations = relations(budgetItems, ({ one }) => ({
    wedding: one(weddings, {
        fields: [budgetItems.weddingId],
        references: [weddings.id]
    }),
    category: one(budgetCategories, {
        fields: [budgetItems.categoryId],
        references: [budgetCategories.id]
    }),
    vendor: one(vendors, {
        fields: [budgetItems.vendorId],
        references: [vendors.id]
    })
}))

export const budgetAlertsRelations = relations(budgetAlerts, ({ one }) => ({
    wedding: one(weddings, {
        fields: [budgetAlerts.weddingId],
        references: [weddings.id]
    }),
    category: one(budgetCategories, {
        fields: [budgetAlerts.categoryId],
        references: [budgetCategories.id]
    })
}))

export const todosRelations = relations(todos, ({ one }) => ({
    wedding: one(weddings, {
        fields: [todos.weddingId],
        references: [weddings.id]
    })
}))

export const vendorsRelations = relations(vendors, ({ one, many }) => ({
    wedding: one(weddings, {
        fields: [vendors.weddingId],
        references: [weddings.id]
    }),
    budgetItems: many(budgetItems),
    souvenirs: many(souvenirs)
}))

export const savingsGoalsRelations = relations(savingsGoals, ({ one, many }) => ({
    wedding: one(weddings, {
        fields: [savingsGoals.weddingId],
        references: [weddings.id]
    }),
    entries: many(savingsEntries)
}))

export const savingsSummariesRelations = relations(savingsSummaries, ({ one, many }) => ({
    wedding: one(weddings, {
        fields: [savingsSummaries.weddingId],
        references: [weddings.id]
    }),
    entries: many(savingsEntries)
}))

export const savingsEntriesRelations = relations(savingsEntries, ({ one }) => ({
    wedding: one(weddings, {
        fields: [savingsEntries.weddingId],
        references: [weddings.id]
    }),
    goal: one(savingsGoals, {
        fields: [savingsEntries.goalId],
        references: [savingsGoals.id]
    }),
    summary: one(savingsSummaries, {
        fields: [savingsEntries.savingsId],
        references: [savingsSummaries.id]
    })
}))

export const dowryItemsRelations = relations(dowryItems, ({ one }) => ({
    wedding: one(weddings, {
        fields: [dowryItems.weddingId],
        references: [weddings.id]
    })
}))

export const souvenirsRelations = relations(souvenirs, ({ one, many }) => ({
    wedding: one(weddings, {
        fields: [souvenirs.weddingId],
        references: [weddings.id]
    }),
    vendor: one(vendors, {
        fields: [souvenirs.vendorId],
        references: [vendors.id]
    }),
    distribution: many(souvenirDistribution)
}))

export const souvenirDistributionRelations = relations(souvenirDistribution, ({ one }) => ({
    souvenir: one(souvenirs, {
        fields: [souvenirDistribution.souvenirId],
        references: [souvenirs.id]
    }),
    guest: one(guests, {
        fields: [souvenirDistribution.guestId],
        references: [guests.id]
    })
}))

export const dresscodesRelations = relations(dresscodes, ({ one }) => ({
    wedding: one(weddings, {
        fields: [dresscodes.weddingId],
        references: [weddings.id]
    })
}))

export const rundownEventsRelations = relations(rundownEvents, ({ one }) => ({
    wedding: one(weddings, {
        fields: [rundownEvents.weddingId],
        references: [weddings.id]
    })
}))

export const invitationsRelations = relations(invitations, ({ one, many }) => ({
    wedding: one(weddings, {
        fields: [invitations.weddingId],
        references: [weddings.id]
    }),
    guests: many(guests),
    galleryItems: many(galleryItems),
    loveStoryItems: many(loveStoryItems),
    giftOptions: many(giftOptions)
}))

export const guestsRelations = relations(guests, ({ one, many }) => ({
    invitation: one(invitations, {
        fields: [guests.invitationId],
        references: [invitations.id]
    }),
    rsvp: many(rsvps),
    souvenirDistribution: many(souvenirDistribution),
    galleryUploads: many(galleryItems),
    giftContributions: many(giftContributions)
}))

export const rsvpsRelations = relations(rsvps, ({ one }) => ({
    guest: one(guests, {
        fields: [rsvps.guestId],
        references: [guests.id]
    })
}))

export const galleryItemsRelations = relations(galleryItems, ({ one }) => ({
    invitation: one(invitations, {
        fields: [galleryItems.invitationId],
        references: [invitations.id]
    }),
    uploadedByGuest: one(guests, {
        fields: [galleryItems.uploadedByGuestId],
        references: [guests.id]
    })
}))

export const loveStoryItemsRelations = relations(loveStoryItems, ({ one }) => ({
    invitation: one(invitations, {
        fields: [loveStoryItems.invitationId],
        references: [invitations.id]
    })
}))

export const giftOptionsRelations = relations(giftOptions, ({ one, many }) => ({
    invitation: one(invitations, {
        fields: [giftOptions.invitationId],
        references: [invitations.id]
    }),
    contributions: many(giftContributions)
}))

export const giftContributionsRelations = relations(giftContributions, ({ one }) => ({
    giftOption: one(giftOptions, {
        fields: [giftContributions.giftOptionId],
        references: [giftOptions.id]
    }),
    guest: one(guests, {
        fields: [giftContributions.guestId],
        references: [guests.id]
    })
}))

export const notificationsRelations = relations(notifications, ({ one }) => ({
    wedding: one(weddings, {
        fields: [notifications.weddingId],
        references: [weddings.id]
    })
}))