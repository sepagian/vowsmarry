/**
 * Form utility helpers for creating and managing FormData objects
 */

/**
 * Options for FormData creation
 */
interface CreateFormDataOptions {
	/**
	 * Whether to skip null values (default: true)
	 */
	skipNull?: boolean;
	
	/**
	 * Whether to skip undefined values (default: true)
	 */
	skipUndefined?: boolean;
	
	/**
	 * Whether to convert values to strings (default: true for non-File objects)
	 */
	stringify?: boolean;
}

/**
 * Create a FormData object from a plain object
 * 
 * Handles various data types:
 * - File objects: Appended directly
 * - Arrays: Each item appended with the same key
 * - null/undefined: Skipped by default (configurable)
 * - Other values: Converted to strings
 * 
 * @param data - Object with key-value pairs to convert to FormData
 * @param options - Configuration options
 * @returns FormData object ready for submission
 * 
 * @example
 * ```typescript
 * // Simple usage
 * const formData = createFormData({
 *   id: '123',
 *   name: 'John Doe',
 *   age: 30
 * });
 * 
 * // With file
 * const formData = createFormData({
 *   id: '123',
 *   avatar: fileObject,
 *   name: 'John Doe'
 * });
 * 
 * // With arrays
 * const formData = createFormData({
 *   id: '123',
 *   tags: ['tag1', 'tag2', 'tag3']
 * });
 * 
 * // With options
 * const formData = createFormData(
 *   { id: '123', name: null, age: undefined },
 *   { skipNull: false, skipUndefined: true }
 * );
 * ```
 */
export function createFormData(
	data: Record<string, unknown>,
	options: CreateFormDataOptions = {}
): FormData {
	const {
		skipNull = true,
		skipUndefined = true,
		stringify = true,
	} = options;
	
	const formData = new FormData();
	
	Object.entries(data).forEach(([key, value]) => {
		// Skip null values if configured
		if (value === null && skipNull) {
			return;
		}
		
		// Skip undefined values if configured
		if (value === undefined && skipUndefined) {
			return;
		}
		
		// Handle File objects
		if (value instanceof File) {
			formData.append(key, value);
			return;
		}
		
		// Handle Blob objects
		if (value instanceof Blob) {
			formData.append(key, value);
			return;
		}
		
		// Handle arrays
		if (Array.isArray(value)) {
			value.forEach((item) => {
				if (item instanceof File || item instanceof Blob) {
					formData.append(key, item);
				} else if (item !== null && item !== undefined) {
					formData.append(key, stringify ? String(item) : item);
				}
			});
			return;
		}
		
		// Handle other values (including null if skipNull is false)
		formData.append(key, stringify ? String(value) : (value as string | Blob));
	});
	
	return formData;
}

/**
 * Create FormData with an ID field (common pattern for updates/deletes)
 * 
 * @param id - Entity ID
 * @param data - Additional data to include (optional)
 * @param options - Configuration options
 * @returns FormData object with ID and additional data
 * 
 * @example
 * ```typescript
 * // For delete operations
 * const formData = createFormDataWithId('task-123');
 * 
 * // For update operations
 * const formData = createFormDataWithId('task-123', {
 *   status: 'completed',
 *   priority: 'high'
 * });
 * ```
 */
export function createFormDataWithId(
	id: string,
	data?: Record<string, unknown>,
	options?: CreateFormDataOptions
): FormData {
	return createFormData({ id, ...data }, options);
}

/**
 * Append a value to existing FormData (helper for conditional appends)
 * 
 * @param formData - Existing FormData object
 * @param key - Field key
 * @param value - Field value
 * @param condition - Whether to append (default: true)
 * 
 * @example
 * ```typescript
 * const formData = new FormData();
 * appendIf(formData, 'name', userName, !!userName);
 * appendIf(formData, 'email', userEmail, isEmailValid);
 * ```
 */
export function appendIf(
	formData: FormData,
	key: string,
	value: string | Blob,
	condition = true
): void {
	if (condition) {
		formData.append(key, value);
	}
}

/**
 * Convert FormData to a plain object (useful for debugging)
 * 
 * @param formData - FormData object to convert
 * @returns Plain object with FormData entries
 * 
 * @example
 * ```typescript
 * const formData = createFormData({ id: '123', name: 'John' });
 * const obj = formDataToObject(formData);
 * console.log(obj); // { id: '123', name: 'John' }
 * ```
 */
export function formDataToObject(formData: FormData): Record<string, unknown> {
	const obj: Record<string, unknown> = {};
	
	formData.forEach((value, key) => {
		// Handle multiple values with the same key
		if (obj[key] !== undefined) {
			if (Array.isArray(obj[key])) {
				(obj[key] as unknown[]).push(value);
			} else {
				obj[key] = [obj[key], value];
			}
		} else {
			obj[key] = value;
		}
	});
	
	return obj;
}

