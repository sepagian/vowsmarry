import { describe, it, expect } from 'vitest';
import {
	scheduleEventFormSchema,
	scheduleEventsArraySchema,
	checkTimeOverlap,
	calculateDuration,
	formatDuration,
} from '../index.js';

describe('Schedule Validation', () => {
	describe('scheduleEventFormSchema', () => {
		it('should validate correct schedule event data', () => {
			const validData = {
				title: 'Wedding Ceremony',
				category: 'ceremony',
				startTime: '14:00',
				endTime: '15:00',
				description: 'Main wedding ceremony',
				location: 'Church',
				responsible: 'Wedding Planner',
			};

			const result = scheduleEventFormSchema.safeParse(validData);
			expect(result.success).toBe(true);
		});

		it('should reject invalid time format', () => {
			const invalidData = {
				title: 'Wedding Ceremony',
				category: 'ceremony',
				startTime: '25:00', // Invalid hour
				endTime: '15:00',
				location: 'Church',
			};

			const result = scheduleEventFormSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
		});

		it('should reject end time before start time', () => {
			const invalidData = {
				title: 'Wedding Ceremony',
				category: 'ceremony',
				startTime: '15:00',
				endTime: '14:00', // End before start
				location: 'Church',
			};

			const result = scheduleEventFormSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toContain('End time must be after start time');
			}
		});

		it('should require location for ceremony events', () => {
			const invalidData = {
				title: 'Wedding Ceremony',
				category: 'ceremony',
				startTime: '14:00',
				endTime: '15:00',
				// Missing location
			};

			const result = scheduleEventFormSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(
					result.error.issues.some((issue) =>
						issue.message.includes('Location is required for Ceremony events'),
					),
				).toBe(true);
			}
		});

		it('should validate duration constraints', () => {
			const invalidData = {
				title: 'Wedding Ceremony',
				category: 'ceremony',
				startTime: '14:00',
				endTime: '14:05', // Only 5 minutes - too short
				location: 'Church',
				responsible: 'Planner',
			};

			const result = scheduleEventFormSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
		});
	});

	describe('scheduleEventsArraySchema', () => {
		it('should detect overlapping events', () => {
			const overlappingEvents = [
				{
					title: 'Event 1',
					category: 'preparation',
					startTime: '14:00',
					endTime: '15:00',
					location: 'Church',
				},
				{
					title: 'Event 2',
					category: 'preparation',
					startTime: '14:30',
					endTime: '15:30', // Overlaps with Event 1
					location: 'Hall',
				},
			];

			const result = scheduleEventsArraySchema.safeParse(overlappingEvents);
			expect(result.success).toBe(false);
			if (!result.success) {
				// Find the overlap error message
				const overlapError = result.error.issues.find((issue) =>
					issue.message.includes('overlaps with'),
				);
				expect(overlapError).toBeDefined();
			}
		});

		it('should allow non-overlapping events', () => {
			const nonOverlappingEvents = [
				{
					title: 'Event 1',
					category: 'preparation',
					startTime: '14:00',
					endTime: '15:00',
					location: 'Church',
				},
				{
					title: 'Event 2',
					category: 'preparation',
					startTime: '15:00',
					endTime: '16:00',
					location: 'Hall',
				},
			];

			const result = scheduleEventsArraySchema.safeParse(nonOverlappingEvents);
			expect(result.success).toBe(true);
		});
	});

	describe('Utility functions', () => {
		it('should correctly detect time overlap', () => {
			expect(checkTimeOverlap('14:00', '15:00', '14:30', '15:30')).toBe(true);
			expect(checkTimeOverlap('14:00', '15:00', '15:00', '16:00')).toBe(false);
			expect(checkTimeOverlap('14:00', '15:00', '13:00', '14:00')).toBe(false);
		});

		it('should calculate duration correctly', () => {
			expect(calculateDuration('14:00', '15:00')).toBe(60);
			expect(calculateDuration('14:30', '15:15')).toBe(45);
			expect(calculateDuration('09:00', '17:30')).toBe(510);
		});

		it('should format duration correctly', () => {
			expect(formatDuration(60)).toBe('1 hour');
			expect(formatDuration(90)).toBe('1 hour 30 minutes');
			expect(formatDuration(30)).toBe('30 minutes');
			expect(formatDuration(120)).toBe('2 hours');
		});
	});
});
