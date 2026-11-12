import type { Config } from './config';
import { parseChesscomStats, parseFide } from './parse';
import type { ChesscomRatings, ChessResponse } from './types';

interface CacheEntry<T> {
	value: T;
	/** When the value was fetched, ms since epoch. */
	fetchedAt: number;
}

/** In-memory cache. It lives as long as the function instance; that is fine here. */
export interface RatingsState {
	chesscom?: CacheEntry<ChesscomRatings>;
	fide?: CacheEntry<number>;
}

type FetchImpl = (url: string, init?: RequestInit) => Promise<Response>;

async function getJson(url: string, cfg: Config, fetchImpl: FetchImpl): Promise<unknown> {
	const response = await fetchImpl(url, {
		headers: { 'User-Agent': cfg.userAgent, Accept: 'application/json' },
		signal: AbortSignal.timeout(cfg.timeoutMs)
	});
	// Any non-200 answer (404 included) means "no fresh value".
	if (response.status !== 200) throw new Error(`HTTP ${response.status} from ${url}`);
	return response.json();
}

function isFresh(entry: CacheEntry<unknown> | undefined, ttlMs: number, now: number): boolean {
	return entry !== undefined && now - entry.fetchedAt < ttlMs;
}

/**
 * Returns the ratings, refreshing each source only when its cache has expired.
 * Requests run one after the other (Chess.com asks for serial access).
 * A failed refresh keeps the last good value; errors are reported, not thrown.
 */
export async function getRatings(
	state: RatingsState,
	cfg: Config,
	fetchImpl: FetchImpl = fetch,
	now: number = Date.now(),
	onError: (error: unknown) => void = () => {}
): Promise<ChessResponse> {
	if (!isFresh(state.chesscom, cfg.chesscomTtlMs, now)) {
		try {
			const url = `https://api.chess.com/pub/player/${encodeURIComponent(cfg.chesscomUsername)}/stats`;
			const value = parseChesscomStats(await getJson(url, cfg, fetchImpl));
			if (value) state.chesscom = { value, fetchedAt: now };
			else onError(new Error('Chess.com response had no usable ratings'));
		} catch (error) {
			onError(error);
		}
	}

	if (!isFresh(state.fide, cfg.fideTtlMs, now)) {
		try {
			const url = `https://api.chesstools.org/fide/${encodeURIComponent(cfg.fideId)}`;
			const value = parseFide(await getJson(url, cfg, fetchImpl));
			if (value !== null) state.fide = { value, fetchedAt: now };
			else onError(new Error('FIDE response had no usable rating'));
		} catch (error) {
			onError(error);
		}
	}

	return {
		chesscom: state.chesscom?.value ?? null,
		fide: state.fide ? { classical: state.fide.value } : null,
		fetchedAt: state.chesscom ? new Date(state.chesscom.fetchedAt).toISOString() : null
	};
}
