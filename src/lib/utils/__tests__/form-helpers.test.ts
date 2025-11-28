import { describe, it, expect } from 'vitest';
import {
	createFormData,
	createFormDataWithId,
	appendIf,
	formDataToObject,
	FormDataParser,
} from '../form-helpers';

describe('createFormData', () => {
	it('should create FormData from simple object', () => {
		const data = {
			name: 'John Doe',
			age: 30,
			email: 'john@example.com',
		};

		const formData = createFormData(data);
		
		expect(formData.get('name')).toBe('John Doe');
		expect(formData.get('age')).toBe('30');
		expect(formData.get('email')).toBe('john@example.com');
	});

	it('should skip null values by default', () => {
		const data = {
			name: 'John',
			email: null,
		};

		const formData = createFormData(data);
		
		expect(formData.get('name')).toBe('John');
		expect(formData.has('email')).toBe(false);
	});

	it('should skip undefined values by default', () => {
		const data = {
			name: 'John',
			email: undefined,
		};

		const formData = createFormData(data);
		
		expect(formData.get('name')).toBe('John');
		expect(formData.has('email')).toBe(false);
	});

	it('should include null values when skipNull is false', () => {
		const data = {
			name: 'John',
			email: null,
		};

		const formData = createFormData(data, { skipNull: false });
		
		expect(formData.get('name')).toBe('John');
		expect(formData.get('email')).toBe('null');
	});

	it('should handle File objects', () => {
		const file = new File(['content'], 'test.txt', { type: 'text/plain' });
		const data = {
			name: 'John',
			avatar: file,
		};

		const formData = createFormData(data);
		
		expect(formData.get('name')).toBe('John');
		expect(formData.get('avatar')).toBeInstanceOf(File);
		expect((formData.get('avatar') as File).name).toBe('test.txt');
	});

	it('should handle arrays', () => {
		const data = {
			name: 'John',
			tags: ['tag1', 'tag2', 'tag3'],
		};

		const formData = createFormData(data);
		
		expect(formData.get('name')).toBe('John');
		expect(formData.getAll('tags')).toEqual(['tag1', 'tag2', 'tag3']);
	});

	it('should handle arrays with File objects', () => {
		const file1 = new File(['content1'], 'test1.txt', { type: 'text/plain' });
		const file2 = new File(['content2'], 'test2.txt', { type: 'text/plain' });
		const data = {
			name: 'John',
			files: [file1, file2],
		};

		const formData = createFormData(data);
		
		expect(formData.get('name')).toBe('John');
		const files = formData.getAll('files');
		expect(files).toHaveLength(2);
		expect(files[0]).toBeInstanceOf(File);
		expect((files[0] as File).name).toBe('test1.txt');
	});

	it('should handle boolean values', () => {
		const data = {
			name: 'John',
			active: true,
			verified: false,
		};

		const formData = createFormData(data);
		
		expect(formData.get('active')).toBe('true');
		expect(formData.get('verified')).toBe('false');
	});

	it('should handle number values', () => {
		const data = {
			age: 30,
			price: 99.99,
			count: 0,
		};

		const formData = createFormData(data);
		
		expect(formData.get('age')).toBe('30');
		expect(formData.get('price')).toBe('99.99');
		expect(formData.get('count')).toBe('0');
	});
});

describe('createFormDataWithId', () => {
	it('should create FormData with ID only', () => {
		const formData = createFormDataWithId('task-123');
		
		expect(formData.get('id')).toBe('task-123');
	});

	it('should create FormData with ID and additional data', () => {
		const formData = createFormDataWithId('task-123', {
			status: 'completed',
			priority: 'high',
		});
		
		expect(formData.get('id')).toBe('task-123');
		expect(formData.get('status')).toBe('completed');
		expect(formData.get('priority')).toBe('high');
	});

	it('should handle empty additional data', () => {
		const formData = createFormDataWithId('task-123', {});
		
		expect(formData.get('id')).toBe('task-123');
	});
});

