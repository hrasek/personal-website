import type { ChesscomFormat, ChesscomRatings } from './types';

const FORMATS: readonly ChesscomFormat[] = ['blitz', 'bullet', 'rapid', 'daily'];

function isObject(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null;
}

/**
 * Chess.com stats (GET /pub/player/{username}/stats) to our shape.
 * Reads chess_blitz, chess_bullet, chess_rapid and chess_daily; takes
 * last.rating and last.date (Unix seconds). Anything else is ignored.
 * Returns null if no format could be read.
 */
export function parseChesscomStats(json: unknown): ChesscomRatings | null {
	if (!isObject(json)) return null;
	const result: ChesscomRatings = {};
	for (const format of FORMATS) {
		const entry = json[`chess_${format}`];
		const last = isObject(entry) ? entry.last : undefined;
		if (!isObject(last)) continue;
		const { rating, date } = last;
		if (typeof rating !== 'number' || typeof date !== 'number' || !Number.isFinite(date)) continue;
		result[format] = {
			rating,
			lastGame: new Date(date * 1000).toISOString().slice(0, 10)
		};
	}
	return Object.keys(result).length > 0 ? result : null;
}

/**
 * ChessTools FIDE response (GET /fide/{fide_id}) to the classical rating.
 * Accepts a number or a numeric string; returns null otherwise.
 */
export function parseFide(json: unknown): number | null {
	if (!isObject(json)) return null;
	const { rating } = json;
	const value = typeof rating === 'string' ? Number(rating) : rating;
	return typeof value === 'number' && Number.isInteger(value) && value > 0 ? value : null;
}
