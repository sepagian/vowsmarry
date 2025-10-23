# 🧩 VowsMarry Development Task List

## 1. Migrate Database Schema
- [ ] **1.1.** Migrate `db/schema.ts` to new repo
- [ ] **1.2.** Update `validation/index.ts` with new schema
- [ ] **1.3.** Update RLS (Row-Level Security) policies
- [ ] **1.4.** Refine schema: Add `weddings` table for wedding grouping, `expenses` table linked to budgets for detailed tracking

---

## 2. Update `(modules)/+page.server.ts`
- [ ] Refactor server routes and actions to align with updated schema
- [ ] Adjust validation and data loading logic
- [ ] Implement CRUD operations (create, read, update, delete) for all modules
- [ ] Ensure data loading from Supabase using Drizzle ORM

---

## 3. Push `db/schema` to Database
- [ ] Run migration commands via Supabase CLI or Prisma Migrate
- [ ] Verify schema structure and relationships
- [ ] Test database integrity before production deployment

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

## 🔁 Recommended Order
1️⃣ Migrate schema (1.1–1.4)
2️⃣ Update `(modules)/+page.server.ts`
3️⃣ Push schema to DB
4️⃣ Configure Cloudflare R2
5️⃣ Build setup page
6️⃣ Add wedding-data alert
7️⃣ Update auth/reset-password
8️⃣ Build account page
9️⃣ Connect frontend with backend (9.1–9.6)
10 Build missing modules (10.1–10.4)
1️⃣1️⃣ Validation, testing & user flow
1️⃣2️⃣ Build souvenirs module
1️⃣3️⃣ Add data export features
1️⃣4️⃣ Implement wedding collaboration
1️⃣5️⃣ Enhance rundown with drag-and-drop
1️⃣6️⃣ Add reminders/notifications
1️⃣7️⃣ Polish onboarding flow
