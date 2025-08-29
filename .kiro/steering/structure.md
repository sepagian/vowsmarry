# Project Structure & Organization

## Root Directory Structure

```
├── src/                    # Source code
├── static/                 # Static assets (robots.txt, etc.)
├── drizzle/               # Database migrations
├── .kiro/                 # Kiro configuration and steering
├── .svelte-kit/           # SvelteKit generated files
└── node_modules/          # Dependencies
```

## Source Code Organization (`src/`)

```
src/
├── lib/                   # Shared library code
│   ├── components/        # Reusable Svelte components
│   ├── server/           # Server-side code (DB, auth, etc.)
│   ├── stores/           # Svelte stores for state management
│   ├── utils/            # Utility functions
│   ├── validation/       # Zod schemas and validation
│   ├── errors/           # Error handling utilities
│   ├── hooks/            # Custom hooks
│   └── assets/           # Static assets used in components
├── routes/               # SvelteKit routes (file-based routing)
│   ├── (auth)/          # Authentication routes (login, register, etc.)
│   ├── dashboard/       # Wedding planner dashboard
│   └── api/             # API endpoints
├── app.html             # HTML template
├── app.d.ts             # TypeScript app definitions
└── hooks.server.ts      # Server-side hooks
```

## Route Structure Conventions

- **Route Groups**: Use parentheses for logical grouping without affecting URL structure
  - `(auth)/` - Authentication pages
  - `(dashboard)/` - Protected dashboard pages
  - `(public)/` - Public invitation pages
- **API Routes**: Place in `routes/api/` directory
- **Layout Files**: `+layout.svelte` for shared layouts, `+layout.server.ts` for server logic

## Component Organization

- **Reusable Components**: Place in `src/lib/components/`
- **Page-specific Components**: Co-locate with route files when appropriate
- **UI Components**: Leverage Bits-UI for base components, extend as needed

## Database & Server Code

- **Schema**: Define in `src/lib/server/db/schema.ts`
- **Database Utils**: Place in `src/lib/server/db/`
- **Auth Logic**: Organize in `src/lib/server/auth/`
- **API Handlers**: Use `+page.server.ts` or `+layout.server.ts` for form actions

## File Naming Conventions

- **Components**: PascalCase (e.g., `UserProfile.svelte`)
- **Routes**: kebab-case for directories, SvelteKit conventions for files
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **Types**: PascalCase interfaces/types in `.d.ts` files