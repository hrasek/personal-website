<script lang="ts">
	import profile from '../data/profile.json';
	import BrandIcon from './BrandIcon.svelte';
	import ExternalLink from './ExternalLink.svelte';

	// Decorative 8 x 8 board; alternating squares.
	const squares = Array.from({ length: 64 }, (_, i) => (Math.floor(i / 8) + i) % 2 === 1);
</script>

<section class="hero container" aria-labelledby="hero-title">
	<div class="text">
		<p class="role">{profile.role}</p>
		<h1 id="hero-title">{profile.name}</h1>
		<p class="lead">{profile.intro}</p>

		<div class="actions">
			<a class="btn btn-primary" href="#projects">See projects</a>
			{#if profile.cvUrl}
				<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- static file, not a route -->
				<a class="btn btn-secondary" href={profile.cvUrl} download>Download CV (PDF)</a>
			{:else}
				<!-- TODO(content): add static/cv.pdf and set cvUrl in profile.json -->
				<span class="btn btn-secondary placeholder" aria-disabled="true"> Download CV (PDF) </span>
			{/if}
			<ExternalLink href={profile.links.github} class="text-link" rel="me">
				<BrandIcon name="github" /><span>GitHub</span>
			</ExternalLink>
			<ExternalLink href={profile.links.linkedin} class="text-link" rel="me">
				<BrandIcon name="linkedin" /><span>LinkedIn</span>
			</ExternalLink>
		</div>
	</div>

	<div class="board" aria-hidden="true">
		{#each squares as dark, i (i)}
			<span class:dark></span>
		{/each}
	</div>
</section>

<style>
	.hero {
		display: grid;
		gap: var(--space-7);
		align-items: center;
		padding-block: var(--space-8) var(--section-pad);
	}

	.role {
		margin-bottom: var(--space-4);
		font-family: var(--font-mono);
		font-size: 0.875rem;
		color: var(--color-accent);
	}

	h1 {
		margin-bottom: var(--space-5);
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

	.board {
		display: none;
	}

	/* The board only appears on wide screens, next to the text. */
	@media (min-width: 960px) {
		.hero {
			grid-template-columns: 1fr auto;
			padding-block: 6rem var(--section-pad);
		}

		.board {
			display: grid;
			grid-template-columns: repeat(8, 40px);
			grid-auto-rows: 40px;
			overflow: hidden;
			border: 1px solid var(--color-border);
			border-radius: var(--radius-md);
			background: var(--color-surface);
		}

		.board .dark {
			background: color-mix(in srgb, var(--color-accent) 14%, var(--color-surface));
		}
	}
</style>
