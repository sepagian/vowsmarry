import type { LayoutServerLoad } from './$types';

type Workspace = {
	groomName?: string;
	brideName?: string;
}

const getPageTitle = (workspace: Workspace | undefined, pathname: string) => {
	if (pathname.startsWith('/dashboard')) {
		const pathParts = pathname.split('/dashboard/')[1]?.split('/');
		const section = pathParts?.[0];

		const titleMap: Record<string, string> = {
			task: 'Tasks',
			document: 'Document',
			finance: 'Finance',
			vendor: 'Vendor',
			schedule: 'Schedule',
		};

		if (workspace?.groomName && workspace?.brideName) {
			return section && titleMap[section]
				? `${titleMap[section]} - ${workspace.groomName} & ${workspace.brideName} | VowsMarry`
				: `Dashboard - ${workspace.groomName} & ${workspace.brideName} | VowsMarry`;
		}
	}

	return 'VowsMarry';
};

export const load: LayoutServerLoad = async ({ locals, cookies, url, parent }) => {
	const parentData = await parent();
	return {
		user: locals.user,
		session: locals.session,
		cookies: cookies.getAll(),
		pageTitle: getPageTitle(parentData.workspace, url.pathname),
	};
};
