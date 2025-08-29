import { z } from 'zod';

// Base schemas for common types
export const uuidSchema = z.string().uuid();
export const emailSchema = z.string().email('Please enter a valid email address');
export const phoneSchema = z.string().regex(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number').optional();
export const urlSchema = z.string().url('Please enter a valid URL').optional();
export const currencySchema = z.string().regex(/^\d+(\.\d{1,2})?$/, 'Please enter a valid amount');
export const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Please enter a valid date (YYYY-MM-DD)');
export const timeSchema = z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time (HH:MM)');

// Contact info schema (reused across multiple models)
export const contactInfoSchema = z.object({
	phone: phoneSchema,
	email: emailSchema.optional(),
	address: z.string().min(1, 'Address is required').optional(),
	website: urlSchema
}).optional();

// Auth schemas
export const registerSchema = z.object({
	email: emailSchema,
	password: z.string()
		.min(8, 'Password must be at least 8 characters')
		.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
	confirmPassword: z.string(),
	firstName: z.string().min(1, 'First name is required').max(50, 'First name must be less than 50 characters'),
	lastName: z.string().min(1, 'Last name is required').max(50, 'Last name must be less than 50 characters')
}).refine((data) => data.password === data.confirmPassword, {
	message: "Passwords don't match",
	path: ["confirmPassword"]
});

export const loginSchema = z.object({
	email: emailSchema,
	password: z.string().min(1, 'Password is required')
});

export const passwordResetSchema = z.object({
	email: emailSchema
});

export const newPasswordSchema = z.object({
	password: z.string()
		.min(8, 'Password must be at least 8 characters')
		.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
	confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
	message: "Passwords don't match",
	path: ["confirmPassword"]
});

// Wedding schema
export const weddingSchema = z.object({
	partnerName: z.string().min(1, 'Partner name is required').max(100, 'Partner name must be less than 100 characters').optional(),
	weddingDate: dateSchema.optional(),
	venue: z.string().min(1, 'Venue is required').max(200, 'Venue must be less than 200 characters').optional(),
	budget: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Please enter a valid budget amount').optional(),
	status: z.enum(['planning', 'active', 'completed']).default('planning')
});

// Document schemas
export const documentSchema = z.object({
	title: z.string().min(1, 'Document title is required').max(200, 'Title must be less than 200 characters'),
	type: z.enum(['permit', 'license', 'contract', 'other']),
	status: z.enum(['pending', 'approved', 'rejected']).default('pending'),
	dueDate: dateSchema.optional(),
	notes: z.string().max(1000, 'Notes must be less than 1000 characters').optional()
});

export const documentUpdateSchema = documentSchema.partial();

// Budget schemas
export const budgetItemSchema = z.object({
	category: z.string().min(1, 'Category is required').max(100, 'Category must be less than 100 characters'),
	description: z.string().min(1, 'Description is required').max(200, 'Description must be less than 200 characters'),
	plannedAmount: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Please enter a valid planned amount'),
	actualAmount: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Please enter a valid actual amount').optional(),
	vendorId: uuidSchema.optional(),
	dueDate: dateSchema.optional(),
	status: z.enum(['planned', 'paid', 'overdue']).default('planned'),
	paymentMethod: z.string().max(50, 'Payment method must be less than 50 characters').optional(),
	notes: z.string().max(500, 'Notes must be less than 500 characters').optional()
});

export const budgetItemUpdateSchema = budgetItemSchema.partial();

// Todo schemas
export const todoSchema = z.object({
	title: z.string().min(1, 'Task title is required').max(200, 'Title must be less than 200 characters'),
	description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
	status: z.enum(['todo', 'in_progress', 'done']).default('todo'),
	priority: z.enum(['low', 'medium', 'high']).default('medium'),
	dueDate: dateSchema.optional(),
	assignedTo: z.string().max(100, 'Assignee name must be less than 100 characters').optional(),
	assignedToName: z.string().max(100, 'Assignee name must be less than 100 characters').optional(),
	estimatedHours: z.number().min(0, 'Estimated hours must be positive').max(1000, 'Estimated hours must be less than 1000').optional(),
	actualHours: z.number().min(0, 'Actual hours must be positive').max(1000, 'Actual hours must be less than 1000').optional(),
	tags: z.array(z.string().max(50, 'Tag must be less than 50 characters')).optional()
});

export const todoUpdateSchema = todoSchema.partial();

// Vendor schemas
export const vendorSchema = z.object({
	name: z.string().min(1, 'Vendor name is required').max(200, 'Name must be less than 200 characters'),
	category: z.string().min(1, 'Category is required').max(100, 'Category must be less than 100 characters'),
	contactInfo: contactInfoSchema,
	status: z.enum(['contacted', 'negotiating', 'booked', 'completed']).default('contacted'),
	rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5').optional(),
	review: z.string().max(1000, 'Review must be less than 1000 characters').optional(),
	totalCost: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Please enter a valid total cost').optional(),
	depositPaid: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Please enter a valid deposit amount').optional(),
	finalPaymentDue: dateSchema.optional(),
	services: z.array(z.string().max(100, 'Service must be less than 100 characters')).optional(),
	notes: z.string().max(1000, 'Notes must be less than 1000 characters').optional(),
	tags: z.array(z.string().max(50, 'Tag must be less than 50 characters')).optional()
});

export const vendorUpdateSchema = vendorSchema.partial();

// Dresscode schemas
const attireDetailsSchema = z.object({
	clothing: z.array(z.string().max(100, 'Clothing item must be less than 100 characters')),
	colors: z.array(z.string().max(50, 'Color must be less than 50 characters')),
	fabrics: z.array(z.string().max(50, 'Fabric must be less than 50 characters')).optional(),
	accessories: z.array(z.string().max(100, 'Accessory must be less than 100 characters')).optional(),
	footwear: z.array(z.string().max(100, 'Footwear must be less than 100 characters')).optional(),
	restrictions: z.array(z.string().max(200, 'Restriction must be less than 200 characters')).optional()
}).optional();

export const dresscodeSchema = z.object({
	eventName: z.string().min(1, 'Event name is required').max(200, 'Event name must be less than 200 characters'),
	description: z.string().min(1, 'Description is required').max(1000, 'Description must be less than 1000 characters'),
	colorScheme: z.array(z.string().max(50, 'Color must be less than 50 characters')).optional(),
	dresscodeType: z.enum(['formal', 'semi_formal', 'casual', 'traditional', 'custom']),
	guestInstructions: z.string().max(1000, 'Guest instructions must be less than 1000 characters').optional(),
	maleAttire: attireDetailsSchema,
	femaleAttire: attireDetailsSchema,
	childrenAttire: attireDetailsSchema,
	weatherConsiderations: z.string().max(500, 'Weather considerations must be less than 500 characters').optional(),
	culturalRequirements: z.string().max(500, 'Cultural requirements must be less than 500 characters').optional(),
	accessoryGuidelines: z.string().max(500, 'Accessory guidelines must be less than 500 characters').optional(),
	isPublic: z.boolean().default(false)
});

export const dresscodeUpdateSchema = dresscodeSchema.partial();

// Savings schemas
export const savingsSummarySchema = z.object({
	goalAmount: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Please enter a valid goal amount'),
	targetDate: dateSchema.optional(),
	monthlyTarget: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Please enter a valid monthly target').optional(),
	autoSaveAmount: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Please enter a valid auto-save amount').optional(),
	autoSaveFrequency: z.enum(['weekly', 'monthly', 'biweekly']).optional(),
	bankAccountId: z.string().max(50, 'Bank account ID must be less than 50 characters').optional(),
	interestRate: z.string().regex(/^\d+(\.\d{1,4})?$/, 'Please enter a valid interest rate').optional()
});

export const savingsEntrySchema = z.object({
	amount: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Please enter a valid amount'),
	type: z.enum(['deposit', 'withdrawal', 'interest', 'transfer']),
	source: z.string().max(100, 'Source must be less than 100 characters').optional(),
	description: z.string().max(500, 'Description must be less than 500 characters').optional(),
	date: dateSchema,
	bankTransactionId: z.string().max(100, 'Transaction ID must be less than 100 characters').optional()
});

// Dowry schemas
export const dowryItemSchema = z.object({
	type: z.enum(['cash', 'gold', 'property', 'jewelry', 'vehicle', 'electronics', 'furniture', 'other']),
	subType: z.string().max(100, 'Sub-type must be less than 100 characters').optional(),
	description: z.string().min(1, 'Description is required').max(500, 'Description must be less than 500 characters'),
	value: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Please enter a valid value'),
	currency: z.string().min(3, 'Currency must be at least 3 characters').max(3, 'Currency must be exactly 3 characters').default('IDR'),
	status: z.enum(['promised', 'received', 'documented', 'verified']).default('promised'),
	giver: z.string().min(1, 'Giver name is required').max(200, 'Giver name must be less than 200 characters'),
	giverRelation: z.string().max(100, 'Giver relation must be less than 100 characters').optional(),
	receiver: z.string().min(1, 'Receiver name is required').max(200, 'Receiver name must be less than 200 characters'),
	receiverRelation: z.string().max(100, 'Receiver relation must be less than 100 characters').optional(),
	witnessNames: z.array(z.string().max(200, 'Witness name must be less than 200 characters')).optional(),
	religiousRequirement: z.boolean().default(false),
	legalRequirement: z.boolean().default(false),
	customaryRequirement: z.boolean().default(false),
	location: z.string().max(200, 'Location must be less than 200 characters').optional(),
	receivedDate: dateSchema.optional(),
	documentedDate: dateSchema.optional(),
	notes: z.string().max(1000, 'Notes must be less than 1000 characters').optional(),
	tags: z.array(z.string().max(50, 'Tag must be less than 50 characters')).optional()
});

export const dowryItemUpdateSchema = dowryItemSchema.partial();

// Souvenir schemas
const packagingDetailsSchema = z.object({
	type: z.string().min(1, 'Packaging type is required').max(100, 'Packaging type must be less than 100 characters'),
	color: z.string().max(50, 'Color must be less than 50 characters').optional(),
	material: z.string().max(100, 'Material must be less than 100 characters').optional(),
	customLabel: z.boolean().optional(),
	labelText: z.string().max(200, 'Label text must be less than 200 characters').optional(),
	ribbonColor: z.string().max(50, 'Ribbon color must be less than 50 characters').optional(),
	specialInstructions: z.string().max(500, 'Special instructions must be less than 500 characters').optional()
}).optional();

const customizationDetailsSchema = z.object({
	personalized: z.boolean(),
	coupleNames: z.boolean().optional(),
	weddingDate: z.boolean().optional(),
	customMessage: z.string().max(200, 'Custom message must be less than 200 characters').optional(),
	logoUrl: urlSchema,
	fontStyle: z.string().max(50, 'Font style must be less than 50 characters').optional(),
	colorScheme: z.array(z.string().max(50, 'Color must be less than 50 characters')).optional()
}).optional();

export const souvenirSchema = z.object({
	name: z.string().min(1, 'Souvenir name is required').max(200, 'Name must be less than 200 characters'),
	description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
	category: z.enum(['edible', 'decorative', 'practical', 'religious', 'custom']),
	vendorId: uuidSchema.optional(),
	vendorName: z.string().max(200, 'Vendor name must be less than 200 characters').optional(),
	quantity: z.number().min(1, 'Quantity must be at least 1').max(10000, 'Quantity must be less than 10,000'),
	unitCost: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Please enter a valid unit cost'),
	status: z.enum(['planned', 'ordered', 'received', 'distributed']).default('planned'),
	orderDate: dateSchema.optional(),
	expectedDelivery: dateSchema.optional(),
	actualDelivery: dateSchema.optional(),
	distributionPlan: z.string().max(1000, 'Distribution plan must be less than 1000 characters').optional(),
	distributionDate: dateSchema.optional(),
	packaging: packagingDetailsSchema,
	customization: customizationDetailsSchema,
	qualityCheck: z.boolean().default(false),
	qualityNotes: z.string().max(500, 'Quality notes must be less than 500 characters').optional(),
	storageLocation: z.string().max(200, 'Storage location must be less than 200 characters').optional(),
	expiryDate: dateSchema.optional(),
	tags: z.array(z.string().max(50, 'Tag must be less than 50 characters')).optional()
});

export const souvenirUpdateSchema = souvenirSchema.partial();

// Rundown schemas
const assignedRoleSchema = z.object({
	personName: z.string().min(1, 'Person name is required').max(200, 'Person name must be less than 200 characters'),
	role: z.string().min(1, 'Role is required').max(100, 'Role must be less than 100 characters'),
	contactInfo: contactInfoSchema,
	responsibilities: z.array(z.string().max(200, 'Responsibility must be less than 200 characters')),
	arrivalTime: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, 'Please enter a valid arrival time').optional(),
	briefingRequired: z.boolean().optional()
});

