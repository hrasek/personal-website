<!--
	Temporary page to check the design tokens in light and dark mode.
	It is replaced section by section in the next PRs.
-->
<script lang="ts">
	import ThemeToggle from '#lib/components/ThemeToggle.svelte';
</script>

<main class="container section">
	<div class="toggle-row">
		<ThemeToggle />
	</div>

	<p class="hero-eyebrow">Software engineer · PhD in physics</p>
	<h1>Martin Hošek</h1>
	<p class="lead">TODO(content): one-line introduction for the hero.</p>

	<div class="actions">
		<a class="btn btn-primary" href="#sample">Primary button</a>
		<a class="btn btn-secondary" href="#sample">Secondary button</a>
	</div>

	<section id="sample" class="section">
		<p class="eyebrow">00 — Sample</p>
		<h2>Section heading</h2>
		<div class="prose">
			<p>
				Body text at 17 px with a line height of 1.6. <span class="muted">Muted text</span> and
				<a href="#sample">a link</a>.
			</p>
		</div>
	</section>
</main>

<style>
	.toggle-row {
		display: flex;
		justify-content: flex-end;
		margin-bottom: var(--space-7);
	}

	.hero-eyebrow {
		font-family: var(--font-mono);
		font-size: 0.875rem;
		color: var(--color-accent);
		margin-bottom: var(--space-4);
	}

	h1 {
		margin-bottom: var(--space-5);
	}

	h2 {
		margin-top: var(--space-2);
		margin-bottom: var(--space-4);
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3);
		margin-top: var(--space-6);
	}
</style>
