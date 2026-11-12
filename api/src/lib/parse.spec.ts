import { describe, expect, it } from 'vitest';
import { parseChesscomStats, parseFide } from './parse';

// Shape of the Chess.com stats response (only the fields we read, plus noise).
const stats = {
	chess_blitz: { last: { rating: 2254, date: 1785456000, rd: 45 }, best: { rating: 2300 } },
	chess_bullet: { last: { rating: 2089, date: 1793750400 } },
	chess_rapid: { last: { rating: 2206, date: 1677628800 } },
	chess_daily: { last: { rating: 2077, date: 1774742400 } },
	chess960_daily: { last: { rating: 1500, date: 1700000000 } },
	tactics: { highest: { rating: 3000 } },
	fide: 2100
};

describe('parseChesscomStats', () => {
	it('reads the four formats and converts Unix seconds to a date', () => {
		expect(parseChesscomStats(stats)).toEqual({
			blitz: { rating: 2254, lastGame: '2026-07-31' },
			bullet: { rating: 2089, lastGame: '2026-11-04' },
			rapid: { rating: 2206, lastGame: '2023-03-01' },
			daily: { rating: 2077, lastGame: '2026-03-29' }
		});
	});

	it('skips formats that are missing or malformed', () => {
		expect(
			parseChesscomStats({
				chess_blitz: { last: { rating: '2254', date: 1785456000 } },
				chess_daily: { last: { rating: 2077, date: 1774742400 } }
			})
		).toEqual({ daily: { rating: 2077, lastGame: '2026-03-29' } });
	});

	it('returns null when nothing can be read', () => {
		expect(parseChesscomStats({})).toBeNull();
		expect(parseChesscomStats(null)).toBeNull();
		expect(parseChesscomStats('<html>blocked</html>')).toBeNull();
	});
});

describe('parseFide', () => {
	it('reads the rating as a number or numeric string', () => {
		expect(parseFide({ rating: 2131, name: 'Hošek, Martin', k_factor: '20' })).toBe(2131);
		expect(parseFide({ rating: '2131' })).toBe(2131);
	});

	it('returns null for the 404 body and invalid values', () => {
		expect(parseFide({ detail: 'Player not found' })).toBeNull();
		expect(parseFide({ rating: 'n/a' })).toBeNull();
		expect(parseFide({ rating: 0 })).toBeNull();
		expect(parseFide(null)).toBeNull();
	});
});
