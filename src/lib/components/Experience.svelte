<script lang="ts">
	import experience from '../data/experience.json';
	import ExternalLink from './ExternalLink.svelte';
	import SectionHeading from './SectionHeading.svelte';

	const { jobs, publication } = experience;
</script>

<section id="experience" class="section band" aria-labelledby="experience-title">
	<div class="container">
		<SectionHeading id="experience-title" eyebrow="03 — Experience" title="Where I have worked" />

		<ol class="timeline">
			{#each jobs as job (job.role)}
				<li>
					<p class="period">{job.period}</p>
					<div>
						<h3>{job.role}</h3>
						<p class="muted">{job.organization} · {job.details}</p>
					</div>
				</li>
			{/each}
		</ol>

		<article class="publication" aria-labelledby="publication-title">
			<p class="eyebrow">Publication</p>
			<h3 id="publication-title">{publication.title}</h3>
			{#if publication.summary}
				<p class="muted">{publication.summary}</p>
			{:else}
				<!-- TODO(content): one plain-language sentence on what the paper shows -->
				<p class="muted">[One plain-language sentence on what the paper shows.]</p>
			{/if}
			<ExternalLink href="https://doi.org/{publication.doi}" class="doi-link">
				doi.org/{publication.doi} →
			</ExternalLink>
		</article>
	</div>
</section>

<style>
	.timeline {
		max-width: 840px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.timeline li {
		display: grid;
		gap: var(--space-1);
		padding-block: var(--space-5);
		border-bottom: 1px solid var(--color-border);
	}

	.timeline li:first-child {
		padding-top: 0;
	}

	.timeline li:last-child {
		border-bottom: 0;
	}

	@media (min-width: 640px) {
		.timeline li {
			grid-template-columns: 200px 1fr;
			gap: var(--space-5);
		}
	}

	.period {
		font-family: var(--font-mono);
		font-size: 0.875rem;
		color: var(--color-muted);
		padding-top: 0.2em;
	}

	h3 {
		font-size: 1.25rem;
	}

	.publication {
		max-width: 900px;
		margin-top: var(--space-7);
		padding: var(--space-6) var(--space-5);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		background: var(--color-bg);
	}

	.publication h3 {
		margin: var(--space-2) 0 var(--space-3);
	}

	.publication :global(.doi-link) {
		display: inline-block;
		margin-top: var(--space-3);
		color: var(--color-accent);
		font-weight: 600;
		text-decoration: none;
	}

	.publication :global(.doi-link:hover) {
		text-decoration: underline;
	}
</style>
