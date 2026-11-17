/**
 * Contact form: browser-side checks and the call to /api/contact (see D16).
 * The limits mirror api/src/lib/contact.ts; a unit test keeps them equal.
 */

export const formLimits = {
	nameMax: 100,
	emailMax: 254,
	messageMax: 3000
} as const;

export type Field = 'name' | 'email' | 'message';

export interface FormValues {
	name: string;
	email: string;
	message: string;
	/** Honeypot: hidden from people, so it stays empty unless a bot fills it in. */
	website: string;
}

export type SubmitResult =
	| { kind: 'sent' }
	| { kind: 'invalid'; fields: Field[] }
	/** Network error, timeout, or the server could not send the message. */
	| { kind: 'failed' };

const FIELDS: readonly Field[] = ['name', 'email', 'message'];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isField(value: unknown): value is Field {
	return typeof value === 'string' && (FIELDS as readonly string[]).includes(value);
}

/** Same rules as the API, so most mistakes are caught before sending. */
export function invalidFields(values: FormValues): Field[] {
	const name = values.name.trim();
	const email = values.email.trim();
	const message = values.message.trim();

	const fields: Field[] = [];
	if (name === '' || name.length > formLimits.nameMax) fields.push('name');
	if (email.length > formLimits.emailMax || !EMAIL_PATTERN.test(email)) fields.push('email');
	if (message === '' || message.length > formLimits.messageMax) fields.push('message');
	return fields;
}

type FetchImpl = (url: string, init?: RequestInit) => Promise<Response>;

/** Posts the form to /api/contact and turns any answer into one of three results. */
export async function submitContact(
	values: FormValues,
	fetchImpl: FetchImpl = fetch,
	timeoutMs = 10_000
): Promise<SubmitResult> {
	let response: Response;
	try {
		response = await fetchImpl('/api/contact', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(values),
			signal: AbortSignal.timeout(timeoutMs)
		});
	} catch {
		return { kind: 'failed' };
	}

	if (response.ok) return { kind: 'sent' };

	if (response.status === 400) {
		try {
			const body: unknown = await response.json();
			const listed = (body as { fields?: unknown }).fields;
			const fields = Array.isArray(listed) ? listed.filter(isField) : [];
			// A 400 without a known field (for example a broken body) is our fault, not the visitor's.
			if (fields.length > 0) return { kind: 'invalid', fields };
		} catch {
			// Not JSON: treat as a failure below.
		}
	}
	return { kind: 'failed' };
}
