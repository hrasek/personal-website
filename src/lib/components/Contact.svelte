<script lang="ts">
	import contact from '../data/contact.json';
	import profile from '../data/profile.json';
	import BrandIcon from './BrandIcon.svelte';
	import ContactForm from './ContactForm.svelte';
	import ExternalLink from './ExternalLink.svelte';
	import SectionHeading from './SectionHeading.svelte';
</script>

<section id="contact" class="section" aria-labelledby="contact-title">
	<div class="container">
		<SectionHeading id="contact-title" eyebrow="06 — Contact" title={contact.title} />

		<div class="layout">
			<div class="intro">
				<p class="lead">{contact.text} {contact.languages}</p>

				<p class="links-label muted">{contact.directLinks}</p>
				<div class="actions">
					<ExternalLink href={profile.links.github} class="text-link" rel="me">
						<BrandIcon name="github" /><span>GitHub</span>
					</ExternalLink>
					<ExternalLink href={profile.links.linkedin} class="text-link" rel="me">
						<BrandIcon name="linkedin" /><span>LinkedIn</span>
					</ExternalLink>
				</div>
			</div>

			<ContactForm />
		</div>
	</div>
</section>

<style>
	/* One column at every width: text and links first, then the form. */
	.layout {
		display: grid;
		gap: var(--space-7);
	}

	.lead {
		font-size: 1.125rem;
	}

	.links-label {
		margin-top: var(--space-6);
		font-size: var(--text-sm);
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-3);
		margin-top: var(--space-2);
		/* Line the icons up with the text above. */
		margin-left: calc(-1 * var(--space-3));
	}

	.actions :global(.text-link) {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		min-height: 50px;
		padding: 0 var(--space-3);
		font-weight: 500;
		text-decoration: none;
	}

	.actions :global(.text-link span) {
		text-decoration: underline;
		text-underline-offset: 0.2em;
	}

	.actions :global(.text-link:hover) {
		color: var(--color-accent);
	}
</style>
