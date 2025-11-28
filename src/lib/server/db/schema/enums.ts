// SQLite-compatible enum definitions using TypeScript type unions
// These replace PostgreSQL pgEnum with text columns and inline enum arrays

export const categoryValues = [
	'accommodation',
	'catering',
	'decoration',
	'entertainment',
	'makeup-attire',
	'paperwork',
	'photo-video',
	'venue',
	'miscellaneous',
	'other',
] as const;
export type Category = (typeof categoryValues)[number];

export const taskStatusValues = ['pending', 'on_progress', 'completed'] as const;
export type TaskStatus = (typeof taskStatusValues)[number];

export const taskPriorityValues = ['low', 'medium', 'high'] as const;
export type TaskPriority = (typeof taskPriorityValues)[number];

export const documentCategoryValues = [
	'legal_formal',
	'vendor_finance',
	'guest_ceremony',
	'personal_keepsake',
] as const;
export type DocumentCategory = (typeof documentCategoryValues)[number];

export const documentStatusValues = ['pending', 'approved', 'rejected'] as const;
export type DocumentStatus = (typeof documentStatusValues)[number];

export const expensePaymentStatusValues = ['paid', 'unpaid'] as const;
export type ExpensePaymentStatus = (typeof expensePaymentStatusValues)[number];

export const vendorStatusValues = ['researching', 'contacted', 'quoted', 'booked'] as const;
export type VendorStatus = (typeof vendorStatusValues)[number];

export const vendorRatingValues = ['1', '2', '3', '4', '5'] as const;
export type VendorRating = (typeof vendorRatingValues)[number];

export const rundownTypeValues = [
	'preparation',
	'ceremony',
	'reception',
	'entertainment',
	'logistics',
	'photo-video',
	'paperwork',
	'closing',
	'miscellaneous',
] as const;
export type RundownType = (typeof rundownTypeValues)[number];

export const dowryTypeValues = [
	'cash',
	'gold',
	'jewelry',
	'fashion',
	'beauty',
	'furniture',
	'property',
	'other',
] as const;
export type DowryType = (typeof dowryTypeValues)[number];

export const dowryStatusValues = ['pending', 'delivered', 'received'] as const;
export type DowryStatus = (typeof dowryStatusValues)[number];

export const dowryRecipientValues = ['groom', 'bride'] as const;
export type DowryRecipient = (typeof dowryRecipientValues)[number];

export const dresscodeRoleValues = [
	'groom',
	'bride',
	'groom_family',
	'bride_family',
	'groomsmen',
	'bridesmaids',
	'other',
] as const;
export type DresscodeRole = (typeof dresscodeRoleValues)[number];

export const souvenirStatusValues = ['planned', 'ordered', 'delivered', 'received'] as const;
export type SouvenirStatus = (typeof souvenirStatusValues)[number];

export const invitationStatusValues = ['draft', 'published'] as const;
export type InvitationStatus = (typeof invitationStatusValues)[number];

export const guestCategoryValues = ['family', 'friend', 'colleague'] as const;
export type GuestCategory = (typeof guestCategoryValues)[number];

export const rsvpStatusValues = ['attending', 'declined'] as const;
export type RsvpStatus = (typeof rsvpStatusValues)[number];

export const galleryTypeValues = ['photo', 'video'] as const;
export type GalleryType = (typeof galleryTypeValues)[number];

export const giftTypeValues = ['digital wallet', 'registry'] as const;
export type GiftType = (typeof giftTypeValues)[number];

export const userRoleValues = ['partner', 'planner', 'collaborator'] as const;
export type UserRole = (typeof userRoleValues)[number];
