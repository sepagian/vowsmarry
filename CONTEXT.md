# CONTEXT.md – VowsMarry Wedding Planner SaaS

## 1. Project Overview

**VowsMarry – Wedding Planner Platform**  
_Tagline:_ "Plan Your Perfect Day – Organized, Elegant, Effortless."

VowsMarry is a **full-fledged wedding planner SaaS platform** designed for couples and wedding planners.  
It provides tools to manage **paperwork, budgeting, tasks, vendors, dresscode, rundown, and savings**, with **digital wedding invitations** as an **add-on feature**.

This makes VowsMarry more than just an invitation builder — it becomes a **comprehensive wedding planning hub**.

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

## 5. Tech Stack

| Layer      | Choice                                                    |
| ---------- | --------------------------------------------------------- |
| Frontend   | **SvelteKit 5** (TypeScript)                              |
| Runtime    | Bun                                                       |
| Backend    | Supabase (Postgres, pg_cron)                              |
| ORM        | Drizzle ORM                                               |
| Auth       | **Supabase Auth**                                         |
| Media      | **Cloudflare R2 + Images + Stream** (recommended default) |
| UI         | Shadcn-svelte + UnoCSS                                    |
| Animations | GSAP                                                      |
| Styling    | Tailwind CSS / UnoCSS                                     |
| Hosting    | Vercel (wildcard subdomain support)                       |
| DNS        | Cloudflare (wildcard `*.vowsmarry.id`)                    |

---

## 6. Routing Structure

src/routes/
├── (dashboard)/ # Wedding planner dashboard
│ ├── task/
│ ├── document/
│ ├── budget/
│ ├── vendor/
│ ├── schedule/
│
├── (invitation)/ # Invitation planner
│ ├── setup/
│ ├── story/
│ ├── guests/
│
├── (public)/ # Public invitation pages
│ ├── [token]/ # Guest-specific invitation
│ └── +layout.svelte
│
├─ (auth)/
│ ├── login/
│ ├── register/
│ ├── verify/
│ └── logout/

---

## 7. Database Schema (High-Level)

### Planner Modules

```sql
paperwork(id, user_id, title, type, status, due_date, file_url, created_at)
budgets(id, user_id, category, planned_amount, actual_amount, created_at)
todos(id, user_id, title, description, status, due_date, assigned_to, created_at)
vendors(id, user_id, name, category, contact_info, status, contract_url, created_at)
dresscodes(id, user_id, event_name, description, image_url, created_at)
rundowns(id, user_id, event_name, start_time, end_time, description, assigned_to, created_at)
savings(id, user_id, goal_amount, current_amount, created_at)
dowry(id, user_id, type, description, value, proof_url, created_at)
souvenirs(id, user_id, name, vendor_id, quantity, cost, status, created_at)
```

### Invitations Modules

```sql
invitations(id, user_id, slug, template, status, expired_at)
couple_details(id, invitation_id, bride_name, groom_name, parents, event_date, location, maps_url, greeting)
rsvp(id, invitation_id, guest_id, status, plus_one, meal_pref, qr_code, created_at)
gallery(id, invitation_id, type, key, url, sort_order, created_at)
gifts(id, invitation_id, type, provider, account_info, created_at)
love_story(id, invitation_id, title, content, media_url, sort_order, created_at)
guests(id, invitation_id, name, phone, token, created_at)
messages(id, guest_id, invitation_id, name, content, created_at)
parents(id, invitation_id, side, role, name, created_at)
```
