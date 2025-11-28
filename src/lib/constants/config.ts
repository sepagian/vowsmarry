/**
 * Application-wide configuration constants
 * 
 * Centralizes magic numbers and configuration values for easier maintenance
 * and consistency across the application.
 */

/**
 * Toast notification durations (in milliseconds)
 */
export const TOAST_CONFIG = {
	/** Default duration for general toasts */
	DEFAULT_DURATION: 4000,
	
	/** Duration for error toasts (longer to ensure user sees them) */
	ERROR_DURATION: 6000,
	
	/** Duration for success toasts */
	SUCCESS_DURATION: 3000,
	
	/** Duration for warning toasts */
	WARNING_DURATION: 5000,
	
	/** Duration for info toasts */
	INFO_DURATION: 4000,
} as const;

/**
 * Session configuration (in seconds)
 */
export const SESSION_CONFIG = {
	/** Maximum session lifetime: 7 days */
	MAX_AGE_DAYS: 7,
	
	/** Session update frequency: 1 day */
	UPDATE_INTERVAL_DAYS: 1,
	
	/** Cookie cache duration: 5 minutes */
	CACHE_TTL_MINUTES: 5,
	
	/** Computed values in seconds */
	get MAX_AGE_SECONDS() {
		return this.MAX_AGE_DAYS * 24 * 60 * 60;
	},
	
	get UPDATE_INTERVAL_SECONDS() {
		return this.UPDATE_INTERVAL_DAYS * 24 * 60 * 60;
	},
	
	get CACHE_TTL_SECONDS() {
		return this.CACHE_TTL_MINUTES * 60;
	},
} as const;

/**
 * Pagination configuration
 */
export const PAGINATION_CONFIG = {
	/** Default page size for tables */
	DEFAULT_PAGE_SIZE: 10,
	
	/** Available page size options */
	PAGE_SIZE_OPTIONS: [5, 10, 20, 50, 100] as const,
	
	/** Maximum items per page */
	MAX_PAGE_SIZE: 100,
} as const;

/**
 * File upload configuration
 */
export const FILE_UPLOAD_CONFIG = {
	/** Maximum file size in bytes (10MB) */
	MAX_FILE_SIZE: 10 * 1024 * 1024,
	
	/** Maximum file size in MB (for display) */
	MAX_FILE_SIZE_MB: 10,
	
	/** Allowed MIME types for documents */
	ALLOWED_DOCUMENT_TYPES: [
		'application/pdf',
		'application/msword',
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
		'application/vnd.ms-excel',
		'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
		'image/jpeg',
		'image/png',
		'image/gif',
		'image/webp',
	] as const,
	
	/** Allowed file extensions */
	ALLOWED_EXTENSIONS: [
		'.pdf',
		'.doc',
		'.docx',
		'.xls',
		'.xlsx',
		'.jpg',
		'.jpeg',
		'.png',
		'.gif',
		'.webp',
	] as const,
} as const;

/**
 * Byte conversion constants
 */
export const BYTES = {
	/** Bytes in a kilobyte */
	KB: 1024,
	
	/** Bytes in a megabyte */
	MB: 1024 * 1024,
	
	/** Bytes in a gigabyte */
	GB: 1024 * 1024 * 1024,
} as const;

/**
 * Date and time configuration
 */
export const DATE_CONFIG = {
	/** Default date format for display */
	DEFAULT_DATE_FORMAT: 'dd MMM yyyy',
	
	/** Date format for forms */
	FORM_DATE_FORMAT: 'yyyy-MM-dd',
	
	/** Time format for display */
	DEFAULT_TIME_FORMAT: 'HH:mm',
	
	/** DateTime format for display */
	DEFAULT_DATETIME_FORMAT: 'dd MMM yyyy HH:mm',
	
	/** Locale for date formatting */
	DEFAULT_LOCALE: 'id-ID',
} as const;

/**
 * Validation configuration
 */
