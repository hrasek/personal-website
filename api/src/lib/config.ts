/**
 * Public account identifiers, not secrets. Application settings with the same
 * names override them, so they can change without a code change.
 */
const chesscomUsername = process.env.CHESSCOM_USERNAME ?? 'hrasek';

export const config = {
	chesscomUsername,
	fideId: process.env.FIDE_ID ?? '345652',
	/** Chess.com asks API clients to identify themselves; no email by design. */
	userAgent: `personal-website/1.0 (username: ${chesscomUsername}; +https://github.com/hrasek/personal-website)`,
	chesscomTtlMs: 60 * 60 * 1000, // 1 hour
	fideTtlMs: 24 * 60 * 60 * 1000, // 24 hours
	timeoutMs: 5000
} as const;

export type Config = typeof config;