export const rundownEventSchema = z.object({
	eventName: z.string().min(1, 'Event name is required').max(200, 'Event name must be less than 200 characters'),
	eventType: z.enum(['ceremony', 'reception', 'preparation', 'photography', 'transportation', 'other']),
	startTime: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, 'Please enter a valid start time'),
	endTime: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, 'Please enter a valid end time'),
	location: z.string().max(200, 'Location must be less than 200 characters').optional(),
	venue: z.string().max(200, 'Venue must be less than 200 characters').optional(),
	description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
	assignedTo: z.array(z.string().max(200, 'Assignee must be less than 200 characters')).optional(),
	assignedRoles: z.array(assignedRoleSchema).optional(),
	requirements: z.array(z.string().max(200, 'Requirement must be less than 200 characters')).optional(),
	equipment: z.array(z.string().max(200, 'Equipment must be less than 200 characters')).optional(),
	vendors: z.array(z.string().max(200, 'Vendor must be less than 200 characters')).optional(),
	guestCount: z.number().min(0, 'Guest count must be positive').max(10000, 'Guest count must be less than 10,000').optional(),
	dresscode: z.string().max(200, 'Dresscode must be less than 200 characters').optional(),
	musicPlaylist: z.string().max(200, 'Music playlist must be less than 200 characters').optional(),
	specialInstructions: z.string().max(1000, 'Special instructions must be less than 1000 characters').optional(),
	backupPlan: z.string().max(1000, 'Backup plan must be less than 1000 characters').optional(),
	status: z.enum(['planned', 'confirmed', 'in_progress', 'completed', 'cancelled']).default('planned'),
	priority: z.enum(['low', 'medium', 'high']).default('medium'),
	dependencies: z.array(z.string().max(200, 'Dependency must be less than 200 characters')).optional(),
	bufferTime: z.number().min(0, 'Buffer time must be positive').max(480, 'Buffer time must be less than 8 hours').optional(),
	notes: z.string().max(1000, 'Notes must be less than 1000 characters').optional()
}).refine((data) => {
	const start = new Date(data.startTime);
	const end = new Date(data.endTime);
	return start < end;
}, {
	message: "End time must be after start time",
	path: ["endTime"]
});

