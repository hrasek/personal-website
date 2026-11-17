import { describe, expect, it, vi } from 'vitest';
import {
	PUSHBULLET_URL,
	buildNote,
	contactLimits,
	handleContact,
	sendToPushbullet,
	validateContact
} from './contact';

const valid = { name: 'Jana Nováková', email: 'jana@example.com', message: 'Hello Martin!' };
const TOKEN = 'test-token';

/** Fake fetch that records the calls and answers with the given status. */
function fakeFetch(status = 200) {
	return vi.fn<(url: string, init?: RequestInit) => Promise<Response>>(
		async () => new Response('{}', { status })
	);
}

describe('validateContact', () => {
	it('accepts a complete message and trims whitespace', () => {
		const result = validateContact({
			name: '  Jana Nováková ',
			email: ' jana@example.com',
			message: 'Hello Martin!\n',
			website: ''
		});
		expect(result).toEqual({ kind: 'valid', value: valid });
	});

	it('treats a filled honeypot as spam, even when the rest is valid', () => {
		expect(validateContact({ ...valid, website: 'https://spam.example' })).toEqual({
			kind: 'spam'
		});
	});

	it('lists every invalid field', () => {
		expect(validateContact({ name: ' ', email: 'not-an-email', message: '' })).toEqual({
			kind: 'invalid',
			fields: ['name', 'email', 'message']
		});
	});

	it('rejects values that are too long', () => {
		const result = validateContact({
			name: 'n'.repeat(contactLimits.nameMax + 1),
			email: `${'e'.repeat(contactLimits.emailMax)}@example.com`,
			message: 'm'.repeat(contactLimits.messageMax + 1)
		});
		expect(result).toEqual({ kind: 'invalid', fields: ['name', 'email', 'message'] });
	});

	it('accepts a message of exactly the maximum length', () => {
		const result = validateContact({ ...valid, message: 'm'.repeat(contactLimits.messageMax) });
		expect(result.kind).toBe('valid');
	});

	it('rejects bodies that are not a JSON object', () => {
		for (const input of [null, 'text', 42, ['a']]) {
			expect(validateContact(input)).toEqual({ kind: 'invalid', fields: ['body'] });
		}
	});

	it('rejects non-string fields', () => {
		expect(validateContact({ name: 1, email: {}, message: [] })).toEqual({
			kind: 'invalid',
			fields: ['name', 'email', 'message']
		});
	});
});

describe('buildNote', () => {
	it('puts the name in the title and the email above the message', () => {
		expect(buildNote(valid)).toEqual({
			type: 'note',
			title: 'Website: Jana Nováková',
			body: 'jana@example.com\n\nHello Martin!'
		});
	});
});

describe('sendToPushbullet', () => {
	it('posts the note with the token in the Access-Token header', async () => {
		const fetchImpl = fakeFetch();
		await sendToPushbullet(valid, TOKEN, fetchImpl);

		expect(fetchImpl).toHaveBeenCalledOnce();
		const [url, init] = fetchImpl.mock.calls[0];
		expect(url).toBe(PUSHBULLET_URL);
		expect(init?.method).toBe('POST');
		expect(init?.headers).toEqual({ 'Access-Token': TOKEN, 'Content-Type': 'application/json' });
		expect(JSON.parse(init?.body as string)).toEqual(buildNote(valid));
		expect(init?.signal).toBeInstanceOf(AbortSignal);
	});

	it('throws on a non-2xx answer without revealing the token', async () => {
		const error = await sendToPushbullet(valid, TOKEN, fakeFetch(401)).catch((e: Error) => e);
		expect(error).toBeInstanceOf(Error);
		expect((error as Error).message).toBe('Pushbullet answered HTTP 401');
		expect((error as Error).message).not.toContain(TOKEN);
	});
});

describe('handleContact', () => {
	it('sends a valid message and answers 200', async () => {
		const fetchImpl = fakeFetch();
		const result = await handleContact(JSON.stringify(valid), { token: TOKEN, fetchImpl });
		expect(result).toEqual({ status: 200, jsonBody: { ok: true } });
		expect(fetchImpl).toHaveBeenCalledOnce();
	});

	it('answers a filled honeypot with 200 and sends nothing', async () => {
		const fetchImpl = fakeFetch();
		const body = JSON.stringify({ ...valid, website: 'x' });
		const result = await handleContact(body, { token: TOKEN, fetchImpl });
		expect(result).toEqual({ status: 200, jsonBody: { ok: true } });
		expect(fetchImpl).not.toHaveBeenCalled();
	});

	it('answers 400 with the invalid fields and sends nothing', async () => {
		const fetchImpl = fakeFetch();
		const body = JSON.stringify({ ...valid, email: 'nope' });
		const result = await handleContact(body, { token: TOKEN, fetchImpl });
		expect(result).toEqual({
			status: 400,
			jsonBody: { error: 'invalid_input', fields: ['email'] }
		});
		expect(fetchImpl).not.toHaveBeenCalled();
	});

	it('answers 400 to a body that is not JSON', async () => {
		const result = await handleContact('name=Jana', { token: TOKEN, fetchImpl: fakeFetch() });
		expect(result).toEqual({ status: 400, jsonBody: { error: 'invalid_input', fields: ['body'] } });
	});

	it('answers 400 to an oversized body before parsing it', async () => {
		const huge = JSON.stringify({ ...valid, message: 'm'.repeat(contactLimits.bodyMaxBytes) });
		const fetchImpl = fakeFetch();
		const result = await handleContact(huge, { token: TOKEN, fetchImpl });
		expect(result).toEqual({ status: 400, jsonBody: { error: 'invalid_input', fields: ['body'] } });
		expect(fetchImpl).not.toHaveBeenCalled();
	});

	it('answers 502 and reports the reason when Pushbullet fails', async () => {
		const onError = vi.fn();
		const result = await handleContact(JSON.stringify(valid), {
			token: TOKEN,
			fetchImpl: fakeFetch(500),
			onError
		});
		expect(result).toEqual({ status: 502, jsonBody: { error: 'send_failed' } });
		expect(onError).toHaveBeenCalledWith('Pushbullet answered HTTP 500');
	});

	it('answers 502 when the network fails', async () => {
		const fetchImpl = vi.fn(async () => {
			throw new TypeError('fetch failed');
		});
		const result = await handleContact(JSON.stringify(valid), { token: TOKEN, fetchImpl });
		expect(result).toEqual({ status: 502, jsonBody: { error: 'send_failed' } });
	});

	it('answers 502 without calling Pushbullet when the token is missing', async () => {
		const fetchImpl = fakeFetch();
		const onError = vi.fn();
		const result = await handleContact(JSON.stringify(valid), {
			token: undefined,
			fetchImpl,
			onError
		});
		expect(result).toEqual({ status: 502, jsonBody: { error: 'send_failed' } });
		expect(fetchImpl).not.toHaveBeenCalled();
		expect(onError).toHaveBeenCalledWith('PUSHBULLET_TOKEN is not set');
	});

	it('never passes the visitor message to the error reporter', async () => {
		const onError = vi.fn();
		await handleContact(JSON.stringify(valid), {
			token: TOKEN,
			fetchImpl: fakeFetch(500),
			onError
		});
		for (const [reason] of onError.mock.calls) expect(reason).not.toContain(valid.message);
	});
});
