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

<!-- The accessible name starts with the visible text (WCAG 2.5.3, label in name). -->
<button type="button" class="theme-toggle" onclick={toggle}>
	{theme === 'dark' ? 'Dark' : 'Light'}<span class="visually-hidden"
		>{theme === 'dark' ? ' theme, switch to light mode' : ' theme, switch to dark mode'}</span
	>
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