export const rundownEventUpdateSchema = rundownEventSchema.partial();

// Invitation schemas
const coupleDetailsSchema = z.object({
	brideName: z.string().min(1, 'Bride name is required').max(200, 'Bride name must be less than 200 characters'),
	groomName: z.string().min(1, 'Groom name is required').max(200, 'Groom name must be less than 200 characters'),
	brideParents: z.string().max(200, 'Bride parents must be less than 200 characters').optional(),
	groomParents: z.string().max(200, 'Groom parents must be less than 200 characters').optional(),
	brideFamily: z.string().max(200, 'Bride family must be less than 200 characters').optional(),
	groomFamily: z.string().max(200, 'Groom family must be less than 200 characters').optional()
});

const eventDetailsSchema = z.object({
	ceremonyDate: dateSchema.optional(),
	ceremonyTime: timeSchema.optional(),
	ceremonyVenue: z.string().max(200, 'Ceremony venue must be less than 200 characters').optional(),
	ceremonyAddress: z.string().max(500, 'Ceremony address must be less than 500 characters').optional(),
	receptionDate: dateSchema.optional(),
	receptionTime: timeSchema.optional(),
	receptionVenue: z.string().max(200, 'Reception venue must be less than 200 characters').optional(),
	receptionAddress: z.string().max(500, 'Reception address must be less than 500 characters').optional(),
	dresscode: z.string().max(200, 'Dresscode must be less than 200 characters').optional(),
	specialInstructions: z.string().max(1000, 'Special instructions must be less than 1000 characters').optional()
});

