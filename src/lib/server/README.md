# Server-Side Authentication Architecture

This directory contains the server-side authentication and authorization logic for VowsMarry, using Better Auth with Cloudflare D1.

## Core Files

### Authentication

- **`auth.ts`** - Better Auth configuration with Drizzle adapter, session management, and security settings
- **`auth-helpers.ts`** - Helper functions for authentication in server routes and actions
- **`auth-types.ts`** - Shared TypeScript types for authentication (User, Session, AuthContext, Wedding)
- **`auth-utils.ts`** - Utility functions including type guards for authentication checks

### Error Handling

- **`error-utils.ts`** - Standardized error creation utilities with error codes

### Platform

- **`platform-utils.ts`** - Safe access to Cloudflare platform bindings (D1, R2)

## Usage Examples

### Protecting Server Actions with `withAuth`

```typescript
import { withAuth } from '$lib/server/auth-helpers';

export const actions = {
  updateWedding: withAuth(async ({ user, wedding, plannerDb }, { request }) => {
    // user and wedding are guaranteed to exist here
    const formData = await request.formData();
    
    await plannerDb
      .updateTable('weddings')
      .set({ weddingDate: formData.get('date') })
      .where('id', '=', wedding.id)
      .execute();
    
    return { success: true };
  })
};
```

### Checking Authentication in Load Functions

```typescript
import { isAuthenticated } from '$lib/server/auth-utils';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
  if (!isAuthenticated(locals)) {
    redirect(303, '/login');
  }
  
  // TypeScript knows locals.user is non-null here
  return {
    userId: locals.user.id,
    email: locals.user.email
  };
};
```

### Manual User Retrieval

```typescript
import { getUser, getWedding } from '$lib/server/auth-helpers';

export const load = async ({ locals, plannerDb }) => {
  const user = await getUser(locals.user); // Throws 401 if not authenticated
  const wedding = await getWedding(user.id, plannerDb);
  
  return { user, wedding };
};
```

### Safe Platform Binding Access

```typescript
import { requireD1, requireR2 } from '$lib/server/platform-utils';

export const actions = {
  uploadFile: async (event) => {
    const bucket = requireR2(event); // Throws 500 if R2 not configured
    // ... upload logic
  }
};
```

### Creating Standardized Errors

```typescript
import { error } from '@sveltejs/kit';
import { createAppError, ErrorCodes } from '$lib/server/error-utils';

export const actions = {
  deleteItem: async ({ locals, request }) => {
    if (!locals.user) {
      throw error(401, createAppError(401, 'Authentication required', ErrorCodes.AUTH_REQUIRED));
    }
    
    // ... deletion logic
  }
};
```

## Authentication Flow

1. **Request arrives** → `hooks.server.ts` processes it
2. **Database handler** → Initializes Kysely instances from D1 binding
3. **Better Auth handler** → Validates session, populates `event.locals.session` and `event.locals.user`
4. **Auth guard** → Redirects based on authentication state and route
5. **Route handler** → Accesses authenticated user via `event.locals.user`

## Type Safety

All authentication types are centralized in `auth-types.ts` and re-exported from Better Auth types. This ensures consistency across the application and makes it easy to update types when Better Auth is updated.

## Error Handling

All authentication errors use the standardized `App.Error` interface defined in `app.d.ts`. Use `createAppError()` to create consistent error objects with timestamps and error codes.

## Security Features

- **HTTP-only cookies** - Session tokens not accessible via JavaScript
- **Secure cookies in production** - HTTPS-only in production environment
- **SameSite protection** - CSRF protection via cookie settings
- **Session expiration** - 7-day sessions with 24-hour update age
- **Cookie caching** - 5-minute cache for performance

## Migration Notes

This authentication system replaces the previous Supabase-based authentication. Key differences:

- Session data is in `event.locals.user` (not `event.locals.supabase`)
- User ID is `user.id` (Better Auth format)
- Wedding records link via `userId` field to Better Auth user IDs
- All auth operations go through Better Auth API endpoints