describe('appendIf', () => {
	it('should append value when condition is true', () => {
		const formData = new FormData();
		appendIf(formData, 'name', 'John', true);
		
		expect(formData.get('name')).toBe('John');
	});

	it('should not append value when condition is false', () => {
		const formData = new FormData();
		appendIf(formData, 'name', 'John', false);
		
		expect(formData.has('name')).toBe(false);
	});

	it('should append value when condition is omitted (default true)', () => {
		const formData = new FormData();
		appendIf(formData, 'name', 'John');
		
		expect(formData.get('name')).toBe('John');
	});

	it('should handle File objects', () => {
		const file = new File(['content'], 'test.txt', { type: 'text/plain' });
		const formData = new FormData();
		appendIf(formData, 'file', file, true);
		
		expect(formData.get('file')).toBeInstanceOf(File);
	});
});

describe('formDataToObject', () => {
	it('should convert FormData to plain object', () => {
		const formData = new FormData();
		formData.append('name', 'John');
		formData.append('age', '30');
		formData.append('email', 'john@example.com');
		
		const obj = formDataToObject(formData);
		
		expect(obj).toEqual({
			name: 'John',
			age: '30',
			email: 'john@example.com',
		});
	});

	it('should handle multiple values with same key as array', () => {
		const formData = new FormData();
		formData.append('name', 'John');
		formData.append('tags', 'tag1');
		formData.append('tags', 'tag2');
		formData.append('tags', 'tag3');
		
		const obj = formDataToObject(formData);
		
		expect(obj.name).toBe('John');
		expect(obj.tags).toEqual(['tag1', 'tag2', 'tag3']);
	});

	it('should handle File objects', () => {
		const file = new File(['content'], 'test.txt', { type: 'text/plain' });
		const formData = new FormData();
		formData.append('name', 'John');
		formData.append('file', file);
		
		const obj = formDataToObject(formData);
		
		expect(obj.name).toBe('John');
		expect(obj.file).toBeInstanceOf(File);
	});

	it('should handle empty FormData', () => {
		const formData = new FormData();
		const obj = formDataToObject(formData);
		
		expect(obj).toEqual({});
	});
});


