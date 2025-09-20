import { writable } from 'svelte/store';

export interface Item {
	id: string;
	name: string;
}

export interface ColumnType {
	id: string;
	name: string;
	items: Item[];
}

const initialColumns: ColumnType[] = [
	{
		id: 'c1',
		name: 'Booked',
		items: [
			{ id: '1', name: 'item41' },
			{ id: '2', name: 'item42' },
			{ id: '3', name: 'item43' },
			{ id: '4', name: 'item44' },
			{ id: '5', name: 'item45' },
			{ id: '6', name: 'item46' },
			{ id: '7', name: 'item47' },
			{ id: '8', name: 'item48' },
			{ id: '9', name: 'item49' },
		],
	},
	{
		id: 'c2',
		name: 'Contacted',
		items: [
			{ id: '10', name: 'item50' },
			{ id: '11', name: 'item51' },
		],
	},
	{
		id: 'c3',
		name: 'Negotiated',
		items: [{ id: '13', name: 'item52' }],
	},
	{
		id: 'c4',
		name: 'Completed',
		items: [{ id: '14', name: 'item53' }],
	},
];

export const vendorsColumns = writable<ColumnType[]>(initialColumns);
