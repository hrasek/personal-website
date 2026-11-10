<script lang="ts">
	import profile from '../data/profile.json';

	// The page is prerendered, so this is the year of the last build.
	const year = new Date().getFullYear();
</script>

<footer>
	<div class="container inner">
		<p>© {year} {profile.name}</p>
		<a href="#top">Back to top ↑</a>
	</div>
</footer>

<style>
	footer {
		border-top: 1px solid var(--color-border);
		font-size: 0.875rem;
		color: var(--color-muted);
	}

	.inner {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: var(--space-3);
		padding-block: var(--space-5);
	}

	a {
		color: var(--color-accent);
		text-decoration: none;
	}

	a:hover {
		text-decoration: underline;
	}
</style>
