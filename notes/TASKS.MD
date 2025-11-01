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
- [ ] Implement full CRUD (create, read, update, delete) operations in each module's +page.server.ts (document, finance, rundown, task, vendor)
- [ ] Add error handling for database operations, form submissions, and validation failures
- [ ] Ensure data loading from Supabase using Drizzle ORM for read operations (load existing data)
- [ ] Add proper error messages, toasts, and user feedback for all actions

### 3.1 Priority CRUD Implementation Tasks (from CRUD.MD analysis)
- [ ] **Phase 2: Server Actions Implementation**
  - [ ] Replace stubbed server actions with real database operations using Drizzle ORM
  - [ ] Implement wedding-scoped data access with proper authorization (filter by weddingId)
  - [ ] Add proper error handling and validation in all server actions
  - [ ] Implement bulk operations support for efficiency
  - [ ] Use transactions for multi-table operations
  - [ ] Add cache invalidation after mutations

- [ ] **Phase 3: State Management Integration**
  - [ ] Connect stores to server data instead of mock data (tasks, vendors, expenses, etc.)
  - [ ] Implement optimistic updates for better UX
  - [ ] Add cache invalidation after mutations
  - [ ] Sync client and server state properly
  - [ ] Replace mock data with real database data in all stores

- [ ] **Budget Module Integration**
  - [ ] Add budget calculation schemas to main validation index (src/lib/validation/index.ts)
  - [ ] Implement budget CRUD operations (create, read, update, delete)
  - [ ] Add budget UI components and forms
  - [ ] Connect budget data to expense tracking

- [ ] **Form Response Handling**
  - [ ] Implement proper form response handling in page components (+page.svelte)
  - [ ] Add loading states during operations
  - [ ] Handle success/error responses with appropriate toasts
  - [ ] Add invalidateAll() calls after successful mutations

- [ ] **Implementation Order by Module**
  - [ ] Tasks Module (start here - simplest entity)
  - [ ] Vendors Module (next - has relationships)
  - [ ] Expenses Module (complex - has categories)
  - [ ] Documents Module (special - file uploads)
  - [ ] Other Modules (Rundowns, etc.)

---

## 4. Create Cloudflare R2 File Upload Config
- [ ] Configure R2 bucket and access keys
- [ ] Add signed upload URL endpoint
- [ ] Set up CORS policies for frontend upload
- [ ] Test file upload and retrieval (avatar, wedding media)

---

## 5. Update Auth / Reset-Password Mechanism
- [ ] Refactor `/auth/reset-password` route
- [ ] Implement token verification and expiration handling
- [ ] Add success/error toast notifications
- [ ] Improve user feedback and redirect flow

---

## 6. Build `account/+page.svelte`
- [ ] **6.1.** Design and layout page using shadcn-svelte components
- [ ] **6.2.** Fetch and display user data from Supabase session
- [ ] **6.3.** Implement editable profile form (name, email, etc.)
- [ ] **6.4.** Add avatar upload using Cloudflare R2
- [ ] **6.5.** Implement password update/reset UI
- [ ] **6.6.** Connect all forms to backend and add UX polish

---

## 7. Build `setup/+page.svelte`
- [ ] Create onboarding page for initializing couple & wedding data
- [ ] Add form for partner names, date, location
- [ ] Save data into `wedding` schema
- [ ] Redirect to dashboard after successful setup

---

## 8. Add `wedding-data-alert.svelte`
- [ ] Display alert if `!wedding.data`
- [ ] Include CTA button to `/setup`
- [ ] Style with shadcn `Alert` component
- [ ] Integrate visibility check into dashboard or main layout

---

## 9. Connect Frontend with Backend
- [ ] **9.1.** Define API endpoints for all main modules
- [ ] **9.2.** Hook up Supabase client (`locals.supabase`) for CRUD ops
- [ ] **9.3.** Replace mock/static data with live queries
- [ ] **9.4.** Sync Zod validation between frontend and backend
- [ ] **9.5.** Add error handling and toasts for failed requests
- [ ] **9.6.** Test full user flow: login → setup → dashboard → account

---

## 10. Build Missing Module UIs
- [ ] **10.1.** Enhance paperwork module: Add file upload UI for documents using R2
- [ ] **10.2.** Enhance rundown module: Implement timeline with drag-and-drop for events
- [ ] **10.3.** Add savings tracking module: UI for goal setting and progress visualization
- [ ] **10.4.** Add dowry tracking module: Forms for item details and proof uploads

---

## 11. Validation, Testing & User Flow
- [ ] Sync Zod schemas between frontend and backend
- [ ] Add unit and integration tests for critical user flows
- [ ] Run lint and typecheck commands post-changes
- [ ] Ensure wedding setup redirects properly and handle multi-user collaboration

---

## 12. Build Souvenirs Module
- [ ] Design and implement UI for souvenir planning (type, quantity, cost)
- [ ] Add tracking for distribution to guests
- [ ] Link souvenirs to vendors for coordination

---

## 13. Add Data Export Features
- [ ] Implement PDF export for budgets and rundowns
- [ ] Add CSV export for vendor lists and expenses
- [ ] Ensure exports are downloadable from dashboard

---

## 14. Implement Wedding Collaboration
- [ ] Add shared wedding access via invites or links
- [ ] Implement role-based permissions (e.g., partner vs. planner)
- [ ] Sync changes in real-time for collaborators

---

## 15. Enhance Rundown with Drag-and-Drop
- [ ] Integrate DND library for event reordering
- [ ] Update timeline visualization dynamically
- [ ] Save reordered events to database

---

## 16. Add Reminders/Notifications
- [ ] Set up email/SMS alerts for due dates
- [ ] Integrate with Supabase cron for scheduling
- [ ] Allow users to configure notification preferences

---

## 17. Polish Onboarding Flow
- [ ] Create guided setup with progress indicators
- [ ] Add tooltips and help text for forms
- [ ] Test and refine user flow from registration to dashboard

---

