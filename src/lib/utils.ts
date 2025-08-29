import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Snippet } from 'svelte';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// Type utilities for UI components
export type WithElementRef<T extends Record<string, any> = {}> = T & {
	ref?: HTMLElement | null;
};

export type WithoutChildren<T extends Record<string, any> = {}> = Omit<T, 'children'>;

export type WithoutChildrenOrChild<T extends Record<string, any> = {}> = Omit<T, 'children' | 'child'>;

export type WithoutChild<T extends Record<string, any> = {}> = Omit<T, 'child'>;
