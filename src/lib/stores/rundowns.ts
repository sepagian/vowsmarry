import { writable } from 'svelte/store';
import type { Rundown } from '$lib/types';

const initialRundowns: Rundown[] = [
	{
		id: '1',
		title: 'Guests arrive',
		description: 'Welcome guests at the venue',
		category: 'preparation',
		startTime: '2023-04-14T15:00:00',
		endTime: '2023-04-14T16:00:00',
		location: 'Venue entrance',
		attendees: 'All guests',
	},
	{
		id: '2',
		title: 'Ceremony starts',
		description: 'Wedding ceremony begins',
		category: 'ceremony',
		startTime: '2023-04-14T16:00:00',
		endTime: '2023-04-14T17:00:00',
		location: 'Ceremony hall',
		attendees: 'Bride, Groom, Family',
	},
	{
		id: '3',
		title: 'Photos',
		description: 'Couple and family photos',
		category: 'photo-video',
		startTime: '2023-04-14T17:00:00',
		endTime: '2023-04-14T18:00:00',
		location: 'Garden',
		attendees: 'Bride, Groom, Family',
	},
	{
		id: '4',
		title: 'Reception',
		description: 'Dinner and speeches',
		category: 'reception',
		startTime: '2023-04-14T18:00:00',
		endTime: '2023-04-14T19:00:00',
		location: 'Reception hall',
		attendees: 'All guests',
	},
	{
		id: '5',
		title: 'First dance',
		description: "Couple's first dance",
		category: 'entertainment',
		startTime: '2023-04-14T19:00:00',
		endTime: '2023-04-14T19:30:00',
		location: 'Dance floor',
		attendees: 'Bride, Groom',
	},
];

export const rundownsStore = writable<Rundown[]>(initialRundowns);
