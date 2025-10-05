# CONTEXT.md – VowsMarry Wedding Planner SaaS

## 1. Project Overview

**VowsMarry – Wedding Planner Platform**  
_Tagline:_ "Plan Your Perfect Day – Organized, Elegant, Effortless."

VowsMarry is a **comprehensive wedding planner SaaS platform** designed for couples and wedding planners. It provides an integrated suite of tools to manage all aspects of wedding planning including **paperwork tracking, budgeting, task management, vendor coordination, dresscode planning, event rundown, and savings tracking**, with **digital wedding invitations** as a premium add-on feature.

### Key Differentiators
- **All-in-one Solution**: Unlike competitors focusing solely on invitations, VowsMarry provides end-to-end wedding planning capabilities
- **Cultural Sensitivity**: Includes features like dowry (Mahar) tracking and traditional ceremony elements
- **Freemium Model**: Core planning tools free, premium features and templates monetized
- **Guest Experience**: Seamless integration between planning tools and guest-facing invitation platform

This positions VowsMarry as more than just an invitation builder — it becomes a **comprehensive wedding planning ecosystem**.

---

## 2. Target Audience & Industry

- **Primary Audience:** Engaged couples (25–45, tech-savvy) planning their own wedding.
- **Secondary Audience:** Wedding planners and vendors.
- **Tertiary Audience:** Guests (via invitations, RSVP, guestbook).
- **Industry:** Wedding & Event Planning SaaS.

---

## 3. Core Features

### 3.1 Wedding Planner Modules

1. **Paperwork** – Track permits, licenses, contracts. Upload scans/photos. Status: pending, approved, rejected. Deadline reminders.
2. **Budgeting** – Allocate budget per category. Track planned vs actual spend. Visualize with charts. Export to CSV/PDF.
3. **To-do List** – Task management (assign to partner/planner). Status: todo, in-progress, done. Due dates + reminders. Subtasks + notes.
4. **Vendors** – Manage vendor contacts. Track deals/contracts. Status: contacted, negotiating, booked, completed. Ratings/reviews.
5. **Dresscode / Uniform** – Upload inspiration photos. Assign dresscode per event. Share with guests via invitation site.
6. **Rundown** – Timeline of events (hour-by-hour). Assign responsibilities. Export to PDF.
7. **Savings** – Track couple’s savings progress. Link to budgeting module. Optional bank/fintech integration (future).
8. **Dowry (Mahar)** – Track dowry details (amount, type: cash, gold, property, etc.). Upload proof or receipts.
9. **Souvenir** – Manage souvenir planning (type, vendor, quantity, cost). Track distribution to guests.

---

### 3.2 Add-on Module: Digital Invitations

1. **Templates** – Choose from free/premium templates (Islamic, Traditional, Modern, Minimalist). Custom colors & fonts.
2. **Couple Details** – Bride & groom names, parents, event details (date, venue, maps).
3. **Guests** - Manage guests, send invitations link.
4. **RSVP** – Guest-specific links, RSVP status (attending, declined, pending), plus-one, meal preferences. QR code check-in.
5. **Gallery** – Photo & video gallery. Cloudflare Images + Stream for optimization.
6. **Gifts** – Digital envelope (bank transfer, QRIS), gift registry integration (Tokopedia, Shopee, etc.).
7. **Love Story** – Timeline/story section with text, images, or video.

---

## 4. Goals & Monetization

- **MVP Goal:** Deliver core wedding planner modules (Paperwork, Budgeting, To-do List, Vendors, Rundown).
- **Scale Goal:** Add Savings, Dresscode, and Invitations as add-on.
- **Future Monetization:** Premium templates, custom domains, vendor marketplace, advanced analytics, gift registry, printing partnerships.

---

## 5. Tech Stack & Architecture

### Core Technologies
| Layer          | Technology                                                |
| -------------- | --------------------------------------------------------- |
| **Frontend**   | SvelteKit 5 with TypeScript                              |
| **Runtime**    | Bun (with npm fallback)                                  |
| **Backend**    | Supabase (PostgreSQL with pg_cron)                       |
| **ORM**        | Drizzle ORM with Drizzle Kit                             |
| **Auth**       | Supabase Auth                                            |
| **Styling**    | UnoCSS with Tailwind CSS utilities                       |
| **UI**         | Shadcn-svelte + bits-ui components                       |
| **Forms**      | Superforms + Formsnap + Zod validation                   |
| **Charts**     | LayerChart + D3                                          |
| **Icons**      | Lucide icons via @iconify-json/lucide                    |
| **Media**      | Cloudflare R2 + Images + Stream                          |
| **Deployment** | Vercel with adapter-vercel                               |
| **DNS**        | Cloudflare (wildcard `*.vowsmarry.id`)                   |

### Development Tools
- **Environment**: Doppler for secrets management
- **Database**: Drizzle Kit for migrations and schema management  
- **Code Quality**: ESLint + Prettier + TypeScript strict mode
- **Package Manager**: Bun with package-lock.json fallback

---

## 6. Project Structure & Architecture

