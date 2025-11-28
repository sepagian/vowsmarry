import { formatDistanceToNow } from 'date-fns';

/**
 * Format a timestamp as a relative time string
 * @param date - ISO date string or timestamp
 * @returns Formatted string like "Last updated 2 hours ago" or "No data yet"
 */
export function formatLastUpdate(date: string | number | null): string {
	return date
		? `Last updated ${formatDistanceToNow(new Date(date), { addSuffix: true })}`
		: 'No data yet';
}

/**
 * Format a number as Indonesian Rupiah currency
 * @param amount - Amount to format
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number): string {
	return amount.toLocaleString('id-ID', {
		style: 'currency',
		currency: 'IDR',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	});
}

/**
 * Calculate days until a future date
 * @param date - Target date
 * @returns Number of days until the date, or null if date is invalid
 */
export function calculateDaysUntil(date: Date | null): number | null {
	if (!date) return null;
	return Math.ceil((date.getTime() - Date.now()) / 86400000);
}