export const invitationSchema = z.object({
	slug: z.string()
		.min(3, 'Slug must be at least 3 characters')
		.max(50, 'Slug must be less than 50 characters')
		.regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
	template: z.string().min(1, 'Template is required').max(100, 'Template must be less than 100 characters'),
	coupleDetails: coupleDetailsSchema,
	eventDetails: eventDetailsSchema,
	status: z.enum(['draft', 'published', 'expired']).default('draft'),
	expiresAt: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, 'Please enter a valid expiry date').optional()
});

export const invitationUpdateSchema = invitationSchema.partial();

// Guest schemas
export const guestSchema = z.object({
	name: z.string().min(1, 'Guest name is required').max(200, 'Name must be less than 200 characters'),
	phone: phoneSchema,
	email: emailSchema.optional()
});

export const guestUpdateSchema = guestSchema.partial();

// RSVP schemas
export const rsvpSchema = z.object({
	status: z.enum(['attending', 'declined']),
	plusOneCount: z.number().min(0, 'Plus one count must be positive').max(10, 'Plus one count must be less than 10').default(0),
	mealPreferences: z.array(z.string().max(100, 'Meal preference must be less than 100 characters')).optional(),
	specialRequests: z.string().max(1000, 'Special requests must be less than 1000 characters').optional()
});