### Source Organization
```
src/
├── lib/                    # Shared library code
│   ├── components/         # Reusable UI components (Shadcn-svelte)
│   ├── server/db/         # Database schema and utilities
│   ├── stores/            # Svelte stores for state management
│   ├── utils/             # Utility functions
│   ├── validation/        # Zod schemas and validation
│   ├── styles/            # CSS and UnoCSS safelist classes
│   └── types.ts           # TypeScript type definitions
├── routes/                # SvelteKit file-based routing
└── app.html              # HTML template
```

### Routing Structure (Planned)
```
src/routes/
├── (dashboard)/           # Wedding planner dashboard
│   ├── paperwork/        # Document tracking
│   ├── budget/           # Budget management
│   ├── tasks/            # To-do list management
│   ├── vendors/          # Vendor coordination
│   ├── dresscode/        # Uniform/dresscode planning
│   ├── rundown/          # Event timeline
│   ├── savings/          # Savings tracking
│   ├── dowry/            # Mahar management
│   └── souvenirs/        # Souvenir planning
│
├── (invitation)/         # Invitation planner interface
│   ├── templates/        # Template selection
│   ├── setup/            # Couple details setup
│   ├── story/            # Love story section
│   ├── guests/           # Guest management
│   ├── gallery/          # Photo/video gallery
│   └── gifts/            # Digital gifts setup
│
├── (public)/             # Public invitation pages
│   ├── [token]/          # Guest-specific invitation
│   ├── rsvp/             # RSVP handling
│   └── gallery/          # Public photo gallery
│
└── (auth)/               # Authentication flows
    ├── login/
    ├── register/
    ├── verify/
    └── logout/
```

---

## 7. Database Schema (High-Level)

### Core Tables Structure
```sql
-- User Management
users (id, email, created_at, updated_at)
user_profiles (user_id, name, phone, avatar_url)

-- Wedding Planning Core
weddings (id, user_id, partner_name, wedding_date, venue, status)
wedding_collaborators (wedding_id, user_id, role) -- for shared planning

-- Planning Modules
paperwork (id, wedding_id, title, type, status, deadline, file_url)
budget_categories (id, wedding_id, name, allocated_amount, spent_amount)
budget_items (id, category_id, description, planned_cost, actual_cost, vendor_id)
tasks (id, wedding_id, title, description, status, due_date, assigned_to)
vendors (id, wedding_id, name, category, contact_info, status, rating)
rundown_events (id, wedding_id, time, title, description, responsible_person)
savings_goals (id, wedding_id, target_amount, current_amount, deadline)
dowry_items (id, wedding_id, type, amount, description, proof_url)
souvenirs (id, wedding_id, type, quantity, cost, vendor_id, distributed_count)

-- Invitation System
invitations (id, wedding_id, template_id, custom_domain, is_published)
invitation_guests (id, invitation_id, name, email, phone, rsvp_status, plus_one)
invitation_gallery (id, invitation_id, media_url, media_type, caption)
love_story_timeline (id, invitation_id, date, title, description, image_url)
digital_gifts (id, invitation_id, gift_type, amount, message, guest_name)
```

### Key Relationships
- **One-to-Many**: User → Weddings, Wedding → All planning modules
- **Many-to-Many**: Users ↔ Weddings (via collaborators table)
- **Hierarchical**: Budget Categories → Budget Items, Tasks → Subtasks

---

## 8. Development Workflow & Commands

### Common Commands
```bash
# Development
bun run dev          # Start dev server with Doppler
bun run build        # Production build
bun run preview      # Preview production build

# Code Quality
bun run format       # Format code with Prettier
bun run lint         # Lint and format check
bun run check        # Type checking with svelte-check

# Database
bun run db:push      # Push schema changes
bun run db:generate  # Generate migrations
bun run db:migrate   # Run migrations
bun run db:studio    # Open Drizzle Studio
```

### Environment Setup
- All commands use `doppler run --` prefix for environment variable injection
- Database schema located at `./src/lib/server/db/schema.ts`
- UnoCSS safelist classes defined in `./src/lib/styles/safelist`

---

## 9. Current Status & Recommendations

### Implementation Priority (MVP)
1. **Authentication System** - Supabase Auth integration
2. **Core Dashboard** - Basic wedding creation and management
3. **Essential Modules** - Paperwork, Budget, Tasks, Vendors
4. **Database Schema** - Complete Drizzle schema implementation
5. **UI Foundation** - Shadcn-svelte component library setup

### Technical Recommendations
- **Database First**: Implement complete schema with Drizzle before building UI
- **Component Library**: Establish consistent Shadcn-svelte patterns early
- **Form Validation**: Use Superforms + Zod for all data input
- **State Management**: Leverage SvelteKit's built-in stores and page data
- **Testing Strategy**: Focus on integration tests for critical user flows

### Business Recommendations  
- **MVP Focus**: Launch with core planning tools, add invitations as premium feature
- **User Onboarding**: Create guided setup flow for new weddings
- **Data Export**: Provide PDF/CSV exports for vendor presentations
- **Mobile Optimization**: Ensure responsive design for on-the-go planning
- **Collaboration**: Implement real-time updates for shared planning

### Next Steps
1. Complete database schema implementation
2. Set up authentication and user management
3. Build core dashboard with wedding creation
4. Implement paperwork and budget modules
5. Add task management and vendor coordination
