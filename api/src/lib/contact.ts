/** Limits for the contact form (see D16). */
export const contactLimits = {
	nameMax: 100,
	emailMax: 254, // the longest valid email address
	messageMax: 3000,
	/** Requests with a larger body are rejected before parsing. */
	bodyMaxBytes: 16 * 1024
} as const;

export interface ContactMessage {
	name: string;
	email: string;
	message: string;
}

export type ValidationResult =
	| { kind: 'valid'; value: ContactMessage }
	/** The hidden honeypot field was filled in: almost certainly a bot. */
	| { kind: 'spam' }
	| { kind: 'invalid'; fields: string[] };

/** Deliberately loose: one @, no spaces, a dot in the domain. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function text(value: unknown): string {
	return typeof value === 'string' ? value.trim() : '';
}

/**
 * Checks the JSON body sent by the form: `{ name, email, message, website }`,
 * where `website` is the honeypot that people never see.
 */
export function validateContact(input: unknown): ValidationResult {
	if (typeof input !== 'object' || input === null || Array.isArray(input)) {
		return { kind: 'invalid', fields: ['body'] };
	}
	const body = input as Record<string, unknown>;

	if (text(body.website) !== '') return { kind: 'spam' };

	const name = text(body.name);
	const email = text(body.email);
	const message = text(body.message);

	const fields: string[] = [];
	if (name === '' || name.length > contactLimits.nameMax) fields.push('name');
	if (email.length > contactLimits.emailMax || !EMAIL_PATTERN.test(email)) fields.push('email');
	if (message === '' || message.length > contactLimits.messageMax) fields.push('message');

	if (fields.length > 0) return { kind: 'invalid', fields };
	return { kind: 'valid', value: { name, email, message } };
}

/** The Pushbullet "note" that arrives on my phone. */
export function buildNote(contact: ContactMessage) {
	return {
		type: 'note',
		title: `Website: ${contact.name}`,
		body: `${contact.email}\n\n${contact.message}`
	} as const;
}

export const PUSHBULLET_URL = 'https://api.pushbullet.com/v2/pushes';

type FetchImpl = (url: string, init?: RequestInit) => Promise<Response>;

/**
 * Sends the message as a Pushbullet note. Throws on a network error, a timeout
 * or any non-2xx answer; the error never contains the token.
 */
export async function sendToPushbullet(
	contact: ContactMessage,
	token: string,
	fetchImpl: FetchImpl = fetch,
	timeoutMs = 5000
): Promise<void> {
	const response = await fetchImpl(PUSHBULLET_URL, {
		method: 'POST',
		headers: { 'Access-Token': token, 'Content-Type': 'application/json' },
		body: JSON.stringify(buildNote(contact)),
		signal: AbortSignal.timeout(timeoutMs)
	});
	if (!response.ok) throw new Error(`Pushbullet answered HTTP ${response.status}`);
}

export interface ContactResponse {
	status: 200 | 400 | 502;
	jsonBody: { ok: true } | { error: 'invalid_input'; fields: string[] } | { error: 'send_failed' };
}

interface HandleOptions {
	token: string | undefined;
	fetchImpl?: FetchImpl;
	/** Gets a short reason only, never the token or the visitor's message. */
	onError?: (reason: string) => void;
}

/**
 * The whole request flow, independent of the Azure runtime so it can be tested:
 * 200 sent (or honeypot hit), 400 invalid input, 502 Pushbullet failed or not configured.
 */
export async function handleContact(
	rawBody: string,
	{ token, fetchImpl = fetch, onError = () => {} }: HandleOptions
): Promise<ContactResponse> {
	if (Buffer.byteLength(rawBody, 'utf8') > contactLimits.bodyMaxBytes) {
		return { status: 400, jsonBody: { error: 'invalid_input', fields: ['body'] } };
	}

	let input: unknown;
	try {
		input = JSON.parse(rawBody);
	} catch {
		return { status: 400, jsonBody: { error: 'invalid_input', fields: ['body'] } };
	}

	const result = validateContact(input);
	// Bots get the same answer as people, so they learn nothing.
	if (result.kind === 'spam') return { status: 200, jsonBody: { ok: true } };
	if (result.kind === 'invalid') {
		return { status: 400, jsonBody: { error: 'invalid_input', fields: result.fields } };
	}

	if (!token) {
		onError('PUSHBULLET_TOKEN is not set');
		return { status: 502, jsonBody: { error: 'send_failed' } };
	}

	try {
		await sendToPushbullet(result.value, token, fetchImpl);
	} catch (error) {
		onError(error instanceof Error ? error.message : 'unknown error');
		return { status: 502, jsonBody: { error: 'send_failed' } };
	}
	return { status: 200, jsonBody: { ok: true } };
}