export const VALIDATION_CONFIG = {
	/** Minimum password length */
	MIN_PASSWORD_LENGTH: 8,
	
	/** Maximum password length */
	MAX_PASSWORD_LENGTH: 128,
	
	/** Minimum name length */
	MIN_NAME_LENGTH: 2,
	
	/** Maximum name length */
	MAX_NAME_LENGTH: 100,
	
	/** Minimum description length */
	MIN_DESCRIPTION_LENGTH: 2,
	
	/** Maximum description length */
	MAX_DESCRIPTION_LENGTH: 500,
} as const;

/**
 * UI configuration
 */
export const UI_CONFIG = {
	/** Debounce delay for search inputs (ms) */
	SEARCH_DEBOUNCE_MS: 300,
	
	/** Animation duration for transitions (ms) */
	ANIMATION_DURATION_MS: 200,
	
	/** Delay before showing loading indicators (ms) */
	LOADING_DELAY_MS: 500,
	
	/** Mobile breakpoint (px) */
	MOBILE_BREAKPOINT: 768,
	
	/** Tablet breakpoint (px) */
	TABLET_BREAKPOINT: 1024,
	
	/** Desktop breakpoint (px) */
	DESKTOP_BREAKPOINT: 1280,
} as const;

/**
 * Cache configuration
 */
export const CACHE_CONFIG = {
	/** Cache duration for static data (ms) */
	STATIC_CACHE_DURATION_MS: 60 * 60 * 1000, // 1 hour
	
	/** Cache duration for user data (ms) */
	USER_CACHE_DURATION_MS: 5 * 60 * 1000, // 5 minutes
	
	/** Cache duration for dashboard data (ms) */
	DASHBOARD_CACHE_DURATION_MS: 2 * 60 * 1000, // 2 minutes
} as const;

/**
 * API configuration
 */
export const API_CONFIG = {
	/** Request timeout (ms) */
	REQUEST_TIMEOUT_MS: 30000, // 30 seconds
	
	/** Maximum retry attempts for failed requests */
	MAX_RETRY_ATTEMPTS: 3,
	
	/** Delay between retry attempts (ms) */
	RETRY_DELAY_MS: 1000,
	
	/** Exponential backoff multiplier for retries */
	RETRY_BACKOFF_MULTIPLIER: 2,
} as const;

/**
 * Retry configuration for operations
 */
export const RETRY_CONFIG = {
	/** Maximum retry attempts for form submissions */
	MAX_FORM_RETRIES: 3,
	
	/** Maximum retry attempts for file operations */
	MAX_FILE_RETRIES: 3,
	
	/** Delay between retry attempts (ms) */
	RETRY_DELAY_MS: 1000,
} as const;

/**
 * Feature flags
 */
export const FEATURE_FLAGS = {
	/** Enable email verification for new accounts */
	ENABLE_EMAIL_VERIFICATION: false,
	
	/** Enable social login providers */
	ENABLE_SOCIAL_LOGIN: false,
	
	/** Enable file upload to R2 */
	ENABLE_FILE_UPLOAD: true,
	
	/** Enable calendar integration */
	ENABLE_CALENDAR: true,
	
	/** Enable notifications */
	ENABLE_NOTIFICATIONS: false,
} as const;

/**
 * Budget and expense configuration
 */
export const BUDGET_CONFIG = {
	/** Default currency */
	DEFAULT_CURRENCY: 'IDR',
	
	/** Currency symbol */
	CURRENCY_SYMBOL: 'Rp',
	
	/** Number of decimal places for currency */
	CURRENCY_DECIMALS: 0,
	
	/** Minimum budget amount */
	MIN_BUDGET_AMOUNT: 0,
	
	/** Maximum budget amount */
	MAX_BUDGET_AMOUNT: 999999999999,
} as const;

/**
 * Task configuration
 */
export const TASK_CONFIG = {
	/** Days before due date to show "due soon" warning */
	DUE_SOON_DAYS: 7,
	
	/** Days before due date to show urgent warning */
	URGENT_DAYS: 3,
	
	/** Default task priority */
	DEFAULT_PRIORITY: 'medium' as const,
	
	/** Default task status */
	DEFAULT_STATUS: 'pending' as const,
} as const;
