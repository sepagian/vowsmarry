import { getErrorConfig } from '$lib/utils/error-messages';

export const load = async ({ url }: { url: URL }) => {
	// Extract error information from query parameters
	const errorType = url.searchParams.get('type') || 'generic';
	const message = url.searchParams.get('message') || '';
	const context = url.searchParams.get('context') || '';
	
	// Get the error configuration using the utility function
	const errorConfig = getErrorConfig(errorType);
	
	// Use custom message if provided, otherwise use default description
	const finalDescription = message || errorConfig.description;

	return {
		error: {
			type: errorType,
			title: errorConfig.title,
			description: finalDescription,
			icon: errorConfig.icon,
			category: errorConfig.category,
			context,
			actions: errorConfig.actions
		}
	};
};