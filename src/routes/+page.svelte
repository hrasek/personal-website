<script lang="ts">
	import Hero from '#lib/components/Hero.svelte';
	import TopBar from '#lib/components/TopBar.svelte';
</script>

<a class="skip-link" href="#main">Skip to content</a>

<div id="top"></div>
<TopBar />

<main id="main" tabindex="-1">
	<Hero />

	<!-- Placeholder sections: the anchor links need a target. Filled in later PRs. -->
	<section id="about" class="section container" aria-labelledby="about-title">
		<p class="eyebrow">01 — About</p>
		<h2 id="about-title">From lasers to code</h2>
		<p class="muted">TODO: About section.</p>
	</section>

	<section id="projects" class="section container" aria-labelledby="projects-title">
		<p class="eyebrow">02 — Projects</p>
		<h2 id="projects-title">Selected work</h2>
		<p class="muted">TODO: Projects section.</p>
	</section>

	<section id="experience" class="section container" aria-labelledby="experience-title">
		<p class="eyebrow">03 — Experience</p>
		<h2 id="experience-title">Where I have worked</h2>
		<p class="muted">TODO: Experience and Publication.</p>
	</section>

	<section id="skills" class="section container" aria-labelledby="skills-title">
		<p class="eyebrow">04 — Skills</p>
		<h2 id="skills-title">What I work with</h2>
		<p class="muted">TODO: Skills section.</p>
	</section>

	<section id="chess" class="section container" aria-labelledby="chess-title">
		<p class="eyebrow">05 — Beyond code</p>
		<h2 id="chess-title">Chess</h2>
		<p class="muted">TODO: Chess section.</p>
	</section>

	<section id="contact" class="section container" aria-labelledby="contact-title">
		<p class="eyebrow">06 — Contact</p>
		<h2 id="contact-title">Let's talk.</h2>
		<p class="muted">TODO: Contact section.</p>
	</section>
</main>

<style>
	main:focus {
		outline: none;
	}

	.skip-link {
		position: absolute;
		top: var(--space-2);
		left: var(--space-2);
		z-index: 20;
		padding: var(--space-2) var(--space-4);
		border-radius: var(--radius-sm);
		background: var(--color-accent);
		color: var(--color-on-accent);
		font-weight: 600;
		text-decoration: none;
		transform: translateY(-200%);
	}

	.skip-link:focus {
		transform: none;
	}

	section h2 {
		margin-top: var(--space-2);
		margin-bottom: var(--space-4);
	}
</style>
