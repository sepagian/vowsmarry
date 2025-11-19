import { writable, derived, get } from 'svelte/store';
import type { User, Session } from '@supabase/supabase-js';

/**
 * Authentication store interface
 */
export interface AuthStore {
	user: User | null;
	session: Session | null;
	loading: boolean;
	initialized: boolean;
}

/**
 * Initial authentication state
 */
const initialState: AuthStore = {
	user: null,
	session: null,
	loading: true,
	initialized: false,
};

/**
 * Create the writable auth store
 */
function createAuthStore() {
	const { subscribe, set, update } = writable<AuthStore>(initialState);

	return {
		subscribe,

		/**
		 * Initialize the auth store with server-side data
		 * This should be called when the app loads with data from page data
		 */
		initialize: (user: User | null, session: Session | null) => {
			update((state) => ({
				...state,
				user,
				session,
				loading: false,
				initialized: true,
			}));
		},

		/**
		 * Set the current user and session
		 */
		setAuth: (user: User | null, session: Session | null) => {
			update((state) => ({
				...state,
				user,
				session,
				loading: false,
			}));
		},

		/**
		 * Set loading state
		 */
		setLoading: (loading: boolean) => {
			update((state) => ({
				...state,
				loading,
			}));
		},

		/**
		 * Clear authentication state (for logout)
		 */
		clearAuth: () => {
			update((state) => ({
				...state,
				user: null,
				session: null,
				loading: false,
			}));
		},

		/**
		 * Update user data only (for profile updates)
		 */
		setUser: (user: User | null) => {
			update((state) => ({
				...state,
				user,
			}));
		},

		/**
		 * Reset store to initial state
		 */
		reset: () => {
			set(initialState);
		},

		/**
		 * Get current state (non-reactive)
		 */
		getState: () => get({ subscribe }),
	};
}

/**
 * The main authentication store
 */
export const authStore = createAuthStore();

/**
 * Derived stores for common use cases
 */

/**
 * Reactive boolean indicating if user is authenticated
 */
export const isAuthenticated = derived(
	authStore,
	($auth) => $auth.user !== null && $auth.initialized,
);

/**
 * Reactive boolean indicating if authentication is loading
 */
export const isAuthLoading = derived(authStore, ($auth) => $auth.loading);

/**
 * Reactive user object (null if not authenticated)
 */
export const currentUser = derived(authStore, ($auth) => $auth.user);

/**
 * Reactive session object (null if not authenticated)
 */
export const currentSession = derived(authStore, ($auth) => $auth.session);

/**
 * Reactive boolean indicating if the store has been initialized
 */
export const isAuthInitialized = derived(authStore, ($auth) => $auth.initialized);

/**
 * Reactive user email (null if not authenticated)
 */
export const userEmail = derived(authStore, ($auth) => $auth.user?.email || null);

/**
 * Reactive boolean indicating if user email is verified
 */
export const isEmailVerified = derived(
	authStore,
	($auth) => $auth.user?.email_confirmed_at !== null,
);
