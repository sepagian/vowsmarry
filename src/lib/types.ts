export type Option<T> = {
	value: T;
	label: string;
	icon?: string;
	color?: string;
};

export type Category =
	| 'accommodation'
	| 'catering'
	| 'decoration'
	| 'entertainment'
	| 'makeup-attire'
	| 'paperwork'
	| 'photo-video'
	| 'venue'
	| 'miscellaneous';

export type OverviewCard = {
	title: string;
	description: string;
	action?: string;
	actionClass?: string;
	actionColor?: string;
	footer: string;
};
