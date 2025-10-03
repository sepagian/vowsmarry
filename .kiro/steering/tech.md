# Tech Stack & Development

## Core Technologies
- **Frontend**: SvelteKit 5 with TypeScript
- **Runtime**: Bun
- **Backend**: Supabase (PostgreSQL with pg_cron)
- **ORM**: Drizzle ORM
- **Authentication**: Supabase Auth
- **Styling**: UnoCSS with Tailwind CSS utilities
- **UI Components**: Shadcn-svelte + bits-ui
- **Forms**: Superforms + Formsnap + Zod validation
- **Charts**: LayerChart + D3
- **Icons**: Lucide icons via @iconify-json/lucide
- **Deployment**: Vercel with adapter-vercel

## Development Tools
- **Package Manager**: Bun (with npm fallback)
- **Environment**: Doppler for secrets management
- **Database**: Drizzle Kit for migrations and schema management
- **Code Quality**: ESLint + Prettier + TypeScript strict mode
- **Styling**: UnoCSS with presets for Shadcn, animations, and scrollbars

## Common Commands
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

## Environment Setup
- All commands use `doppler run --` prefix for environment variable injection
- Database schema located at `./src/lib/server/db/schema.ts`
- UnoCSS safelist classes defined in `./src/lib/styles/safelist`