<script lang="ts">
	import projects from '../data/projects.json';
	import ExternalLink from './ExternalLink.svelte';
	import SectionHeading from './SectionHeading.svelte';
</script>

<section id="projects" class="section" aria-labelledby="projects-title">
	<div class="container">
		<SectionHeading id="projects-title" eyebrow="02 — Projects" title="Selected work" />
		<ul class="grid">
			{#each projects as project (project.title)}
				<li class="card">
					<h3>{project.title}</h3>
					<p class="muted">{project.description}</p>
					<p class="tags">
						<span class="visually-hidden">Technologies:</span>
						{project.tags.join(' · ')}
					</p>
					{#if project.url}
						<ExternalLink href={project.url} class="card-link">View on GitHub →</ExternalLink>
					{:else}
						<!-- TODO(content): project link -->
						<span class="card-link placeholder">[link]</span>
					{/if}
				</li>
			{/each}
		</ul>
	</div>
</section>

<style>
	.grid {
		display: grid;
		gap: var(--space-5);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	@media (min-width: 960px) {
		.grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	.card {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		padding: var(--space-6) var(--space-5);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		background: var(--color-surface);
	}

	.tags {
		font-family: var(--font-mono);
		font-size: var(--text-xs);
		color: var(--color-muted);
	}

	/* Pushes the link to the bottom so links line up across a row. */
	.card :global(.card-link) {
		margin-top: auto;
		padding-top: var(--space-2);
		color: var(--color-accent);
		font-weight: 600;
		text-decoration: none;
	}

	.card :global(.card-link:hover) {
		text-decoration: underline;
	}

	.placeholder {
		opacity: 0.6;
	}
</style>
