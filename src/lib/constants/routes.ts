export const ROUTES = {
	PUBLIC: {
		HOME: '/',
		LOGIN: '/login',
		REGISTER: '/register',
		FORGOT_PASSWORD: '/forgot-password',
		RESET_PASSWORD: '/reset-password',
	},
	PROTECTED: {
		DASHBOARD: '/dashboard',
		ACCOUNT: '/account',
	},
	API: {
		AUTH: '/api/auth',
	},
	STATIC: {
		APP_ASSETS: '/_app',
		ROBOTS: '/robots.txt',
		FAVICON: '/favicon.ico',
	},
} as const;

export const AUTH_PAGES = [ROUTES.PUBLIC.LOGIN, ROUTES.PUBLIC.REGISTER] as const;
export const PROTECTED_PREFIXES = [ROUTES.PROTECTED.DASHBOARD] as const;
export const PUBLIC_PREFIXES = [ROUTES.STATIC.APP_ASSETS, ROUTES.API.AUTH] as const;
