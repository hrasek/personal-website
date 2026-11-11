<script lang="ts">
	import skills from '../data/skills.json';
	import SectionHeading from './SectionHeading.svelte';
</script>

<section id="skills" class="section" aria-labelledby="skills-title">
	<div class="container">
		<SectionHeading id="skills-title" eyebrow="04 — Skills" title="What I work with" />
		<div class="groups">
			{#each skills as skill (skill.group)}
				<div>
					<h3>{skill.group}</h3>
					<ul>
						{#each skill.items as item (item)}
							<li>{item}</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	.groups {
		display: grid;
		gap: var(--space-6);
	}

	@media (min-width: 640px) {
		.groups {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (min-width: 960px) {
		.groups {
			grid-template-columns: repeat(4, 1fr);
		}
	}

	h3 {
		font-size: var(--text-base);
		margin-bottom: var(--space-3);
	}

	ul {
		margin: 0;
		padding: 0;
		list-style: none;
		font-family: var(--font-mono);
		font-size: 0.875rem;
		line-height: 1.9;
		color: var(--color-muted);
	}
</style>
