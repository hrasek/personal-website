<script lang="ts">
	import { tick } from 'svelte';
	import {
		formLimits,
		invalidFields,
		submitContact,
		type Field,
		type FormValues
	} from '../contact-form';
	import contact from '../data/contact.json';
	import profile from '../data/profile.json';
	import ExternalLink from './ExternalLink.svelte';

	// TODO(content): the form copy in contact.json is a draft; rewrite it in your own words.
	const copy = contact.form;

	let values = $state<FormValues>({ name: '', email: '', message: '', website: '' });
	let errors = $state<Field[]>([]);
	let status = $state<'idle' | 'sending' | 'sent' | 'failed'>('idle');

	const inputs: Partial<Record<Field, HTMLInputElement | HTMLTextAreaElement>> = {};
	const messageLength = $derived(values.message.length);

	function hasError(field: Field): boolean {
		return errors.includes(field);
	}

	/** Once a field has an error, re-check it while the visitor types. */
	function recheck(field: Field) {
		if (!hasError(field)) return;
		if (!invalidFields(values).includes(field)) errors = errors.filter((f) => f !== field);
	}

	async function showErrors(fields: Field[]) {
		errors = fields;
		status = 'idle';
		await tick();
		inputs[fields[0]]?.focus();
	}

	async function onsubmit(event: SubmitEvent) {
		event.preventDefault();
		if (status === 'sending') return;

		const invalid = invalidFields(values);
		if (invalid.length > 0) return showErrors(invalid);

		errors = [];
		status = 'sending';
		const result = await submitContact(values);

		if (result.kind === 'invalid') return showErrors(result.fields);
		if (result.kind === 'sent') values = { name: '', email: '', message: '', website: '' };
		status = result.kind;
	}
</script>

<form class="form" novalidate {onsubmit} aria-describedby="contact-privacy">
	<div class="field">
		<label for="contact-name">{copy.nameLabel}</label>
		<input
			id="contact-name"
			name="name"
			type="text"
			autocomplete="name"
			required
			maxlength={formLimits.nameMax}
			bind:value={values.name}
			bind:this={inputs.name}
			oninput={() => recheck('name')}
			aria-invalid={hasError('name')}
			aria-describedby={hasError('name') ? 'contact-name-error' : undefined}
		/>
		{#if hasError('name')}
			<p id="contact-name-error" class="error">{copy.errors.name}</p>
		{/if}
	</div>

	<div class="field">
		<label for="contact-email">{copy.emailLabel}</label>
		<input
			id="contact-email"
			name="email"
			type="email"
			autocomplete="email"
			required
			maxlength={formLimits.emailMax}
			bind:value={values.email}
			bind:this={inputs.email}
			oninput={() => recheck('email')}
			aria-invalid={hasError('email')}
			aria-describedby={hasError('email') ? 'contact-email-error' : undefined}
		/>
		{#if hasError('email')}
			<p id="contact-email-error" class="error">{copy.errors.email}</p>
		{/if}
	</div>

	<div class="field">
		<div class="label-row">
			<label for="contact-message">{copy.messageLabel}</label>
			<span class="count" aria-hidden="true">{messageLength} / {formLimits.messageMax}</span>
		</div>
		<textarea
			id="contact-message"
			name="message"
			rows="6"
			required
			maxlength={formLimits.messageMax}
			bind:value={values.message}
			bind:this={inputs.message}
			oninput={() => recheck('message')}
			aria-invalid={hasError('message')}
			aria-describedby={hasError('message') ? 'contact-message-error' : undefined}></textarea>
		{#if hasError('message')}
			<p id="contact-message-error" class="error">{copy.errors.message}</p>
		{/if}
	</div>

	<!-- Honeypot: invisible to people and skipped by the keyboard; bots tend to fill it in. -->
	<div class="honeypot" aria-hidden="true">
		<label for="contact-website">Leave this field empty</label>
		<input
			id="contact-website"
			name="website"
			type="text"
			tabindex="-1"
			autocomplete="off"
			bind:value={values.website}
		/>
	</div>

	<div class="submit-row">
		<button class="btn btn-primary" type="submit" aria-disabled={status === 'sending'}>
			{status === 'sending' ? copy.sending : copy.submit}
		</button>
	</div>

	<div class="after">
		<!-- Always in the page, so screen readers announce what appears inside it. -->
		<div role="status">
			{#if status === 'sent'}
				<p class="sent">{copy.sent}</p>
			{:else if status === 'failed'}
				<p class="failed">
					{copy.failed}
					<ExternalLink href={profile.links.linkedin}>LinkedIn</ExternalLink>.
				</p>
			{/if}
		</div>
		<p id="contact-privacy" class="privacy">{copy.privacy}</p>
	</div>
</form>

<noscript>
	<p class="noscript">
		{copy.noScript}
		<ExternalLink href={profile.links.linkedin}>LinkedIn</ExternalLink>.
	</p>
</noscript>

<style>
	.form {
		display: grid;
		gap: var(--space-5);
		max-width: 560px;
	}

	.field {
		display: grid;
		gap: var(--space-2);
	}

	.label-row {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: var(--space-3);
	}

	label {
		font-weight: 600;
	}

	.count {
		font-family: var(--font-mono);
		font-size: var(--text-xs);
		color: var(--color-muted);
	}

	input,
	textarea {
		width: 100%;
		min-height: 50px;
		padding: var(--space-3) var(--space-4);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		background: var(--color-surface);
		color: var(--color-text);
		font: inherit;
		transition: border-color 0.15s ease;
	}

	textarea {
		resize: vertical;
		min-height: 9rem;
	}

	input:hover,
	textarea:hover {
		border-color: var(--color-muted);
	}

	input:focus-visible,
	textarea:focus-visible {
		border-color: var(--color-accent);
		outline-offset: 0;
	}

	[aria-invalid='true'],
	[aria-invalid='true']:focus-visible {
		border-color: var(--color-danger);
	}

	.error {
		font-size: var(--text-sm);
		color: var(--color-danger);
	}

	.honeypot {
		position: absolute;
		left: -10000px;
		width: 1px;
		height: 1px;
		overflow: hidden;
	}

	button[aria-disabled='true'] {
		opacity: 0.7;
		cursor: progress;
	}

	.sent,
	.failed {
		margin-bottom: var(--space-3);
	}

	.sent {
		color: var(--color-accent);
		font-weight: 500;
	}

	.failed {
		color: var(--color-danger);
	}

	.failed :global(a) {
		color: var(--color-text);
	}

	.privacy,
	.noscript {
		font-size: var(--text-sm);
		color: var(--color-muted);
	}
</style>