describe('FormDataParser', () => {
	describe('getString', () => {
		it('should get required string value', () => {
			const formData = new FormData();
			formData.append('name', 'John Doe');
			
			const parser = new FormDataParser(formData);
			expect(parser.getString('name')).toBe('John Doe');
		});

		it('should trim string values', () => {
			const formData = new FormData();
			formData.append('name', '  John Doe  ');
			
			const parser = new FormDataParser(formData);
			expect(parser.getString('name')).toBe('John Doe');
		});

		it('should throw error for missing value', () => {
			const formData = new FormData();
			const parser = new FormDataParser(formData);
			
			expect(() => parser.getString('name')).toThrow('Missing or invalid required field: name');
		});
	});

	describe('getOptionalString', () => {
		it('should get optional string value', () => {
			const formData = new FormData();
			formData.append('name', 'John');
			
			const parser = new FormDataParser(formData);
			expect(parser.getOptionalString('name')).toBe('John');
		});

		it('should return undefined for missing value', () => {
			const formData = new FormData();
			const parser = new FormDataParser(formData);
			
			expect(parser.getOptionalString('name')).toBeUndefined();
		});

		it('should return undefined for empty string', () => {
			const formData = new FormData();
			formData.append('name', '   ');
			
			const parser = new FormDataParser(formData);
			expect(parser.getOptionalString('name')).toBeUndefined();
		});
	});

	describe('getEnum', () => {
		it('should get valid enum value', () => {
			const formData = new FormData();
			formData.append('status', 'completed');
			
			const parser = new FormDataParser(formData);
			const status = parser.getEnum('status', ['pending', 'completed'] as const);
			
			expect(status).toBe('completed');
		});

		it('should throw error for invalid enum value', () => {
			const formData = new FormData();
			formData.append('status', 'invalid');
			
			const parser = new FormDataParser(formData);
			
			expect(() => parser.getEnum('status', ['pending', 'completed'] as const))
				.toThrow('Invalid value for status: invalid');
		});
	});

	describe('getOptionalEnum', () => {
		it('should get valid optional enum value', () => {
			const formData = new FormData();
			formData.append('status', 'completed');
			
			const parser = new FormDataParser(formData);
			const status = parser.getOptionalEnum('status', ['pending', 'completed'] as const);
			
			expect(status).toBe('completed');
		});

		it('should return undefined for missing value', () => {
			const formData = new FormData();
			const parser = new FormDataParser(formData);
			
			expect(parser.getOptionalEnum('status', ['pending', 'completed'] as const)).toBeUndefined();
		});
	});

	describe('getNumber', () => {
		it('should get valid number', () => {
			const formData = new FormData();
			formData.append('age', '30');
			
			const parser = new FormDataParser(formData);
			expect(parser.getNumber('age')).toBe(30);
		});

		it('should handle decimal numbers', () => {
			const formData = new FormData();
			formData.append('price', '99.99');
			
			const parser = new FormDataParser(formData);
			expect(parser.getNumber('price')).toBe(99.99);
		});

		it('should throw error for invalid number', () => {
			const formData = new FormData();
			formData.append('age', 'not-a-number');
			
			const parser = new FormDataParser(formData);
			expect(() => parser.getNumber('age')).toThrow('Invalid number for age');
		});
	});

	describe('getOptionalNumber', () => {
		it('should get valid optional number', () => {
			const formData = new FormData();
			formData.append('age', '30');
			
			const parser = new FormDataParser(formData);
			expect(parser.getOptionalNumber('age')).toBe(30);
		});

		it('should return undefined for missing value', () => {
			const formData = new FormData();
			const parser = new FormDataParser(formData);
			
			expect(parser.getOptionalNumber('age')).toBeUndefined();
		});
	});

	describe('getBoolean', () => {
		it('should parse true values', () => {
			const formData = new FormData();
			const parser = new FormDataParser(formData);
			
			formData.set('active', 'true');
			expect(parser.getBoolean('active')).toBe(true);
			
			formData.set('active', '1');
			expect(parser.getBoolean('active')).toBe(true);
			
			formData.set('active', 'on');
			expect(parser.getBoolean('active')).toBe(true);
		});

		it('should parse false values', () => {
			const formData = new FormData();
			const parser = new FormDataParser(formData);
			
			formData.set('active', 'false');
			expect(parser.getBoolean('active')).toBe(false);
			
			formData.set('active', '0');
			expect(parser.getBoolean('active')).toBe(false);
			
			formData.set('active', 'off');
			expect(parser.getBoolean('active')).toBe(false);
		});

		it('should throw error for invalid boolean', () => {
			const formData = new FormData();
			formData.append('active', 'maybe');
			
			const parser = new FormDataParser(formData);
			expect(() => parser.getBoolean('active')).toThrow('Invalid boolean for active');
		});
	});

	describe('getFile', () => {
		it('should get File object', () => {
			const file = new File(['content'], 'test.txt', { type: 'text/plain' });
			const formData = new FormData();
			formData.append('file', file);
			
			const parser = new FormDataParser(formData);
			const result = parser.getFile('file');
			
			expect(result).toBeInstanceOf(File);
			expect(result.name).toBe('test.txt');
		});

		it('should throw error for missing file', () => {
			const formData = new FormData();
			const parser = new FormDataParser(formData);
			
			expect(() => parser.getFile('file')).toThrow('Missing or invalid file: file');
		});
	});

	describe('getOptionalFile', () => {
		it('should get optional File object', () => {
			const file = new File(['content'], 'test.txt', { type: 'text/plain' });
			const formData = new FormData();
			formData.append('file', file);
			
			const parser = new FormDataParser(formData);
			const result = parser.getOptionalFile('file');
			
			expect(result).toBeInstanceOf(File);
		});

		it('should return undefined for missing file', () => {
			const formData = new FormData();
			const parser = new FormDataParser(formData);
			
			expect(parser.getOptionalFile('file')).toBeUndefined();
		});
	});

	describe('getAll', () => {
		it('should get all values for a key', () => {
			const formData = new FormData();
			formData.append('tags', 'tag1');
			formData.append('tags', 'tag2');
			formData.append('tags', 'tag3');
			
			const parser = new FormDataParser(formData);
			expect(parser.getAll('tags')).toEqual(['tag1', 'tag2', 'tag3']);
		});
	});

	describe('has', () => {
		it('should check if key exists', () => {
			const formData = new FormData();
			formData.append('name', 'John');
			
			const parser = new FormDataParser(formData);
			expect(parser.has('name')).toBe(true);
			expect(parser.has('email')).toBe(false);
		});
	});
});
