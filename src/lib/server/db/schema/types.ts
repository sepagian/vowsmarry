// TypeScript types generated from Drizzle schema for use with Kysely
// This file provides type-safe database types for Kysely query builder

import type { ColumnType } from "kysely";

// Helper type for generated columns (like timestamps with defaults)
export type Generated<T> =
  T extends ColumnType<infer S, infer I, infer U>
    ? ColumnType<S, I | undefined, U>
    : ColumnType<T, T | undefined, T>;

// Helper type for timestamps stored as integers
export type Timestamp = ColumnType<
  Date,
  Date | string | number,
  Date | string | number
>;

// Enum types - matching enums.ts
export type Category =
  | "accommodation"
  | "catering"
  | "decoration"
  | "entertainment"
  | "makeup-attire"
  | "paperwork"
  | "photo-video"
  | "venue"
  | "miscellaneous"
  | "other";

export type TaskStatus = "pending" | "on_progress" | "completed";
export type TaskPriority = "low" | "medium" | "high";

export type DocumentCategory =
  | "legal_formal"
  | "vendor_finance"
  | "guest_ceremony"
  | "personal_keepsake";

export type DocumentStatus = "pending" | "approved" | "rejected";
export type ExpensePaymentStatus = "paid" | "unpaid";
export type VendorStatus = "researching" | "contacted" | "quoted" | "booked";
export type VendorRating = "1" | "2" | "3" | "4" | "5";

export type RundownType =
  | "preparation"
  | "ceremony"
  | "reception"
  | "entertainment"
  | "logistics"
  | "photo-video"
  | "paperwork"
  | "closing"
  | "miscellaneous";

export type DowryType =
  | "cash"
  | "gold"
  | "jewelry"
  | "fashion"
  | "beauty"
  | "furniture"
  | "property"
  | "other";
export type DowryStatus = "pending" | "delivered" | "received";
export type DowryRecipient = "groom" | "bride";

export type DresscodeRole =
  | "groom"
  | "bride"
  | "groom_family"
  | "bride_family"
  | "groomsmen"
  | "bridesmaids"
  | "other";

export type SouvenirStatus = "planned" | "ordered" | "delivered" | "received";
export type UserRole = "partner" | "planner" | "collaborator";

export type InvitationStatus = "draft" | "published";
export type GuestCategory = "family" | "friend" | "colleague";
export type RsvpStatus = "attending" | "declined";
export type GalleryType = "photo" | "video";
export type GiftType = "digital wallet" | "registry";

// Better Auth Tables

export interface UserAuthTable {
  id: string;
  name: string;
  email: string;
  emailVerified: Generated<number>; // boolean as 0/1
  image: string | null;
  createdAt: Generated<Timestamp>;
  updatedAt: Generated<Timestamp>;
}

export interface SessionTable {
  id: string;
  expiresAt: Timestamp;
  token: string;
  createdAt: Generated<Timestamp>;
  updatedAt: Generated<Timestamp>;
  ipAddress: string | null;
  userAgent: string | null;
  userId: string;
  activeOrganizationId: string | null;
}

export interface OrganizationTable {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  metadata: string | null; // JSON stored as text
  createdAt: Generated<Timestamp>;
  // Wedding-specific fields (migrated from weddings table)
  groomName: string | null;
  brideName: string | null;
  weddingDate: string | null; // ISO date string (YYYY-MM-DD)
  weddingVenue: string | null;
  weddingBudget: string | null; // Stored as text to match Better Auth's type system
}

export interface MemberTable {
  id: string;
  userId: string;
  organizationId: string;
  role: "owner" | "admin" | "member" | null;
  createdAt: Generated<Timestamp>;
}

export interface InvitationAuthTable {
  id: string;
  email: string;
  inviterId: string;
  organizationId: string;
  role: "owner" | "admin" | "member" | null;
  status: "pending" | "accepted" | "rejected" | null;
  createdAt: Generated<Timestamp>;
  updatedAt: Generated<Timestamp>;
}

// Planner Database Tables

export interface WeddingsTable {
  id: Generated<string>;
  userId: string;
  groomName: string | null;
  brideName: string | null;
  weddingDate: string | null; // ISO date string
  weddingVenue: string | null;
  weddingBudget: number | null;
  createdAt: Generated<Timestamp>;
  updatedAt: Generated<Timestamp>;
}

