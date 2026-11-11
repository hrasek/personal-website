<script lang="ts">
	import About from '#lib/components/About.svelte';
	import ChessSection from '#lib/components/ChessSection.svelte';
	import Contact from '#lib/components/Contact.svelte';
	import Experience from '#lib/components/Experience.svelte';
	import Footer from '#lib/components/Footer.svelte';
	import Hero from '#lib/components/Hero.svelte';
	import Projects from '#lib/components/Projects.svelte';
	import Skills from '#lib/components/Skills.svelte';
	import TopBar from '#lib/components/TopBar.svelte';
</script>

<a class="skip-link" href="#main">Skip to content</a>

<div id="top"></div>
<TopBar />

<main id="main" tabindex="-1">
	<Hero />
	<About />
	<Projects />
	<Experience />
	<Skills />

	<ChessSection />

	<Contact />
</main>

<Footer />

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
</style>
