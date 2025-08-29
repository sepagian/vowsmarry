import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as table from './schema.js';
import { readFileSync } from 'fs';

// Load environment variables from .env file
const envFile = readFileSync('.env', 'utf8');
const envVars: Record<string, string> = {};
envFile.split('\n').forEach(line => {
	const [key, ...valueParts] = line.split('=');
	if (key && valueParts.length > 0) {
		envVars[key.trim()] = valueParts.join('=').replace(/"/g, '').trim();
	}
});

// Direct database connection for seeding
const client = postgres(envVars.DATABASE_URL!);
const db = drizzle(client, { schema: table });

// Simple password hashing for seed data
async function hashPassword(password: string): Promise<string> {
	const encoder = new TextEncoder();
	const data = encoder.encode(password);
	const hashBuffer = await crypto.subtle.digest('SHA-256', data);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
	return hashHex;
}

export async function seedDatabase() {
	console.log('🌱 Seeding database...');

	try {
		// Check if test user already exists
		let user = await db.query.users.findFirst({
			where: (users, { eq }) => eq(users.email, 'test@example.com')
		});

		if (!user) {
			// Create a test user
			const passwordHash = await hashPassword('password123');
			[user] = await db.insert(table.users).values({
				email: 'test@example.com',
				passwordHash,
				firstName: 'John',
				lastName: 'Doe',
				emailVerified: true // Skip email verification for seed data
			}).returning();
			console.log('✅ Created test user:', user.email);
		} else {
			console.log('✅ Test user already exists:', user.email);
		}

		// Check if wedding already exists for this user
		let wedding = await db.query.weddings.findFirst({
			where: (weddings, { eq }) => eq(weddings.userId, user.id)
		});

		if (!wedding) {
			// Create a wedding for the test user
			[wedding] = await db.insert(table.weddings).values({
				userId: user.id,
				partnerName: 'Jane Smith',
				weddingDate: '2024-12-25',
				venue: 'Grand Ballroom Hotel',
				budget: '50000000', // 50 million IDR
				status: 'planning'
			}).returning();
			console.log('✅ Created test wedding for:', wedding.partnerName);
		} else {
			console.log('✅ Test wedding already exists for:', wedding.partnerName);
		}

		// Check if documents already exist
		const existingDocs = await db.query.documents.findMany({
			where: (documents, { eq }) => eq(documents.weddingId, wedding.id)
		});

		if (existingDocs.length === 0) {
			// Create sample documents
			await db.insert(table.documents).values([
			{
				weddingId: wedding.id,
				title: 'Marriage License Application',
				type: 'license',
				status: 'pending',
				dueDate: '2024-11-01',
				notes: 'Need to submit to civil registry office'
			},
			{
				weddingId: wedding.id,
				title: 'Venue Contract',
				type: 'contract',
				status: 'approved',
				notes: 'Signed and approved by venue management'
			}
			]);
			console.log('✅ Created sample documents');
		} else {
			console.log('✅ Sample documents already exist');
		}

		// Create sample budget items
		await db.insert(table.budgetItems).values([
			{
				weddingId: wedding.id,
				category: 'Venue',
				description: 'Grand Ballroom rental',
				plannedAmount: '15000000',
				actualAmount: '15000000',
				status: 'paid'
			},
			{
				weddingId: wedding.id,
				category: 'Catering',
				description: 'Wedding dinner for 200 guests',
				plannedAmount: '20000000',
				status: 'planned',
				dueDate: '2024-12-01'
			},
			{
				weddingId: wedding.id,
				category: 'Photography',
				description: 'Wedding photographer and videographer',
				plannedAmount: '8000000',
				status: 'planned'
			}
		]);

		// Create sample todos
		await db.insert(table.todos).values([
			{
				weddingId: wedding.id,
				title: 'Book wedding photographer',
				description: 'Research and book a professional wedding photographer',
				priority: 'high',
				status: 'todo',
				dueDate: '2024-11-15'
			},
			{
				weddingId: wedding.id,
				title: 'Send invitations',
				description: 'Design and send wedding invitations to all guests',
				priority: 'medium',
				status: 'in_progress',
				dueDate: '2024-11-30'
			},
			{
				weddingId: wedding.id,
				title: 'Choose wedding cake',
				description: 'Visit bakeries and select wedding cake design',
				priority: 'low',
				status: 'todo',
				dueDate: '2024-12-10'
			}
		]);

		// Create sample vendors
		await db.insert(table.vendors).values([
			{
				weddingId: wedding.id,
				name: 'Elegant Catering Services',
				category: 'Catering',
				contactInfo: {
					phone: '+62-21-1234-5678',
					email: 'info@elegantcatering.com',
					address: 'Jl. Sudirman No. 123, Jakarta'
				},
				status: 'negotiating',
				totalCost: '20000000',
				services: ['Wedding dinner', 'Cocktail hour', 'Dessert station']
			},
			{
				weddingId: wedding.id,
				name: 'Perfect Moments Photography',
				category: 'Photography',
				contactInfo: {
					phone: '+62-21-9876-5432',
					email: 'hello@perfectmoments.com',
					website: 'https://perfectmoments.com'
				},
				status: 'contacted',
				totalCost: '8000000',
				services: ['Wedding photography', 'Videography', 'Photo album']
			}
		]);

		// Create sample dresscode
		await db.insert(table.dresscodes).values([
			{
				weddingId: wedding.id,
				eventName: 'Wedding Ceremony',
				description: 'Formal attire with elegant color scheme',
				dresscodeType: 'formal',
				colorScheme: ['Navy Blue', 'Gold', 'Cream'],
				guestInstructions: 'Please wear formal attire in navy blue, gold, or cream colors. Avoid wearing white or black.',
				maleAttire: {
					clothing: ['Suit', 'Dress shirt', 'Tie'],
					colors: ['Navy Blue', 'Gold', 'Cream'],
					footwear: ['Dress shoes']
				},
				femaleAttire: {
					clothing: ['Cocktail dress', 'Evening gown'],
					colors: ['Navy Blue', 'Gold', 'Cream'],
					footwear: ['Heels', 'Dress shoes'],
					restrictions: ['No white dresses', 'No black attire']
				},
				isPublic: true
			}
		]);

		// Create savings summary
		const [savingsSummary] = await db.insert(table.savingsSummaries).values({
			weddingId: wedding.id,
			goalAmount: '50000000',
			currentAmount: '25000000',
			targetDate: '2024-12-01',
			monthlyTarget: '5000000'
		}).returning();

		// Create sample savings entries
		await db.insert(table.savingsEntries).values([
			{
				savingsId: savingsSummary.id,
				amount: '10000000',
				type: 'deposit',
				description: 'Initial wedding fund deposit',
				date: '2024-01-01'
			},
			{
				savingsId: savingsSummary.id,
				amount: '5000000',
				type: 'deposit',
				description: 'Monthly savings - February',
				date: '2024-02-01'
			},
			{
				savingsId: savingsSummary.id,
				amount: '5000000',
				type: 'deposit',
				description: 'Monthly savings - March',
				date: '2024-03-01'
			},
			{
				savingsId: savingsSummary.id,
				amount: '5000000',
				type: 'deposit',
				description: 'Monthly savings - April',
				date: '2024-04-01'
			}
		]);

		// Create sample dowry items
		await db.insert(table.dowryItems).values([
			{
				weddingId: wedding.id,
				type: 'gold',
				description: 'Gold jewelry set (necklace, earrings, bracelet)',
				value: '15000000',
				currency: 'IDR',
				status: 'promised',
				giver: 'Parents of the Bride',
				receiver: 'Jane Smith',
				religiousRequirement: true
			},
			{
				weddingId: wedding.id,
				type: 'cash',
				description: 'Wedding gift money',
				value: '10000000',
				currency: 'IDR',
				status: 'received',
				giver: 'Extended Family',
				receiver: 'John Doe & Jane Smith',
				receivedDate: '2024-10-01'
			}
		]);

		// Create sample souvenirs
		await db.insert(table.souvenirs).values([
			{
				weddingId: wedding.id,
				name: 'Personalized Wedding Cookies',
				description: 'Heart-shaped cookies with couple names',
				category: 'edible',
				quantity: 200,
				unitCost: '15000',
				totalCost: '3000000',
				status: 'planned',
				packaging: {
					type: 'Gift box',
					color: 'Gold',
					customLabel: true,
					labelText: 'John & Jane - December 25, 2024'
				},
				customization: {
					personalized: true,
					coupleNames: true,
					weddingDate: true
				}
			}
		]);

		// Create sample rundown events
		await db.insert(table.rundownEvents).values([
			{
				weddingId: wedding.id,
				eventName: 'Wedding Ceremony',
				eventType: 'ceremony',
				startTime: new Date('2024-12-25T10:00:00'),
				endTime: new Date('2024-12-25T11:30:00'),
				location: 'Grand Ballroom Hotel - Chapel',
				description: 'Traditional wedding ceremony',
				assignedTo: ['Wedding Planner', 'Officiant'],
				requirements: ['Flowers', 'Music system', 'Chairs for 200 guests'],
				status: 'planned',
				priority: 'high'
			},
			{
				weddingId: wedding.id,
				eventName: 'Cocktail Hour',
				eventType: 'reception',
				startTime: new Date('2024-12-25T12:00:00'),
				endTime: new Date('2024-12-25T13:00:00'),
				location: 'Grand Ballroom Hotel - Garden',
				description: 'Welcome drinks and appetizers',
				assignedTo: ['Catering Staff'],
				requirements: ['Bar setup', 'Appetizer stations', 'Background music'],
				status: 'planned',
				priority: 'medium'
			},
			{
				weddingId: wedding.id,
				eventName: 'Wedding Reception',
				eventType: 'reception',
				startTime: new Date('2024-12-25T18:00:00'),
				endTime: new Date('2024-12-25T23:00:00'),
				location: 'Grand Ballroom Hotel - Main Hall',
				description: 'Wedding dinner and celebration',
				assignedTo: ['Wedding Planner', 'MC', 'Band'],
				requirements: ['Sound system', 'Lighting', 'Dance floor', 'Dining setup'],
				status: 'planned',
				priority: 'high'
			}
		]);

		console.log('✅ Database seeded successfully!');
		console.log('📧 Test user email: test@example.com');
		console.log('🔑 Test user password: password123');

	} catch (error) {
		console.error('❌ Error seeding database:', error);
		throw error;
	} finally {
		await client.end();
	}
}

// Run seed if this file is executed directly
console.log('Starting seed script...');
await seedDatabase();
console.log('Seed script completed.');