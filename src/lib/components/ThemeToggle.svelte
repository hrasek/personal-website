<script lang="ts">
	import { onMount } from 'svelte';
	import { THEME_STORAGE_KEY, isTheme, nextTheme, type Theme } from '../theme';

	let theme = $state<Theme>('light');

	onMount(() => {
		const current = document.documentElement.dataset.theme;
		if (isTheme(current)) theme = current;
	});

	function toggle() {
		theme = nextTheme(theme);
		document.documentElement.dataset.theme = theme;
		try {
			localStorage.setItem(THEME_STORAGE_KEY, theme);
		} catch {
			// Storage can be blocked (private mode, strict settings); the toggle still works.
		}
	}
</script>

<button
	type="button"
	class="theme-toggle"
	onclick={toggle}
	aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
>
	{theme === 'dark' ? 'Dark' : 'Light'}
</button>

<style>
	.theme-toggle {
		min-width: 44px;
		height: 44px;
		padding: 0 var(--space-3);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-pill);
		background: var(--color-surface);
		color: var(--color-text);
		font-family: var(--font-mono);
		font-size: var(--text-xs);
		cursor: pointer;
	}

	.theme-toggle:hover {
		border-color: var(--color-accent);
	}
</style>
