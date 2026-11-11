import { describe, expect, it } from 'vitest';
import { formatDay, formatMonth, isRecent, ratingCards, type ChessRatings } from './chess';
import stored from './data/chess.json';

describe('isRecent', () => {
	const fetchedAt = '2026-11-04T14:32:31Z';

	it('keeps games within the last 12 months', () => {
		expect(isRecent('2026-11-04', fetchedAt)).toBe(true);
		expect(isRecent('2026-03-29', fetchedAt)).toBe(true);
	});

	it('treats exactly 12 months as recent and one day more as not', () => {
		expect(isRecent('2025-11-04', fetchedAt)).toBe(true);
		expect(isRecent('2025-11-03', fetchedAt)).toBe(false);
	});

	it('hides old games and invalid dates', () => {
		expect(isRecent('2023-03-01', fetchedAt)).toBe(false);
		expect(isRecent('not a date', fetchedAt)).toBe(false);
	});
});

describe('formatting', () => {
	it('formats months and days in English, independent of locale', () => {
		expect(formatMonth('2026-07-31')).toBe('Jul 2026');
		expect(formatDay('2026-11-04T14:32:31Z')).toBe('4 Nov 2026');
		expect(formatMonth('garbage')).toBe('');
	});
});

describe('ratingCards', () => {
	it('shows FIDE first and hides rapid for the stored data (as in the spec)', () => {
		const cards = ratingCards(stored as ChessRatings);
		expect(cards.map((c) => c.label)).toEqual([
			'FIDE classical',
			'Chess.com blitz',
			'Chess.com bullet',
			'Chess.com daily'
		]);
		expect(cards[0]).toEqual({
			label: 'FIDE classical',
			rating: 2131,
			note: 'Monthly rating list'
		});
		expect(cards[1].note).toBe('Last game Jul 2026');
	});

	it('skips a missing FIDE rating and missing formats', () => {
		const data: ChessRatings = {
			chesscom: { daily: { rating: 1900, lastGame: '2026-10-01' } },
			fide: { classical: null },
			fetchedAt: '2026-11-04T00:00:00Z'
		};
		expect(ratingCards(data).map((c) => c.label)).toEqual(['Chess.com daily']);
	});
});
