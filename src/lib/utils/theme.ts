/**
 * Theme Switching Utilities
 * Provides functions for managing light/dark mode theme switching
 * with proper color token integration
 */

import { browser } from '$app/environment';

export type Theme = 'light' | 'dark' | 'system';

/**
 * Get the current theme from localStorage or default to 'system'
 */
export function getStoredTheme(): Theme {
	if (!browser) return 'system';
	
	const stored = localStorage.getItem('theme') as Theme;
	return stored || 'system';
}

/**
 * Store the theme preference in localStorage
 */
export function setStoredTheme(theme: Theme): void {
	if (!browser) return;
	
	localStorage.setItem('theme', theme);
}

/**
 * Get the system's preferred color scheme
 */
export function getSystemTheme(): 'light' | 'dark' {
	if (!browser) return 'light';
	
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Resolve the actual theme to apply based on the theme preference
 */
export function resolveTheme(theme: Theme): 'light' | 'dark' {
	if (theme === 'system') {
		return getSystemTheme();
	}
	return theme;
}

/**
 * Apply the theme to the document
 */
export function applyTheme(theme: 'light' | 'dark'): void {
	if (!browser) return;
	
	const root = document.documentElement;
	
	if (theme === 'dark') {
		root.classList.add('dark');
	} else {
		root.classList.remove('dark');
	}
	
	// Update meta theme-color for mobile browsers
	const metaThemeColor = document.querySelector('meta[name="theme-color"]');
	if (metaThemeColor) {
		const themeColor = theme === 'dark' 
			? 'oklch(14% 0.005 285.823)' // Dark base color
			: 'oklch(98% 0 0)'; // Light base color
		metaThemeColor.setAttribute('content', themeColor);
	}
}

/**
 * Set the theme and apply it immediately
 */
export function setTheme(theme: Theme): void {
	setStoredTheme(theme);
	const resolvedTheme = resolveTheme(theme);
	applyTheme(resolvedTheme);
}

/**
 * Initialize theme on page load
 */
export function initializeTheme(): (() => void) | void {
	if (!browser) return;
	
	const storedTheme = getStoredTheme();
	const resolvedTheme = resolveTheme(storedTheme);
	applyTheme(resolvedTheme);
	
	// Listen for system theme changes when using 'system' preference
	if (storedTheme === 'system') {
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		const handleSystemThemeChange = (e: MediaQueryListEvent) => {
			if (getStoredTheme() === 'system') {
				applyTheme(e.matches ? 'dark' : 'light');
			}
		};
		
		mediaQuery.addEventListener('change', handleSystemThemeChange);
		
		// Return cleanup function
		return () => {
			mediaQuery.removeEventListener('change', handleSystemThemeChange);
		};
	}
}

/**
 * Toggle between light and dark themes
 */
export function toggleTheme(): void {
	const currentTheme = getStoredTheme();
	const resolvedTheme = resolveTheme(currentTheme);
	const newTheme = resolvedTheme === 'light' ? 'dark' : 'light';
	setTheme(newTheme);
}

/**
 * Get the current resolved theme
 */
export function getCurrentTheme(): 'light' | 'dark' {
	const storedTheme = getStoredTheme();
	return resolveTheme(storedTheme);
}

/**
 * Check if dark mode is currently active
 */
export function isDarkMode(): boolean {
	return getCurrentTheme() === 'dark';
}

/**
 * Svelte store for reactive theme management
 */
import { writable } from 'svelte/store';

function createThemeStore() {
	const { subscribe, set, update } = writable<Theme>('system');
	
	return {
		subscribe,
		set: (theme: Theme) => {
			setTheme(theme);
			set(theme);
		},
		toggle: () => {
			update(current => {
				const resolved = resolveTheme(current);
				const newTheme = resolved === 'light' ? 'dark' : 'light';
				setTheme(newTheme);
				return newTheme;
			});
		},
		init: () => {
			const stored = getStoredTheme();
			set(stored);
			initializeTheme();
		}
	};
}

export const themeStore = createThemeStore();