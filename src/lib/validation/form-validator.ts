import { z } from 'zod';
import { ValidationError } from '$lib/errors';

export interface ValidationResult {
	success: boolean;
	data?: any;
	errors?: Record<string, string>;
	error?: ValidationError;
}

export interface FieldValidationResult {
	isValid: boolean;
	error?: string;
}

export class FormValidator {
	/**
	 * Validate a single field against a schema
	 */
	static validateField<T>(
		schema: z.ZodSchema<T>,
		fieldName: string,
		value: any
	): FieldValidationResult {
		try {
			// For field validation, we'll validate the entire object but only return field-specific errors
			const testData = { [fieldName]: value };
			schema.parse(testData);
			return { isValid: true };
		} catch (error) {
			if (error instanceof z.ZodError) {
				const fieldError = error.issues.find(err => 
					err.path.length > 0 && err.path[0] === fieldName
				);
				return {
					isValid: false,
					error: fieldError?.message || 'Invalid input'
				};
			}
			return {
				isValid: false,
				error: 'Validation error'
			};
		}
	}

	/**
	 * Validate an entire form against a schema
	 */
	static validateForm<T>(
		schema: z.ZodSchema<T>,
		data: any
	): ValidationResult {
		try {
			const validatedData = schema.parse(data);
			return {
				success: true,
				data: validatedData
			};
		} catch (error) {
			if (error instanceof z.ZodError) {
				const errors: Record<string, string> = {};
				
				error.issues.forEach((err) => {
					const path = err.path.join('.');
					if (!errors[path]) {
						errors[path] = err.message;
					}
				});

				const validationError = ValidationError.fromZodError(error);
				
				return {
					success: false,
					errors,
					error: validationError
				};
			}
			
			return {
				success: false,
				errors: { _form: 'Validation failed' },
				error: new ValidationError('Validation failed')
			};
		}
	}

	/**
	 * Validate form data partially (useful for real-time validation)
	 */
	static validatePartial<T>(
		schema: z.ZodSchema<T>,
		data: Partial<any>
	): ValidationResult {
		try {
			// For partial validation, we'll use a more lenient approach
			// Just validate the fields that are present
			const validatedData = schema.parse(data);
			return {
				success: true,
				data: validatedData
			};
		} catch (error) {
			if (error instanceof z.ZodError) {
				const errors: Record<string, string> = {};
				
				error.issues.forEach((err) => {
					const path = err.path.join('.');
					if (!errors[path]) {
						errors[path] = err.message;
					}
				});

				return {
					success: false,
					errors
				};
			}
			
			return {
				success: false,
				errors: { _form: 'Validation failed' }
			};
		}
	}

	/**
	 * Sanitize form data by removing undefined/null values
	 */
	static sanitizeFormData(data: Record<string, any>): Record<string, any> {
		const sanitized: Record<string, any> = {};
		
		for (const [key, value] of Object.entries(data)) {
			if (value !== undefined && value !== null && value !== '') {
				sanitized[key] = value;
			}
		}
		
		return sanitized;
	}

	/**
	 * Convert FormData to plain object
	 */
	static formDataToObject(formData: FormData): Record<string, any> {
		const obj: Record<string, any> = {};
		
		for (const [key, value] of formData.entries()) {
			if (obj[key]) {
				// Handle multiple values (arrays)
				if (Array.isArray(obj[key])) {
					obj[key].push(value);
				} else {
					obj[key] = [obj[key], value];
				}
			} else {
				obj[key] = value;
			}
		}
		
		return obj;
	}

	/**
	 * Validate file uploads
	 */
	static validateFile(
		file: File,
		options: {
			maxSize?: number;
			allowedTypes?: string[];
			required?: boolean;
		} = {}
	): FieldValidationResult {
		const {
			maxSize = 10 * 1024 * 1024, // 10MB default
			allowedTypes = [],
			required = false
		} = options;

		if (required && !file) {
			return {
				isValid: false,
				error: 'File is required'
			};
		}

		if (!file) {
			return { isValid: true };
		}

		if (file.size > maxSize) {
			const maxSizeMB = Math.round(maxSize / (1024 * 1024));
			return {
				isValid: false,
				error: `File size must be less than ${maxSizeMB}MB`
			};
		}

		if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
			return {
				isValid: false,
				error: `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`
			};
		}

		return { isValid: true };
	}

	/**
	 * Validate multiple files
	 */
	static validateFiles(
		files: FileList | File[],
		options: {
			maxSize?: number;
			allowedTypes?: string[];
			maxCount?: number;
			required?: boolean;
		} = {}
	): FieldValidationResult {
		const {
			maxCount = 10,
			required = false
		} = options;

		const fileArray = Array.isArray(files) ? files : Array.from(files);

		if (required && fileArray.length === 0) {
			return {
				isValid: false,
				error: 'At least one file is required'
			};
		}

		if (fileArray.length > maxCount) {
			return {
				isValid: false,
				error: `Maximum ${maxCount} files allowed`
			};
		}

		// Validate each file
		for (const file of fileArray) {
			const fileValidation = this.validateFile(file, options);
			if (!fileValidation.isValid) {
				return fileValidation;
			}
		}

		return { isValid: true };
	}

	/**
	 * Create a debounced validator for real-time validation
	 */
	static createDebouncedValidator<T>(
		schema: z.ZodSchema<T>,
		callback: (result: ValidationResult) => void,
		delay: number = 300
	) {
		let timeoutId: NodeJS.Timeout;

		return (data: any) => {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => {
				const result = this.validatePartial(schema, data);
				callback(result);
			}, delay);
		};
	}

	/**
	 * Extract error message for a specific field
	 */
	static getFieldError(
		errors: Record<string, string> | undefined,
		fieldName: string
	): string | undefined {
		if (!errors) return undefined;
		return errors[fieldName];
	}

	/**
	 * Check if form has any errors
	 */
	static hasErrors(errors: Record<string, string> | undefined): boolean {
		if (!errors) return false;
		return Object.keys(errors).length > 0;
	}

	/**
	 * Get first error message (useful for general form errors)
	 */
	static getFirstError(errors: Record<string, string> | undefined): string | undefined {
		if (!errors) return undefined;
		const firstKey = Object.keys(errors)[0];
		return firstKey ? errors[firstKey] : undefined;
	}

	/**
	 * Merge validation errors from multiple sources
	 */
	static mergeErrors(
		...errorObjects: (Record<string, string> | undefined)[]
	): Record<string, string> {
		const merged: Record<string, string> = {};
		
		for (const errors of errorObjects) {
			if (errors) {
				Object.assign(merged, errors);
			}
		}
		
		return merged;
	}
}

// Export convenience functions
export const {
	validateField,
	validateForm,
	validatePartial,
	sanitizeFormData,
	formDataToObject,
	validateFile,
	validateFiles,
	createDebouncedValidator,
	getFieldError,
	hasErrors,
	getFirstError,
	mergeErrors
} = FormValidator;