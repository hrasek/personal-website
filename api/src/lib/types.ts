/**
 * The /api/chess response. Same shape as src/lib/data/chess.json in the site,
 * except that a source without any data is null (the page then keeps its
 * stored value). Keep in sync with src/lib/chess.ts.
 */

export type ChesscomFormat = 'blitz' | 'bullet' | 'rapid' | 'daily';

export interface ChesscomRating {
	rating: number;
	/** Date of the last game, YYYY-MM-DD. */
	lastGame: string;
}

export type ChesscomRatings = Partial<Record<ChesscomFormat, ChesscomRating>>;

export interface ChessResponse {
	chesscom: ChesscomRatings | null;
	fide: { classical: number } | null;
	/** When the Chess.com values were fetched (ISO 8601), or null without Chess.com data. */
	fetchedAt: string | null;
}
