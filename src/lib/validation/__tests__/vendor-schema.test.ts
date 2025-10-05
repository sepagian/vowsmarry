import { describe, it, expect } from 'vitest';
import { vendorFormSchema } from '../index.js';

describe('Enhanced Vendor Schema', () => {
	it('should validate correct vendor data with all fields', () => {
		const validData = {
			name: 'Amazing Wedding Photographer',
			category: 'photo-video',
			instagram: '@photographer123',
			email: 'contact@photographer.com',
			phone: '+1234567890',
			website: 'https://photographer.com',
			price: 2500.50,
			rating: '5',
			status: 'contacted',
			notes: 'Great portfolio, responsive communication'
		};

		const result = vendorFormSchema.safeParse(validData);
		expect(result.success).toBe(true);
		
		if (result.success) {
			expect(result.data.name).toBe('Amazing Wedding Photographer');
			expect(result.data.instagram).toBe('@photographer123');
			expect(result.data.email).toBe('contact@photographer.com');
		}
	});

	it('should validate minimal vendor data with only required fields', () => {
		const minimalData = {
			name: 'Minimal Vendor',
			category: 'catering',
			instagram: 'minimal_vendor',
			price: 1000,
			rating: '4',
			status: 'researching'
		};

		const result = vendorFormSchema.safeParse(minimalData);
		expect(result.success).toBe(true);
		
		if (result.success) {
			expect(result.data.instagram).toBe('@minimal_vendor'); // Should add @ prefix
		}
	});

	it('should reject vendor with invalid name (too short)', () => {
		const invalidData = {
			name: 'A', // Too short
			category: 'catering',
			instagram: 'test',
			price: 1000,
			rating: '4',
			status: 'researching'
		};

		const result = vendorFormSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
		
		if (!result.success) {
			const nameError = result.error.issues.find(e => e.path.includes('name'));
			expect(nameError?.message).toContain('at least 2 characters');
		}
	});

	it('should reject vendor with invalid email format', () => {
		const invalidData = {
			name: 'Test Vendor',
			category: 'catering',
			instagram: 'test',
			email: 'invalid-email',
			price: 1000,
			rating: '4',
			status: 'researching'
		};

		const result = vendorFormSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
		
		if (!result.success) {
			const emailError = result.error.issues.find(e => e.path.includes('email'));
			expect(emailError?.message).toContain('valid email address');
		}
	});

	it('should reject vendor with invalid phone format', () => {
		const invalidData = {
			name: 'Test Vendor',
			category: 'catering',
			instagram: 'test',
			phone: 'abc123',
			price: 1000,
			rating: '4',
			status: 'researching'
		};

		const result = vendorFormSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
		
		if (!result.success) {
			const phoneError = result.error.issues.find(e => e.path.includes('phone'));
			expect(phoneError?.message).toContain('valid phone number');
		}
	});

	it('should reject vendor with invalid website URL', () => {
		const invalidData = {
			name: 'Test Vendor',
			category: 'catering',
			instagram: 'test',
			website: 'not-a-url',
			price: 1000,
			rating: '4',
			status: 'researching'
		};

		const result = vendorFormSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
		
		if (!result.success) {
			const websiteError = result.error.issues.find(e => e.path.includes('website'));
			expect(websiteError?.message).toContain('valid website URL');
		}
	});

	it('should reject vendor with invalid Instagram handle', () => {
		const invalidData = {
			name: 'Test Vendor',
			category: 'catering',
			instagram: 'invalid@handle!',
			price: 1000,
			rating: '4',
			status: 'researching'
		};

		const result = vendorFormSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
		
		if (!result.success) {
			const instagramError = result.error.issues.find(e => e.path.includes('instagram'));
			expect(instagramError?.message).toContain('letters, numbers, dots, and underscores');
		}
	});

	it('should reject vendor with invalid price', () => {
		const invalidData = {
			name: 'Test Vendor',
			category: 'catering',
			instagram: 'test',
			price: -100,
			rating: '4',
			status: 'researching'
		};

		const result = vendorFormSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
		
		if (!result.success) {
			const priceError = result.error.issues.find(e => e.path.includes('price'));
			expect(priceError?.message).toContain('greater than 0');
		}
	});

	it('should sanitize text inputs', () => {
		const dataWithHtml = {
			name: 'Test <script>alert("xss")</script> Vendor',
			category: 'catering',
			instagram: 'test',
			price: 1000,
			rating: '4',
			status: 'researching',
			notes: '<p>Some notes with <script>alert("xss")</script> HTML</p>'
		};

		const result = vendorFormSchema.safeParse(dataWithHtml);
		expect(result.success).toBe(true);
		
		if (result.success) {
			// Text should be sanitized
			expect(result.data.name).not.toContain('<script>');
			expect(result.data.notes).not.toContain('<script>');
		}
	});

	it('should handle empty optional fields correctly', () => {
		const dataWithEmptyOptionals = {
			name: 'Test Vendor',
			category: 'catering',
			instagram: 'test',
			email: '',
			phone: '',
			website: '',
			price: 1000,
			rating: '4',
			status: 'researching',
			notes: ''
		};

		const result = vendorFormSchema.safeParse(dataWithEmptyOptionals);
		expect(result.success).toBe(true);
		
		if (result.success) {
			expect(result.data.email).toBe('');
			expect(result.data.phone).toBe('');
			expect(result.data.website).toBe('');
			expect(result.data.notes).toBe('');
		}
	});
});