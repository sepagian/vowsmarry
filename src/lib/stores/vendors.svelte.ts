import type { Vendor, VendorStatus } from '$lib/types';
import { SvelteMap } from 'svelte/reactivity';
import { BaseStore } from './base-store.svelte';

/**
 * Svelte 5 runes-based vendor state management
 */
class VendorsState extends BaseStore<Vendor> {
	/**
	 * Alias for items to maintain backward compatibility
	 */
	get vendors(): Vendor[] {
		return this.items;
	}

	/**
	 * Get vendors by status
	 */
	get researching(): Vendor[] {
		return this.vendors.filter((v) => v.vendorStatus === 'researching');
	}

	get contacted(): Vendor[] {
		return this.vendors.filter((v) => v.vendorStatus === 'contacted');
	}

	get quoted(): Vendor[] {
		return this.vendors.filter((v) => v.vendorStatus === 'quoted');
	}

	get booked(): Vendor[] {
		return this.vendors.filter((v) => v.vendorStatus === 'booked');
	}

	/**
	 * Get vendors by rating
	 */
	get highRated(): Vendor[] {
		return this.vendors.filter((v) => parseInt(v.vendorRating) >= 4);
	}

	/**
	 * Get statistics
	 */
	override get stats() {
		return {
			...super.stats,
			researching: this.researching.length,
			contacted: this.contacted.length,
			quoted: this.quoted.length,
			booked: this.booked.length,
			highRated: this.highRated.length,
		};
	}

	/**
	 * Group vendors by category
	 */
	get byCategory() {
		const grouped = new SvelteMap<string, Vendor[]>();
		for (const vendor of this.vendors) {
			const category = vendor.vendorCategory;
			if (!grouped.has(category)) {
				grouped.set(category, []);
			}
			grouped.get(category)!.push(vendor);
		}
		return grouped;
	}

	/**
	 * Filter by status
	 */
	filterByStatus(status: VendorStatus): Vendor[] {
		return this.vendors.filter((v) => v.vendorStatus === status);
	}
}

/**
 * Global vendors state instance
 */
export const vendorsState = new VendorsState();
