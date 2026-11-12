/**
 * Chess ratings: the shape of chess.json and of the /api/chess response
 * (docs/SPEC.md, section 5), plus the display rules.
 */

export type ChesscomFormat = 'blitz' | 'bullet' | 'rapid' | 'daily';

export interface ChesscomRating {
	rating: number;
	/** Date of the last game, YYYY-MM-DD. */
	lastGame: string;
}

export interface ChessRatings {
	chesscom: Partial<Record<ChesscomFormat, ChesscomRating>>;
	fide: { classical: number | null };
	/** When the values were fetched, ISO 8601. */
	fetchedAt: string;
}

export interface RatingCard {
	label: string;
	rating: number;
	note: string;
}

/** Display order of the Chess.com formats. */
export const CHESSCOM_FORMATS: readonly ChesscomFormat[] = ['blitz', 'bullet', 'rapid', 'daily'];

const MONTHS = [
	'Jan',
	'Feb',
	'Mar',
	'Apr',
	'May',
	'Jun',
	'Jul',
	'Aug',
	'Sep',
	'Oct',
	'Nov',
	'Dec'
] as const;

function parseDate(value: string): Date | null {
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? null : date;
}

/** "Jul 2026". Fixed English names, so the output doesn't depend on the browser's locale. */
export function formatMonth(value: string): string {
	const date = parseDate(value);
	return date ? `${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}` : '';
}

/** "4 Nov 2026". */
export function formatDay(value: string): string {
	const date = parseDate(value);
	return date ? `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}` : '';
}

/**
 * A format is shown if its last game is at most 12 months older than the
 * moment the ratings were fetched. Using fetchedAt (not "now") keeps the
 * prerendered page and the browser in agreement.
 */
export function isRecent(lastGame: string, fetchedAt: string, months = 12): boolean {
	const game = parseDate(lastGame);
	const fetched = parseDate(fetchedAt);
	if (!game || !fetched) return false;
	const cutoff = new Date(
		Date.UTC(fetched.getUTCFullYear(), fetched.getUTCMonth() - months, fetched.getUTCDate())
	);
	return game >= cutoff;
}

/** The cards to show: FIDE first, then the recent Chess.com formats. */
export function ratingCards(data: ChessRatings): RatingCard[] {
	const cards: RatingCard[] = [];
	if (data.fide.classical != null) {
		cards.push({
			label: 'FIDE classical',
			rating: data.fide.classical,
			note: 'Monthly rating list'
		});
	}
	for (const format of CHESSCOM_FORMATS) {
		const entry = data.chesscom[format];
		if (entry && isRecent(entry.lastGame, data.fetchedAt)) {
			cards.push({
				label: `Chess.com ${format}`,
				rating: entry.rating,
				note: `Last game ${formatMonth(entry.lastGame)}`
			});
		}
	}
	return cards;
}

/** The /api/chess response: a source without data is null. */
export interface ChessApiResponse {
	chesscom: ChessRatings['chesscom'] | null;
	fide: { classical: number } | null;
	fetchedAt: string | null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isChesscomRating(value: unknown): value is ChesscomRating {
	return (
		isRecord(value) &&
		typeof value.rating === 'number' &&
		typeof value.lastGame === 'string' &&
		!Number.isNaN(new Date(value.lastGame).getTime())
	);
}

/** Checks the shape strictly, so a broken answer can never replace good stored values. */
export function isChessApiResponse(value: unknown): value is ChessApiResponse {
	if (!isRecord(value)) return false;
	const { chesscom, fide, fetchedAt } = value;
	const chesscomOk =
		chesscom === null ||
		(isRecord(chesscom) &&
			Object.entries(chesscom).every(
				([key, entry]) =>
					(CHESSCOM_FORMATS as readonly string[]).includes(key) && isChesscomRating(entry)
			));
	const fideOk = fide === null || (isRecord(fide) && typeof fide.classical === 'number');
	const fetchedAtOk =
		fetchedAt === null ||
		(typeof fetchedAt === 'string' && !Number.isNaN(new Date(fetchedAt).getTime()));
	// Chess.com data needs its fetch time for the 12-month rule.
	return chesscomOk && fideOk && fetchedAtOk && (chesscom === null || fetchedAt !== null);
}

/** Replaces each source only if the live answer has it; otherwise keeps the stored value. */
export function mergeRatings(stored: ChessRatings, live: ChessApiResponse): ChessRatings {
	return {
		chesscom: live.chesscom ?? stored.chesscom,
		fide: live.fide ?? stored.fide,
		fetchedAt: live.chesscom && live.fetchedAt ? live.fetchedAt : stored.fetchedAt
	};
}