// Gallery schemas
export const galleryItemSchema = z.object({
	caption: z.string().max(500, 'Caption must be less than 500 characters').optional(),
	sortOrder: z.number().min(0, 'Sort order must be positive').default(0)
});

// Love Story schemas
export const loveStoryItemSchema = z.object({
	title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
	content: z.string().min(1, 'Content is required').max(5000, 'Content must be less than 5000 characters'),
	date: dateSchema.optional(),
	mediaType: z.enum(['photo', 'video']).optional(),
	sortOrder: z.number().min(0, 'Sort order must be positive').default(0)
});

export const loveStoryItemUpdateSchema = loveStoryItemSchema.partial();

// Gift schemas
const bankInfoSchema = z.object({
	bankName: z.string().min(1, 'Bank name is required').max(100, 'Bank name must be less than 100 characters'),
	accountName: z.string().min(1, 'Account name is required').max(200, 'Account name must be less than 200 characters'),
	accountNumber: z.string().min(1, 'Account number is required').max(50, 'Account number must be less than 50 characters'),
	qrCode: z.string().max(500, 'QR code must be less than 500 characters').optional()
});

const registryInfoSchema = z.object({
	platform: z.string().min(1, 'Platform is required').max(100, 'Platform must be less than 100 characters'),
	registryUrl: urlSchema.refine((url) => url !== undefined, { message: 'Registry URL is required' }),
	registryId: z.string().max(100, 'Registry ID must be less than 100 characters').optional()
});

export const giftOptionSchema = z.object({
	type: z.enum(['digital_envelope', 'registry', 'cash']),
	title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
	description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
	bankInfo: bankInfoSchema.optional(),
	registryInfo: registryInfoSchema.optional(),
	isActive: z.boolean().default(true),
	sortOrder: z.number().min(0, 'Sort order must be positive').default(0)
}).refine((data) => {
	if (data.type === 'digital_envelope' && !data.bankInfo) {
		return false;
	}
	if (data.type === 'registry' && !data.registryInfo) {
		return false;
	}
	return true;
}, {
	message: "Bank info is required for digital envelope, registry info is required for registry",
	path: ["bankInfo"]
});