/**
 * Type-safe FormData parser with validation
 * 
 * Provides methods to safely extract and validate form data values
 * with proper TypeScript types and runtime validation.
 * 
 * @example
 * ```typescript
 * const parser = new FormDataParser(await request.formData());
 * const taskId = parser.getString('id');
 * const status = parser.getEnum('status', ['pending', 'completed'] as const);
 * const priority = parser.getOptionalString('priority');
 * ```
 */
export class FormDataParser {
	constructor(private formData: FormData) {}
	
	/**
	 * Get a required string value
	 * @throws Error if value is missing or empty
	 */
	getString(key: string): string {
		const value = this.formData.get(key);
		if (!value || typeof value !== 'string') {
			throw new Error(`Missing or invalid required field: ${key}`);
		}
		return value.trim();
	}
	
	/**
	 * Get an optional string value
	 * @returns string or undefined if not present
	 */
	getOptionalString(key: string): string | undefined {
		const value = this.formData.get(key);
		if (!value || typeof value !== 'string') {
			return undefined;
		}
		const trimmed = value.trim();
		return trimmed.length > 0 ? trimmed : undefined;
	}
	
	/**
	 * Get a required enum value
	 * @throws Error if value is not one of the allowed values
	 */
	getEnum<T extends readonly string[]>(
		key: string,
		allowedValues: T
	): T[number] {
		const value = this.getString(key);
		if (!allowedValues.includes(value)) {
			throw new Error(
				`Invalid value for ${key}: ${value}. Must be one of: ${allowedValues.join(', ')}`
			);
		}
		return value as T[number];
	}
	
	/**
	 * Get an optional enum value
	 * @returns enum value or undefined if not present
	 */
	getOptionalEnum<T extends readonly string[]>(
		key: string,
		allowedValues: T
	): T[number] | undefined {
		const value = this.getOptionalString(key);
		if (!value) {
			return undefined;
		}
		if (!allowedValues.includes(value)) {
			throw new Error(
				`Invalid value for ${key}: ${value}. Must be one of: ${allowedValues.join(', ')}`
			);
		}
		return value as T[number];
	}
	
	/**
	 * Get a required number value
	 * @throws Error if value is missing or not a valid number
	 */
	getNumber(key: string): number {
		const value = this.getString(key);
		const num = Number(value);
		if (isNaN(num)) {
			throw new Error(`Invalid number for ${key}: ${value}`);
		}
		return num;
	}
	
	/**
	 * Get an optional number value
	 * @returns number or undefined if not present
	 */
	getOptionalNumber(key: string): number | undefined {
		const value = this.getOptionalString(key);
		if (!value) {
			return undefined;
		}
		const num = Number(value);
		if (isNaN(num)) {
			throw new Error(`Invalid number for ${key}: ${value}`);
		}
		return num;
	}
	
	/**
	 * Get a required boolean value
	 * Accepts: 'true', 'false', '1', '0', 'on', 'off'
	 */
	getBoolean(key: string): boolean {
		const value = this.getString(key).toLowerCase();
		if (['true', '1', 'on'].includes(value)) {
			return true;
		}
		if (['false', '0', 'off'].includes(value)) {
			return false;
		}
		throw new Error(`Invalid boolean for ${key}: ${value}`);
	}
	
	/**
	 * Get an optional boolean value
	 */
	getOptionalBoolean(key: string): boolean | undefined {
		const value = this.getOptionalString(key);
		if (!value) {
			return undefined;
		}
		const lower = value.toLowerCase();
		if (['true', '1', 'on'].includes(lower)) {
			return true;
		}
		if (['false', '0', 'off'].includes(lower)) {
			return false;
		}
		throw new Error(`Invalid boolean for ${key}: ${value}`);
	}
	
	/**
	 * Get a File object
	 * @throws Error if value is not a File
	 */
	getFile(key: string): File {
		const value = this.formData.get(key);
		if (!(value instanceof File)) {
			throw new Error(`Missing or invalid file: ${key}`);
		}
		return value;
	}
	
	/**
	 * Get an optional File object
	 */
	getOptionalFile(key: string): File | undefined {
		const value = this.formData.get(key);
		if (!value || !(value instanceof File)) {
			return undefined;
		}
		return value;
	}
	
	/**
	 * Get all values for a key (useful for arrays)
	 */
	getAll(key: string): FormDataEntryValue[] {
		return this.formData.getAll(key);
	}
	
	/**
	 * Check if a key exists in the FormData
	 */
	has(key: string): boolean {
		return this.formData.has(key);
	}
}
