# Technology Stack & Development Guidelines

## Core Tech Stack

- **Frontend**: SvelteKit 5 with TypeScript
- **Runtime**: Bun
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Lucia Auth with email confirmation
- **Styling**: UnoCSS with Tailwind-compatible utilities + shadcn/ui preset
- **UI Components**: Bits-UI component library
- **Forms**: Formsnap + Sveltekit Superforms + Zod validation
- **File Storage**: AWS S3 with presigned URLs
- **Build Tool**: Vite

## Code Style & Formatting

- **Prettier**: Tabs, single quotes, no trailing commas, 100 char line width
- **ESLint**: TypeScript + Svelte rules enabled
- **File Extensions**: `.ts` for TypeScript, `.svelte` for components
- **Import Style**: ES modules only (`type: "module"` in package.json)

## Common Commands

```bash
# Development
npm run dev                 # Start dev server
npm run build              # Production build
npm run preview            # Preview production build

# Code Quality
npm run format             # Format with Prettier
npm run lint               # Lint with ESLint + Prettier check
npm run check              # Type check with svelte-check

# Database
npm run db:push            # Push schema changes
npm run db:generate        # Generate migrations
npm run db:migrate         # Run migrations
npm run db:studio          # Open Drizzle Studio
npm run db:seed            # Seed database
```

## Key Dependencies

- **UI**: `bits-ui`, `lucide-svelte`, `clsx`, `tailwind-merge`
- **Forms**: `formsnap`, `sveltekit-superforms`, `zod`
- **Database**: `drizzle-orm`, `postgres`, `drizzle-kit`
- **Auth**: `@oslojs/crypto`, `@oslojs/encoding`
- **Storage**: `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`
- **Utils**: `sharp` (image processing), `dotenv`