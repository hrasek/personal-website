<script lang="ts">
	import experience from '../data/experience.json';
	import Publications from './Publications.svelte';
	import SectionHeading from './SectionHeading.svelte';

	const { jobs } = experience;
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

		<Publications />
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
</style>
