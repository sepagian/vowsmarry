# 🧩 VowsMarry Development Task List

## 1. Migrate Database Schema

- [x] **1.1.** Migrate `db/schema.ts` to new repo
- [x] **1.2.** Update `validation/index.ts` with new schema
- [x] **1.3.** Update RLS (Row-Level Security) policies
- [x] **1.4.** Refine schema: Add `weddings` table for wedding grouping, `expenses` table linked to budgets for detailed tracking

---

## 2. Push `db/schema` to Database

- [x] Run migration commands via Supabase CLI or Prisma Migrate
- [x] Verify schema structure and relationships
- [x] Test database integrity before production deployment

---

## 3. Complete Full CRUD Logic and Error Handling for Each Module

- [x] **Finance Module**: ✅ Fully implemented with expense tracking, categories, and budget calculations
- [x] **Task Module**: ✅ Fully implemented with status management and priority tracking
- [x] **Vendor Module**: ✅ Fully implemented with status management and contact tracking
- [x] **Schedules Module (Rundown)**: ✅ Fully implemented with timeline management
- [x] **Document Module**: ✅ Full CRUD operations with R2 file upload/delete/replace functionality

### 3.1 Remaining CRUD Implementation Tasks

- [ ] **Error Handling & UX Polish**
  - [ ] Add comprehensive error handling for all database operations
  - [ ] Implement proper form response handling with loading states
  - [ ] Add success/error toasts for all CRUD operations
  - [ ] Ensure optimistic updates and cache invalidation work properly

---

## 4. Create Cloudflare R2 File Upload Config

- [x] Configure R2 bucket and access keys ✅ R2 client configured
- [x] Implement file upload utilities with validation ✅ Complete file-utils.ts with upload/delete/replace
- [x] Add upload API endpoint ✅ `/api/upload` endpoint implemented
- [x] Implement document file upload with R2 integration ✅ Full implementation in document module
- [x] Set up CORS policies for frontend upload
- [ ] Test avatar upload functionality
- [ ] Test wedding media gallery upload

---

## 5. Update Auth / Reset-Password Mechanism

- [x] Refactor `/auth/reset-password` route ✅ Fully implemented
- [x] Implement token verification and expiration handling ✅ Complete with OTP verification
- [x] Add comprehensive error handling ✅ Handles expired/invalid tokens
- [x] Improve user feedback and redirect flow ✅ Redirects to login after success

---

## 6. Build `account/+page.svelte`

- [ ] **6.1.** Design and layout page using shadcn-svelte components ❌ Page exists but is empty
- [ ] **6.2.** Fetch and display user data from Supabase session
- [ ] **6.3.** Implement editable profile form (name, email, etc.)
- [ ] **6.4.** Add avatar upload using Cloudflare R2
- [ ] **6.5.** Implement password update/reset UI
- [ ] **6.6.** Connect all forms to backend and add UX polish

---

## 7. Build Wedding Setup/Onboarding Flow

- [ ] Create onboarding page for initializing couple & wedding data ❌ No dedicated setup route
- [ ] Add form for partner names, date, location
- [ ] Save data into `wedding` schema
- [ ] Redirect to dashboard after successful setup
- [x] **Note**: Wedding dialog exists in dashboard for creating/editing wedding data

---

## 8. Wedding Alert Component

- [x] Display alert if `!wedding.data` ✅ Implemented as `wedding-alert.svelte`
- [x] Include CTA button to open wedding dialog ✅ Opens DialogWedding component
- [x] Style with shadcn Card component ✅ Blue alert card with proper styling
- [x] Integrate visibility check into dashboard ✅ Shown on main dashboard page

---

## 9. Connect Frontend with Backend

- [x] **9.1.** Define API endpoints for all main modules ✅ All modules have +page.server.ts
- [x] **9.2.** Hook up Supabase client (`locals.supabase`) for CRUD ops ✅ All modules use locals.supabase
- [x] **9.3.** Replace mock/static data with live queries ✅ All modules query real database
- [x] **9.4.** Use Valibot validation between frontend and backend ✅ All forms use valibot schemas
- [ ] **9.5.** Add error handling and toasts for failed requests
- [ ] **9.6.** Test full user flow: login → setup → dashboard → account

---

## 10. Build Missing Module UIs

- [x] **10.1.** Document module with file upload UI ✅ Implemented with R2 integration
- [x] **10.2.** Schedules module with timeline ✅ Fully implemented
- [ ] **10.3.** Savings tracking module ❌ Schema exists (`savingsItems` table) but no UI route
- [ ] **10.4.** Dowry tracking module ❌ Schema exists (`dowry` table) but no UI route
- [ ] **10.5.** Souvenirs module ❌ Schema exists (`souvenirs` table) but no UI route
- [ ] **10.6.** Dresscodes module ❌ Schema exists (`dresscodes` table) but no UI route

---

## 11. Validation, Testing & User Flow

- [x] Use Valibot schemas between frontend and backend ✅ All modules use valibot
- [ ] Add unit and integration tests for critical user flows (using Vitest framework)
- [ ] Run lint and typecheck commands post-changes
- [ ] Ensure wedding setup redirects properly and handle multi-user collaboration

---

## 12. Build Souvenirs Module

- [ ] Create `/dashboard/souvenirs` route ❌ Route doesn't exist
- [ ] Design and implement UI for souvenir planning (type, quantity, cost)
- [ ] Add tracking for distribution to guests
- [ ] Link souvenirs to vendors for coordination
- [x] **Note**: Schema is ready with `souvenirs` table linked to `vendors` and `weddings`

---

## 13. Add Data Export Features

- [ ] Implement PDF export for budgets and rundowns ❌ Not implemented
- [ ] Add CSV export for vendor lists and expenses
- [ ] Ensure exports are downloadable from dashboard

---

## 14. Implement Wedding Collaboration

- [ ] Add shared wedding access via invites or links ❌ Not implemented
- [ ] Implement role-based permissions (e.g., partner vs. planner)
- [ ] Sync changes in real-time for collaborators
- [x] **Note**: Schema has `users` table with `userRole` enum and `invitations` table

---

## 15. Enhance Rundown with Drag-and-Drop

- [x] Implement schedules CRUD operations ✅ Fully implemented
- [ ] Integrate DND library for event reordering
- [ ] Update timeline visualization dynamically
- [ ] Save reordered events to database

---

## 16. Add Reminders/Notifications

- [ ] Set up email/SMS alerts for due dates ❌ Not implemented
- [ ] Integrate with Supabase cron for scheduling
- [ ] Allow users to configure notification preferences
- [x] **Note**: Schema has `reminderSent` field in `documents` table

---

## 17. Polish Onboarding Flow

- [ ] Create guided setup with progress indicators
- [ ] Add tooltips and help text for forms
- [ ] Test and refine user flow from registration to dashboard

---

## 18. Build Additional Module Routes

- [ ] **18.1.** Create `/dashboard/savings` route for savings tracking
- [ ] **18.2.** Create `/dashboard/dowry` route for dowry management
- [ ] **18.3.** Create `/dashboard/souvenirs` route for souvenir planning
- [ ] **18.4.** Create `/dashboard/dresscodes` route for dresscode management

---
