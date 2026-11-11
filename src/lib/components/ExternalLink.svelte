<!--
	A link to another website. It opens in a new tab; the hidden text tells
	screen-reader users so. Content comes from the data files, so the URL is a variable.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		href,
		class: className = '',
		rel = '',
		children
	}: { href: string; class?: string; rel?: string; children: Snippet } = $props();

	// noopener: the new tab can't control this page. noreferrer: no referrer header is sent.
	const relValue = $derived([rel, 'noopener', 'noreferrer'].filter(Boolean).join(' '));
</script>

<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- external URL, not a route -->
<a {href} class={className} rel={relValue} target="_blank"
	>{@render children()}<span class="visually-hidden"> (opens in a new tab)</span></a
>
