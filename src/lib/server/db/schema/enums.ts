import { pgEnum } from 'drizzle-orm/pg-core';

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
	'other',
]);

export const taskStatusEnum = pgEnum('task_status', ['pending', 'on_progress', 'completed']);
export const taskPriorityEnum = pgEnum('task_priority', ['low', 'medium', 'high']);

export const documentCategoryEnum = pgEnum('document_category', [
	'legal_formal',
	'vendor_finance',
	'guest_ceremony',
	'personal_keepsake',
	'miscellaneous',
	'other',
]);

export const expensePaymentStatusEnum = pgEnum('expense_payment_status', ['paid', 'unpaid']);

export const vendorStatusEnum = pgEnum('vendor_status', [
	'researching',
	'contacted',
	'quoted',
	'booked',
]);

export const vendorRatingEnum = pgEnum('vendor_rating', ['1', '2', '3', '4', '5']);

export const rundownTypeEnum = pgEnum('rundown_type', [
	'preparation',
	'ceremony',
	'reception',
	'entertainment',
	'logistics',
	'photo-video',
	'paperwork',
	'closing',
	'miscellaneous',
	'other',
]);

export const dowryTypeEnum = pgEnum('dowry_type', [
	'cash',
	'gold',
	'jewelry',
	'fashion',
	'beauty',
	'furniture',
	'property',
	'other',
]);

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

export const giftTypeEnum = pgEnum('gift_type', ['digital wallet', 'registry']);

export const userRoleEnum = pgEnum('user_role', ['owner', 'collaborator']);
