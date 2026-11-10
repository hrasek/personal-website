<script lang="ts">
	import about from '../data/about.json';
	import SectionHeading from './SectionHeading.svelte';
</script>

<section id="about" class="section band" aria-labelledby="about-title">
	<div class="container">
		<SectionHeading id="about-title" eyebrow="01 — About" title={about.title} />
		<div class="prose">
			{#each about.paragraphs as paragraph, i (i)}
				<p>{paragraph}</p>
			{/each}
		</div>
	</div>
</section>

<style>
	.prose p + p {
		margin-top: var(--space-4);
	}
</style>
