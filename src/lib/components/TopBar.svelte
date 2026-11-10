<script lang="ts">
	import navigation from '../data/navigation.json';
	import ThemeToggle from './ThemeToggle.svelte';

	let menuOpen = $state(false);

	function closeMenu() {
		menuOpen = false;
	}

	function onKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && menuOpen) closeMenu();
	}
</script>

<svelte:window onkeydown={onKeydown} />

<header class="top-bar">
	<div class="inner">
		<a class="logo" href="#top"
			>MH<span class="dot">.</span><span class="visually-hidden">
				Martin Hošek, back to top</span
			></a
		>

		<div class="controls">
			<button
				type="button"
				class="menu-button"
				aria-expanded={menuOpen}
				aria-controls="site-nav"
				onclick={() => (menuOpen = !menuOpen)}
			>
				{menuOpen ? 'Close' : 'Menu'}
			</button>
			<ThemeToggle />
		</div>

		<nav id="site-nav" class:open={menuOpen} aria-label="Sections">
			<ul>
				{#each navigation as item (item.id)}
					<li><a href="#{item.id}" onclick={closeMenu}>{item.label}</a></li>
				{/each}
			</ul>
		</nav>
	</div>
</header>

<style>
	.top-bar {
		position: sticky;
		top: 0;
		z-index: 10;
		background: color-mix(in srgb, var(--color-bg) 92%, transparent);
		backdrop-filter: blur(8px);
		border-bottom: 1px solid var(--color-border);
	}

	.inner {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-3);
		padding: var(--space-3) var(--container-pad);
	}

	.logo {
		font-family: var(--font-mono);
		font-size: 1.125rem;
		font-weight: 500;
		text-decoration: none;
	}

	.logo .dot {
		color: var(--color-accent);
	}

	.controls {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.menu-button {
		min-height: 44px;
		padding: 0 var(--space-4);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		background: var(--color-surface);
		color: var(--color-text);
		font: inherit;
		font-size: var(--text-sm);
		cursor: pointer;
	}

	/* Mobile: the links open below the bar as a list. */
	nav {
		display: none;
		flex-basis: 100%;
	}

	nav.open {
		display: block;
	}

	ul {
		margin: 0;
		padding: var(--space-2) 0 var(--space-3);
		list-style: none;
	}

	nav a {
		display: block;
		padding: var(--space-3) 0;
		color: var(--color-muted);
		font-size: 1rem;
		text-decoration: none;
	}

	nav a:hover {
		color: var(--color-text);
	}

	/* From 640 px: links in one row, no menu button. */
	@media (min-width: 640px) {
		.inner {
			flex-wrap: nowrap;
			padding-block: var(--space-5);
		}

		.menu-button {
			display: none;
		}

		nav {
			display: block;
			flex-basis: auto;
			margin-left: auto;
		}

		ul {
			display: flex;
			gap: var(--space-5);
			padding: 0;
		}

		nav a {
			padding: 0;
			font-size: var(--text-sm);
		}

		.controls {
			order: 3;
		}
	}
</style>
