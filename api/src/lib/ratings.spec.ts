import { describe, expect, it, vi } from 'vitest';
import { config } from './config';
import { getRatings, type RatingsState } from './ratings';

const HOUR = 60 * 60 * 1000;
const T0 = Date.UTC(2026, 10, 12, 12, 0, 0);

const chesscomBody = { chess_bullet: { last: { rating: 2089, date: 1793750400 } } };
const fideBody = { rating: 2131 };

function jsonResponse(body: unknown, status = 200): Response {
	return new Response(JSON.stringify(body), { status });
}

/** Fake fetch that answers by host and records the order of calls. */
function fakeFetch(answers: { chesscom?: () => Response; fide?: () => Response }) {
	const calls: string[] = [];
	const impl = vi.fn(async (url: string, init?: RequestInit) => {
		calls.push(url);
		expect((init?.headers as Record<string, string>)['User-Agent']).toBe(config.userAgent);
		if (url.includes('api.chess.com'))
			return (answers.chesscom ?? (() => jsonResponse(chesscomBody)))();
		return (answers.fide ?? (() => jsonResponse(fideBody)))();
	});
	return { impl, calls };
}

describe('getRatings', () => {
	it('fetches both sources one after the other and returns the contract shape', async () => {
		const state: RatingsState = {};
		const { impl, calls } = fakeFetch({});
		const result = await getRatings(state, config, impl, T0);

		expect(calls).toEqual([
			'https://api.chess.com/pub/player/hrasek/stats',
			'https://api.chesstools.org/fide/345652'
		]);
		expect(result).toEqual({
			chesscom: { bullet: { rating: 2089, lastGame: '2026-11-04' } },
			fide: { classical: 2131 },
			fetchedAt: '2026-11-12T12:00:00.000Z'
		});
	});

	it('uses the cache: Chess.com for 1 hour, FIDE for 24 hours', async () => {
		const state: RatingsState = {};
		const first = fakeFetch({});
		await getRatings(state, config, first.impl, T0);

		const soon = fakeFetch({});
		await getRatings(state, config, soon.impl, T0 + 30 * 60 * 1000);
		expect(soon.calls).toEqual([]);

		const later = fakeFetch({});
		await getRatings(state, config, later.impl, T0 + 2 * HOUR);
		expect(later.calls).toEqual(['https://api.chess.com/pub/player/hrasek/stats']);

		const nextDay = fakeFetch({});
		await getRatings(state, config, nextDay.impl, T0 + 25 * HOUR);
		expect(nextDay.calls).toHaveLength(2);
	});

	it('keeps the last good value when a refresh fails', async () => {
		const state: RatingsState = {};
		await getRatings(state, config, fakeFetch({}).impl, T0);

		const errors: unknown[] = [];
		const failing = fakeFetch({
			chesscom: () => jsonResponse({}, 429),
			fide: () => {
				throw new Error('timeout');
			}
		});
		const result = await getRatings(state, config, failing.impl, T0 + 25 * HOUR, (e) =>
			errors.push(e)
		);

		expect(errors).toHaveLength(2);
		expect(result.chesscom).toEqual({ bullet: { rating: 2089, lastGame: '2026-11-04' } });
		expect(result.fide).toEqual({ classical: 2131 });
		expect(result.fetchedAt).toBe('2026-11-12T12:00:00.000Z');
	});

	it('returns null for a source that never succeeded', async () => {
		const result = await getRatings(
			{},
			config,
			fakeFetch({ fide: () => jsonResponse({ detail: 'Player not found' }, 404) }).impl,
			T0
		);
		expect(result.fide).toBeNull();
		expect(result.chesscom).not.toBeNull();
	});
});
