import { describe, expect, it, vi } from 'vitest';
import { contactLimits } from '../../api/src/lib/contact';
import { formLimits, invalidFields, submitContact, type FormValues } from './contact-form';

const valid: FormValues = {
	name: 'Jana Nováková',
	email: 'jana@example.com',
	message: 'Hello Martin!',
	website: ''
};

function answer(status: number, body?: unknown) {
	return vi.fn<(url: string, init?: RequestInit) => Promise<Response>>(
		async () =>
			new Response(body === undefined ? '' : JSON.stringify(body), {
				status,
				headers: { 'Content-Type': 'application/json' }
			})
	);
}

describe('formLimits', () => {
	it('matches the limits of the API', () => {
		expect(formLimits).toEqual({
			nameMax: contactLimits.nameMax,
			emailMax: contactLimits.emailMax,
			messageMax: contactLimits.messageMax
		});
	});
});

describe('invalidFields', () => {
	it('accepts a complete form', () => {
		expect(invalidFields(valid)).toEqual([]);
	});

	it('lists empty and malformed fields', () => {
		expect(invalidFields({ name: ' ', email: 'jana@', message: '\n', website: '' })).toEqual([
			'name',
			'email',
			'message'
		]);
	});

	it('rejects a message over the limit and accepts one at the limit', () => {
		const at = { ...valid, message: 'm'.repeat(formLimits.messageMax) };
		const over = { ...valid, message: 'm'.repeat(formLimits.messageMax + 1) };
		expect(invalidFields(at)).toEqual([]);
		expect(invalidFields(over)).toEqual(['message']);
	});
});

describe('submitContact', () => {
	it('posts the values as JSON to /api/contact', async () => {
		const fetchImpl = answer(200, { ok: true });
		expect(await submitContact(valid, fetchImpl)).toEqual({ kind: 'sent' });

		const [url, init] = fetchImpl.mock.calls[0];
		expect(url).toBe('/api/contact');
		expect(init?.method).toBe('POST');
		expect(JSON.parse(init?.body as string)).toEqual(valid);
		expect(init?.signal).toBeInstanceOf(AbortSignal);
	});

	it('returns the invalid fields from a 400 answer', async () => {
		const fetchImpl = answer(400, { error: 'invalid_input', fields: ['email', 'unknown'] });
		expect(await submitContact(valid, fetchImpl)).toEqual({ kind: 'invalid', fields: ['email'] });
	});

	it('treats a 400 without known fields as a failure', async () => {
		const fetchImpl = answer(400, { error: 'invalid_input', fields: ['body'] });
		expect(await submitContact(valid, fetchImpl)).toEqual({ kind: 'failed' });
	});

	it('treats a 502 or another error status as a failure', async () => {
		expect(await submitContact(valid, answer(502, { error: 'send_failed' }))).toEqual({
			kind: 'failed'
		});
		expect(await submitContact(valid, answer(404))).toEqual({ kind: 'failed' });
	});

	it('treats a network error or timeout as a failure', async () => {
		const fetchImpl = vi.fn(async () => {
			throw new DOMException('The operation timed out.', 'TimeoutError');
		});
		expect(await submitContact(valid, fetchImpl)).toEqual({ kind: 'failed' });
	});
});
