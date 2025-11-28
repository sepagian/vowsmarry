/**
 * Parse user's full name into first and last name components
 * Splits on spaces and treats first word as first name, rest as last name
 * 
 * @param name - Full name string to parse
 * @returns Object with firstName and lastName properties
 * 
 * @example
 * ```typescript
 * parseUserName('John Doe') // { firstName: 'John', lastName: 'Doe' }
 * parseUserName('Mary Jane Watson') // { firstName: 'Mary', lastName: 'Jane Watson' }
 * parseUserName(null) // { firstName: '', lastName: '' }
 * ```
 */
export function parseUserName(name: string | null | undefined) {
	const nameParts = name?.split(' ') || [];
	return {
		firstName: nameParts[0] || '',
		lastName: nameParts.slice(1).join(' ') || '',
	};
}