export const giftContributionSchema = z.object({
	contributorName: z.string().min(1, 'Contributor name is required').max(200, 'Name must be less than 200 characters'),
	amount: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Please enter a valid amount').optional(),
	message: z.string().max(1000, 'Message must be less than 1000 characters').optional(),
	paymentReference: z.string().max(200, 'Payment reference must be less than 200 characters').optional()
});

// File upload schema
export const fileUploadSchema = z.object({
	file: z.instanceof(File, { message: 'Please select a file' }),
	maxSize: z.number().default(10 * 1024 * 1024), // 10MB default
	allowedTypes: z.array(z.string()).default(['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])
}).refine((data) => {
	return data.file.size <= data.maxSize;
}, {
	message: "File size must be less than 10MB",
	path: ["file"]
}).refine((data) => {
	return data.allowedTypes.includes(data.file.type);
}, {
	message: "File type not allowed",
	path: ["file"]
});

// Export all schemas for easy access
export const schemas = {
	// Auth
	register: registerSchema,
	login: loginSchema,
	passwordReset: passwordResetSchema,
	newPassword: newPasswordSchema,
	
	// Core
	wedding: weddingSchema,
	
	// Modules
	document: documentSchema,
	documentUpdate: documentUpdateSchema,
	budgetItem: budgetItemSchema,
	budgetItemUpdate: budgetItemUpdateSchema,
	todo: todoSchema,
	todoUpdate: todoUpdateSchema,
	vendor: vendorSchema,
	vendorUpdate: vendorUpdateSchema,
	dresscode: dresscodeSchema,
	dresscodeUpdate: dresscodeUpdateSchema,
	savingsSummary: savingsSummarySchema,
	savingsEntry: savingsEntrySchema,
	dowryItem: dowryItemSchema,
	dowryItemUpdate: dowryItemUpdateSchema,
	souvenir: souvenirSchema,
	souvenirUpdate: souvenirUpdateSchema,
	rundownEvent: rundownEventSchema,
	rundownEventUpdate: rundownEventUpdateSchema,
	
	// Invitation system
	invitation: invitationSchema,
	invitationUpdate: invitationUpdateSchema,
	guest: guestSchema,
	guestUpdate: guestUpdateSchema,
	rsvp: rsvpSchema,
	galleryItem: galleryItemSchema,
	loveStoryItem: loveStoryItemSchema,
	loveStoryItemUpdate: loveStoryItemUpdateSchema,
	giftOption: giftOptionSchema,
	giftContribution: giftContributionSchema,
	
	// File upload
	fileUpload: fileUploadSchema
};

// Type exports for TypeScript
export type RegisterData = z.infer<typeof registerSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type WeddingData = z.infer<typeof weddingSchema>;
export type DocumentData = z.infer<typeof documentSchema>;
export type BudgetItemData = z.infer<typeof budgetItemSchema>;
export type TodoData = z.infer<typeof todoSchema>;
export type VendorData = z.infer<typeof vendorSchema>;
export type DresscodeData = z.infer<typeof dresscodeSchema>;
export type SavingsSummaryData = z.infer<typeof savingsSummarySchema>;
export type SavingsEntryData = z.infer<typeof savingsEntrySchema>;
export type DowryItemData = z.infer<typeof dowryItemSchema>;
export type SouvenirData = z.infer<typeof souvenirSchema>;
export type RundownEventData = z.infer<typeof rundownEventSchema>;
export type InvitationData = z.infer<typeof invitationSchema>;
export type GuestData = z.infer<typeof guestSchema>;
export type RSVPData = z.infer<typeof rsvpSchema>;
export type GalleryItemData = z.infer<typeof galleryItemSchema>;
export type LoveStoryItemData = z.infer<typeof loveStoryItemSchema>;
export type GiftOptionData = z.infer<typeof giftOptionSchema>;
export type GiftContributionData = z.infer<typeof giftContributionSchema>;
export type FileUploadData = z.infer<typeof fileUploadSchema>;