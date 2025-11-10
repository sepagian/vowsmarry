import { describe, it, expect } from 'vitest';
import { documentFormSchema } from '../index.js';

describe('Enhanced Document Schema', () => {
	const today = new Date();
	const validDocumentData = {
		name: 'Marriage Certificate',
		category: 'paperwork',
		file: [new File(['test content'], 'test.pdf', { type: 'application/pdf' })],
		date: today,
		expiryDate: new Date(today.getTime() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
		description: 'Official marriage certificate from city hall',
	};

	it('should validate correct document data', () => {
		const result = documentFormSchema.safeParse(validDocumentData);
		expect(result.success).toBe(true);
	});

	it('should reject files that are too large', () => {
		const largeFile = new File(['x'.repeat(11_000_000)], 'large.pdf', { type: 'application/pdf' });
		const invalidData = {
			...validDocumentData,
			file: [largeFile],
		};

		const result = documentFormSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toContain('File size must be less than 10MB');
		}
	});

	it('should reject invalid file types', () => {
		const invalidFile = new File(['test'], 'test.txt', { type: 'text/plain' });
		const invalidData = {
			...validDocumentData,
			file: [invalidFile],
		};

		const result = documentFormSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toContain('Only PDF, JPEG, and PNG files are allowed');
		}
	});

	it('should reject dates outside valid range', () => {
		const tooOldDate = new Date();
		tooOldDate.setFullYear(tooOldDate.getFullYear() - 2); // 2 years ago
		const invalidData = {
			...validDocumentData,
			date: tooOldDate,
		};

		const result = documentFormSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toContain(
				'Document date must be within the last year',
			);
		}
	});

	it('should reject expiry date before document date', () => {
		const docDate = new Date();
		const expiryDate = new Date(docDate.getTime() - 24 * 60 * 60 * 1000); // 1 day before
		const invalidData = {
			...validDocumentData,
			date: docDate,
			expiryDate: expiryDate,
		};

		const result = documentFormSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
		if (!result.success) {
			const expiryError = result.error.issues.find((issue) => issue.path.includes('expiryDate'));
			expect(expiryError?.message).toBe('Expiry date must be after the document date');
		}
	});

	it('should accept valid JPEG files', () => {
		const jpegFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
		const validData = {
			...validDocumentData,
			file: [jpegFile],
		};

		const result = documentFormSchema.safeParse(validData);
		expect(result.success).toBe(true);
	});

	it('should accept valid PNG files', () => {
		const pngFile = new File(['test'], 'test.png', { type: 'image/png' });
		const validData = {
			...validDocumentData,
			file: [pngFile],
		};

		const result = documentFormSchema.safeParse(validData);
		expect(result.success).toBe(true);
	});

	it('should sanitize document name', () => {
		const dataWithHtml = {
			...validDocumentData,
			name: '<script>alert("xss")</script>Marriage Certificate',
		};

		const result = documentFormSchema.safeParse(dataWithHtml);
		expect(result.success).toBe(true);
		if (result.success) {
			// sanitizeText removes HTML tags but keeps the content
			expect(result.data.name).toBe('alert("xss")Marriage Certificate');
			// The important thing is that the script tags are removed
			expect(result.data.name).not.toContain('<script>');
			expect(result.data.name).not.toContain('</script>');
		}
	});

	it('should sanitize description', () => {
		const dataWithHtml = {
			...validDocumentData,
			description: '<script>alert("xss")</script>Official certificate',
		};

		const result = documentFormSchema.safeParse(dataWithHtml);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.description).toBe('Official certificate');
		}
	});

	it('should reject file names that are too long', () => {
		const longFileName = 'a'.repeat(300) + '.pdf';
		const longNameFile = new File(['test'], longFileName, { type: 'application/pdf' });
		const invalidData = {
			...validDocumentData,
			file: [longNameFile],
		};

		const result = documentFormSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toContain('File name is too long');
		}
	});

	it('should require at least one file', () => {
		const invalidData = {
			...validDocumentData,
			file: [],
		};

		const result = documentFormSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toContain('Please upload a file');
		}
	});

	it('should reject multiple files', () => {
		const file1 = new File(['test1'], 'test1.pdf', { type: 'application/pdf' });
		const file2 = new File(['test2'], 'test2.pdf', { type: 'application/pdf' });
		const invalidData = {
			...validDocumentData,
			file: [file1, file2],
		};

		const result = documentFormSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toContain('Please upload only one file at a time');
		}
	});
});