export interface UsersTable {
  id: Generated<string>;
  organizationId: string;
  userName: string | null;
  userEmail: string | null;
  userPhone: string | null;
  userRole: Generated<UserRole | null>;
  userAvatarUrl: string | null;
  createdAt: Generated<Timestamp>;
  updatedAt: Generated<Timestamp>;
}

export interface TasksTable {
  id: Generated<string>;
  organizationId: string;
  taskDescription: string;
  taskCategory: Category;
  taskStatus: Generated<TaskStatus>;
  taskPriority: Generated<TaskPriority>;
  taskDueDate: string; // ISO date string
  completedAt: Timestamp | null;
  assignedTo: string | null;
  createdBy: string;
  createdAt: Generated<Timestamp>;
  updatedAt: Generated<Timestamp>;
}

export interface DocumentsTable {
  id: Generated<string>;
  organizationId: string;
  documentName: string;
  documentCategory: DocumentCategory;
  documentDate: string; // ISO date string
  documentStatus: Generated<DocumentStatus>;
  documentDueDate: string | null; // ISO date string
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  reminderSent: Generated<number>; // boolean as 0/1
  createdAt: Generated<Timestamp>;
  updatedAt: Generated<Timestamp>;
}

export interface ExpenseCategoriesTable {
  id: Generated<string>;
  organizationId: string;
  category: Category | null;
  allocatedAmount: Generated<number>;
  spentAmount: Generated<number>;
  createdAt: Generated<Timestamp>;
  updatedAt: Generated<Timestamp>;
}

export interface ExpenseItemsTable {
  id: Generated<string>;
  organizationId: string;
  expenseDescription: string;
  expenseCategory: Category;
  expenseAmount: Generated<number>;
  expensePaymentStatus: Generated<ExpensePaymentStatus>;
  expenseDueDate: string; // ISO date string
  createdAt: Generated<Timestamp>;
  updatedAt: Generated<Timestamp>;
}

export interface SavingsItemsTable {
  id: Generated<string>;
  organizationId: string;
  savingAmount: number;
  savingDescription: string | null;
  savingDate: Generated<string>; // ISO date string
  createdAt: Generated<Timestamp>;
}

export interface VendorsTable {
  id: Generated<string>;
  organizationId: string;
  vendorName: string;
  vendorCategory: Category;
  vendorInstagram: string | null;
  vendorEmail: string | null;
  vendorPhone: string | null;
  vendorWebsite: string | null;
  vendorStatus: Generated<VendorStatus>;
  vendorRating: VendorRating;
  vendorTotalCost: number | null;
  createdAt: Generated<Timestamp>;
  updatedAt: Generated<Timestamp>;
}

export interface SchedulesTable {
  id: Generated<string>;
  organizationId: string;
  scheduleName: string;
  scheduleCategory: RundownType;
  scheduleDate: string; // ISO date string
  scheduleStartTime: string; // ISO time string
  scheduleEndTime: string; // ISO time string
  scheduleLocation: string;
  scheduleVenue: string;
  scheduleAttendees: string;
  isPublic: Generated<number>; // boolean as 0/1
  createdAt: Generated<Timestamp>;
  updatedAt: Generated<Timestamp>;
}

export interface DowryTable {
  id: Generated<string>;
  organizationId: string;
  dowryDescription: string | null;
  dowryCategory: DowryType;
  dowryPrice: number;
  dowryQuantity: number | null;
  dowryStatus: Generated<DowryStatus | null>;
  dowryDateReceived: Timestamp | null;
  dowryRecipient: DowryRecipient;
  createdAt: Generated<Timestamp>;
  updatedAt: Generated<Timestamp>;
}

export interface SouvenirsTable {
  id: Generated<string>;
  organizationId: string;
  vendorId: string;
  souvenirName: string;
  souvenirQuantity: number;
  souvenirPrice: number;
  souvenirTotalCost: number;
  souvenirStatus: Generated<SouvenirStatus | null>;
  souvenirOrderDate: Timestamp | null;
  createdAt: Generated<Timestamp>;
  updatedAt: Generated<Timestamp>;
}

export interface DresscodesTable {
  id: Generated<string>;
  organizationId: string;
  scheduleId: string;
  dresscodeDescription: string;
  dresscodeRole: DresscodeRole;
  dresscodeImageUrl: string | null;
  createdAt: Generated<Timestamp>;
  updatedAt: Generated<Timestamp>;
}

