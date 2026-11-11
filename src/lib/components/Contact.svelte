<script lang="ts">
	import contact from '../data/contact.json';
	import profile from '../data/profile.json';
	import BrandIcon from './BrandIcon.svelte';
	import ExternalLink from './ExternalLink.svelte';
	import SectionHeading from './SectionHeading.svelte';
</script>

<section id="contact" class="section" aria-labelledby="contact-title">
	<div class="container">
		<SectionHeading id="contact-title" eyebrow="06 — Contact" title={contact.title} />
		<p class="lead">{contact.text} {contact.languages}</p>

		<div class="actions">
			{#if contact.email}
				<a class="btn btn-primary" href="mailto:{contact.email}">{contact.email}</a>
			{:else}
				<!-- TODO(content): email address on the domain, once it exists -->
				<span class="btn btn-primary placeholder" aria-disabled="true">[email]</span>
			{/if}
			<ExternalLink href={profile.links.github} class="text-link" rel="me">
				<BrandIcon name="github" /><span>GitHub</span>
			</ExternalLink>
			<ExternalLink href={profile.links.linkedin} class="text-link" rel="me">
				<BrandIcon name="linkedin" /><span>LinkedIn</span>
			</ExternalLink>
		</div>
	</div>
</section>

<style>
	.lead {
		font-size: 1.125rem;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-3);
		margin-top: var(--space-6);
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

	.placeholder {
		opacity: 0.55;
		cursor: not-allowed;
	}
</style>
