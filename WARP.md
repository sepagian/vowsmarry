# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

VowsMarry is a comprehensive wedding planner SaaS platform built with SvelteKit 5, offering wedding planning tools (paperwork, budgeting, tasks, vendors, rundown, savings) and digital wedding invitations as an add-on feature.

## Development Commands

### Runtime & Package Management
- Use **Bun** as the primary runtime: `bun run dev`
- Fallback to Node.js: `npm run dev` or `node --run dev`
- Install dependencies: `bun install` (preferred) or `npm install`

### Development Workflow
- **Start development**: `bun run dev` or `npm run dev`
- **Type checking**: `npm run check` (runs svelte-kit sync and svelte-check)
- **Watch mode**: `npm run check:watch`
- **Format code**: `npm run format` (Prettier)
- **Lint code**: `npm run lint` (Prettier + ESLint)

### Database Management
- **Push schema changes**: `npm run db:push` (drizzle-kit push)
- **Generate migrations**: `npm run db:generate` (drizzle-kit generate)
- **Run migrations**: `npm run db:migrate` (drizzle-kit migrate)
- **Open database studio**: `npm run db:studio` (drizzle-kit studio)
- **Seed database**: `npm run db:seed` (runs src/lib/server/db/seed.ts)

### Build & Deploy
- **Build for production**: `npm run build`
- **Preview build**: `npm run preview`

## Architecture Overview

### Tech Stack
- **Frontend**: SvelteKit 5 with TypeScript
- **Runtime**: Bun (primary), Node.js (fallback)
- **Database**: PostgreSQL via Supabase with Drizzle ORM
- **Authentication**: Supabase Auth (configured in hooks.server.ts)
- **Styling**: UnoCSS with custom design token system + shadcn/ui components
- **File Storage**: Cloudflare R2 + Images + Stream
- **UI Components**: Bits-UI + custom component system

### Directory Structure
```
src/
├── lib/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # shadcn-style base components
│   │   ├── forms/          # Form components
│   │   ├── layout/         # Layout components
│   │   └── examples/       # Example/demo components
│   ├── design-tokens/      # Comprehensive design system
│   ├── server/
│   │   ├── db/            # Drizzle schema, seed, and database utilities
│   │   ├── services/      # Business logic services
│   │   └── storage/       # File upload/storage handling
│   ├── stores/            # Svelte stores for state management
│   ├── utils/             # Utility functions
│   ├── validation/        # Zod schemas and validation
│   ├── hooks/             # Custom Svelte hooks
│   └── errors/            # Error handling utilities
└── routes/
    ├── (auth)/            # Authentication routes (login, register, etc.)
    ├── dashboard/         # Main wedding planning modules
    │   ├── budget/        # Budget management
    │   ├── todo/          # Task management  
    │   ├── vendor/        # Vendor management
    │   ├── paperwork/     # Document management
    │   ├── rundown/       # Timeline/schedule management
    │   ├── saving/        # Savings tracking
    │   ├── dowry/         # Dowry management
    │   ├── souvenir/      # Souvenir planning
    │   └── invitation/    # Digital invitation builder
    └── api/               # API routes
```

### Database Architecture
The database uses a wedding-centric design where most tables reference a `weddings` table:

**Core Entities**:
- `weddings` - Central wedding record linked to Supabase auth user
- User authentication handled by Supabase (no local user table)

**Planning Modules**:
- `documents` - Paperwork tracking with file uploads and reminders
- `budget_categories` + `budget_items` + `budget_alerts` - Comprehensive budgeting
- `todos` - Task management with assignments and priorities  
- `vendors` - Vendor management with contracts and communication history
- `savings_goals` + `savings_entries` + `savings_summaries` - Savings tracking
- `dowry_items` - Dowry/mahar documentation
- `souvenirs` + `souvenir_distribution` - Souvenir planning and distribution
- `dresscodes` - Event dress code definitions
- `rundown_events` - Timeline/schedule management

**Invitation System**:
- `invitations` - Digital invitation configuration
- `guests` + `rsvps` - Guest management and RSVP tracking
- `gallery_items` - Photo/video gallery
- `love_story_items` - Couple story timeline
- `gift_options` + `gift_contributions` - Digital envelope and gift registry

### Design System
The project uses a comprehensive design token system located in `src/lib/design-tokens/`:

- **Colors**: Semantic color system with light/dark mode support
- **Typography**: Font families, sizes, weights, and spacing
- **Layout**: Breakpoints, containers, grid systems
- **Visual**: Border radius, shadows, animations
- **Spacing**: Consistent spacing scale

Design tokens are consumed by UnoCSS configuration and available as CSS custom properties.

### Authentication Flow
- Server-side authentication via Supabase in `hooks.server.ts`
- Dashboard routes protected by auth guard
- User data stored in `event.locals.user`
- Authentication pages redirect logged-in users to dashboard

### File Upload Strategy
- Cloudflare R2 for file storage
- Presigned URLs for direct uploads
- Image optimization via Cloudflare Images
- Video streaming via Cloudflare Stream

## Development Guidelines

### Working with the Database
- Always use the Drizzle schema in `src/lib/server/db/schema.ts`
- Most operations should be wedding-scoped (include weddingId in queries)
- Use proper indexes for performance (already defined in schema)
- Run `npm run db:push` after schema changes in development

### Design System Usage
- Import design tokens from `src/lib/design-tokens`
- Use semantic color classes (e.g., `btn-primary`, `surface-success`)
- Follow responsive utility patterns (`container-responsive`, `grid-responsive-cards`)
- Prefer design token shortcuts over raw Tailwind classes

### Component Development
- Place reusable components in appropriate `src/lib/components/` subdirectories
- Use Bits-UI for accessible base components
- Follow the established component patterns in existing code
- Implement proper TypeScript types for component props

### Form Handling
- Use SvelteKit's form actions with proper validation
- Implement Zod schemas in `src/lib/validation/`
- Use the form component patterns established in `src/lib/components/forms/`

### File Uploads
- Use the upload utilities in `src/lib/server/storage/`
- Always validate file types and sizes
- Store file metadata in relevant database tables
- Use presigned URLs for direct-to-cloud uploads when possible

### Environment Configuration
Required environment variables (see `.env.example`):
- `DATABASE_URL` - PostgreSQL connection string
- `PUBLIC_SUPABASE_URL` + `PUBLIC_SUPABASE_ANON_KEY` - Supabase configuration
- `CLOUDFLARE_R2_*` - Cloudflare R2 storage credentials

## Testing
Currently no testing framework is configured. When adding tests:
- Consider Vitest for unit tests
- Playwright for E2E testing
- Test database operations with proper cleanup
- Mock external services (Supabase, Cloudflare)

## Important Notes

### Wedding-Centric Architecture
Most database operations should include `weddingId` filtering to ensure proper data isolation between different weddings.

### Multi-Module System
The application is designed as a comprehensive wedding planning suite, not just an invitation builder. Each module (budget, todos, vendors, etc.) can operate independently but shares the wedding context.

### Design Token Integration
The design system is deeply integrated with UnoCSS. When adding new components or styles, use the existing token system rather than creating ad-hoc styles.

### File Storage Security
Always validate uploaded files and use proper access controls. The Cloudflare R2 integration includes security considerations for public vs private file access.
