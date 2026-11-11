<script lang="ts">
	import experience from '../data/experience.json';
	import { doiUrl, sortNewestFirst, summarize, type Publication } from '../publications';
	import ExternalLink from './ExternalLink.svelte';

	const publications = experience.publications as Publication[];
	const journals = sortNewestFirst(publications.filter((p) => p.type === 'journal'));
	const conferences = sortNewestFirst(publications.filter((p) => p.type === 'conference'));
</script>

<section class="publications" aria-labelledby="publications-title">
	<h3 id="publications-title" class="eyebrow">Publications</h3>
	<p class="summary">{summarize(publications)}</p>

	{#each journals as article (article.doi)}
		<article class="featured">
			<p class="label">Journal article</p>
			<h4>{article.title}</h4>
			<p class="venue">
				{article.venue} · {article.year}
				{#if article.firstAuthor}<span class="tag">First author</span>{/if}
			</p>
			<ExternalLink href={doiUrl(article.doi)} class="doi-link">
				doi.org/{article.doi} →
			</ExternalLink>
		</article>
	{/each}

	{#if conferences.length}
		<h4 class="list-title">Conference papers</h4>
		<ol class="list">
			{#each conferences as paper (paper.doi)}
				<li>
					<p class="year">{paper.year}</p>
					<div>
						<p class="title">
							{paper.title}
							{#if paper.firstAuthor}<span class="tag">First author</span>{/if}
						</p>
						<p class="venue">
							<span title={paper.venueShort ? paper.venue : undefined}
								>{paper.venueShort ?? paper.venue}</span
							>
							·
							<ExternalLink href={doiUrl(paper.doi)} class="doi-link">DOI →</ExternalLink>
						</p>
					</div>
				</li>
			{/each}
		</ol>
	{/if}
</section>

<style>
	.publications {
		max-width: 900px;
		margin-top: var(--space-8);
	}

	h3.eyebrow {
		font-weight: 400;
	}

	.summary {
		margin: var(--space-2) 0 var(--space-5);
		font-size: var(--text-lead);
		font-weight: 600;
	}

	.featured {
		padding: var(--space-6) var(--space-5);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		background: var(--color-bg);
	}

	.label {
		font-family: var(--font-mono);
		font-size: var(--text-xs);
		color: var(--color-muted);
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.featured h4 {
		margin: var(--space-2) 0;
		font-size: 1.25rem;
		line-height: 1.4;
		text-wrap: pretty;
	}

	.venue {
		color: var(--color-muted);
		font-size: var(--text-sm);
	}

	.tag {
		display: inline-block;
		margin-left: var(--space-2);
		padding: 0 var(--space-2);
		border: 1px solid var(--color-accent);
		border-radius: var(--radius-pill);
		color: var(--color-accent);
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 400;
		line-height: 1.6;
		white-space: nowrap;
		vertical-align: 0.1em;
	}

	.publications :global(.doi-link) {
		color: var(--color-accent);
		font-weight: 600;
		text-decoration: none;
	}

	.publications :global(.doi-link:hover) {
		text-decoration: underline;
	}

	.featured :global(.doi-link) {
		display: inline-block;
		margin-top: var(--space-3);
	}

	.list-title {
		margin: var(--space-7) 0 var(--space-2);
		font-size: var(--text-base);
	}

	.list {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.list li {
		display: grid;
		gap: var(--space-1);
		padding-block: var(--space-4);
		border-bottom: 1px solid var(--color-border);
	}

	.list li:last-child {
		border-bottom: 0;
	}

	@media (min-width: 640px) {
		.list li {
			grid-template-columns: 80px 1fr;
			gap: var(--space-5);
		}
	}

	.year {
		font-family: var(--font-mono);
		font-size: 0.875rem;
		color: var(--color-muted);
		padding-top: 0.15em;
	}

	.title {
		font-weight: 600;
		text-wrap: pretty;
	}
</style>