// Audit Logging Table

export interface AuditLogTable {
  id: Generated<string>;
  organizationId: string;
  userId: string;
  actionType: string;
  resourceType: string;
  resourceId: string | null;
  description: string;
  changes: string | null; // JSON stored as text
  ipAddress: string | null;
  userAgent: string | null;
  status: "success" | "failure";
  errorMessage: string | null;
  createdAt: Generated<Timestamp>;
}

// Rate Limiting Table

export interface RateLimitTable {
  id: Generated<string>;
  key: string;
  count: number;
  resetTime: number;
  createdAt: Generated<Timestamp>;
  updatedAt: Generated<Timestamp>;
}

// Invitation Database Tables

export interface InvitationsTable {
  id: Generated<string>;
  organizationId: string;
  slug: string;
  template: string;
  status: Generated<InvitationStatus | null>;
  coupleDetails: string; // JSON stored as text
  eventDetails: string; // JSON stored as text
  customizations: string; // JSON stored as text
  maxGuestCount: number;
  isPublic: Generated<number>; // boolean as 0/1
  viewCount: Generated<number>;
  publishedAt: Timestamp | null;
  expiredAt: Timestamp | null;
  createdAt: Generated<Timestamp>;
  updatedAt: Generated<Timestamp>;
}

export interface GuestsTable {
  id: Generated<string>;
  invitationId: string;
  name: string;
  phone: string | null;
  email: string | null;
  invitationToken: string | null;
  category: GuestCategory | null;
  createdAt: Generated<Timestamp>;
  updatedAt: Generated<Timestamp>;
}

export interface RsvpsTable {
  id: Generated<string>;
  guestId: string;
  status: RsvpStatus;
  plusOneCount: Generated<number>;
  plusOneNames: string | null; // JSON stored as text
  guestMessage: string | null;
  submittedAt: Generated<Timestamp>;
  isPublic: Generated<number>; // boolean as 0/1
  createdAt: Generated<Timestamp>;
  updatedAt: Generated<Timestamp>;
}

export interface GalleryTable {
  id: Generated<string>;
  invitationId: string;
  type: GalleryType;
  url: string;
  description: string | null;
  fileName: string;
  fileSize: number;
  mimeType: string;
  caption: string | null;
  sortOrder: number;
  isPublic: Generated<number>; // boolean as 0/1
  uploadedBy: string;
  createdAt: Generated<Timestamp>;
  updatedAt: Generated<Timestamp>;
}

export interface LoveStoryTable {
  id: Generated<string>;
  invitationId: string;
  title: string;
  content: string;
  date: string | null; // ISO date string
  mediaUrl: string | null;
  mediaType: string | null;
  sortOrder: number;
  isPublic: Generated<number>; // boolean as 0/1
  createdAt: Generated<Timestamp>;
  updatedAt: Generated<Timestamp>;
}

export interface GiftsTable {
  id: Generated<string>;
  invitationId: string;
  type: GiftType;
  title: string;
  description: string | null;
  bankAccount: string | null;
  bankNumber: number | null;
  registryUrl: string | null;
  isActive: Generated<number>; // boolean as 0/1
  isPublic: Generated<number>; // boolean as 0/1
  sortOrder: number;
  createdAt: Generated<Timestamp>;
  updatedAt: Generated<Timestamp>;
}

// Database interface combining all tables
export interface Database {
  // Better Auth tables
  user: UserAuthTable;
  session: SessionTable;
  organization: OrganizationTable;
  member: MemberTable;
  invitation_auth: InvitationAuthTable;
  // Planner tables
  weddings: WeddingsTable;
  users: UsersTable;
  tasks: TasksTable;
  documents: DocumentsTable;
  expense_categories: ExpenseCategoriesTable;
  expense_items: ExpenseItemsTable;
  savings_items: SavingsItemsTable;
  vendors: VendorsTable;
  schedules: SchedulesTable;
  dowry: DowryTable;
  souvenirs: SouvenirsTable;
  dresscodes: DresscodesTable;
  // Audit logging table
  audit_log: AuditLogTable;
  // Rate limiting table
  rate_limit: RateLimitTable;
  // Invitation tables
  invitations: InvitationsTable;
  guests: GuestsTable;
  rsvps: RsvpsTable;
  gallery: GalleryTable;
  love_story: LoveStoryTable;
  gifts: GiftsTable;
}
