# Project Structure & Organization

## Root Directory
- **Configuration**: Multiple config files for different tools (svelte.config.js, vite.config.ts, drizzle.config.ts, uno.config.ts)
- **Package Management**: Uses bun.lock with package-lock.json fallback
- **Code Quality**: .prettierrc, .prettierignore, eslint.config.js for consistent formatting

## Source Structure (`src/`)
```
src/
├── lib/                    # Shared library code
│   ├── actions/           # Svelte actions
│   ├── assets/            # Static assets
│   ├── components/        # Reusable UI components
│   ├── constants/         # App constants
│   ├── data/              # Static data and mock data
│   ├── hooks/             # SvelteKit hooks
│   ├── server/            # Server-side code
│   │   └── db/            # Database schema and utilities
│   ├── stores/            # Svelte stores for state management
│   ├── styles/            # CSS and styling utilities
│   ├── utils/             # Utility functions
│   ├── validation/        # Zod schemas and validation
│   ├── index.ts           # Library exports
│   ├── types.ts           # TypeScript type definitions
│   └── utils.ts           # Common utilities
├── routes/                # SvelteKit file-based routing
│   └── dashboard/         # Dashboard routes
├── app.d.ts              # App-wide TypeScript declarations
└── app.html              # HTML template
```

## Routing Convention
Based on CONTEXT.md, the planned route structure follows SvelteKit's file-based routing:
- `(dashboard)/` - Wedding planner dashboard with nested routes
- `(invitation)/` - Invitation planner interface  
- `(public)/` - Public invitation pages with dynamic tokens
- `(auth)/` - Authentication flows

## Database Schema Location
- Schema definitions: `src/lib/server/db/schema.ts`
- Drizzle configuration: `drizzle.config.ts` (points to schema file)

## Styling Architecture
- UnoCSS configuration in `uno.config.ts` with multiple presets
- Safelist classes defined in `src/lib/styles/safelist`
- Shadcn-svelte components for consistent UI patterns