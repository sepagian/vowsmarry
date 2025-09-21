import { writable } from 'svelte/store';

const initialRundowns: Rundown[] = [
	{
		id: '1',
		event: 'Guests arrive',
		time: '15:00',
		category: 'pre-ceremony',
		description: 'Welcome guests at the venue',
	},
	{
		id: '2',
		event: 'Ceremony starts',
		time: '16:00',
		category: 'ceremony',
		description: 'Wedding ceremony begins',
	},
	{
		id: '3',
		event: 'Photos',
		time: '17:00',
		category: 'post-ceremony',
		description: 'Couple and family photos',
	},
	{
		id: '4',
		event: 'Reception',
		time: '18:00',
		category: 'reception',
		description: 'Dinner and speeches',
	},
	{
		id: '5',
		event: 'First dance',
		time: '19:00',
		category: 'dancing',
		description: "Couple's first dance",
	},
];

export const rundownsStore = writable<Rundown[]>(initialRundowns);
