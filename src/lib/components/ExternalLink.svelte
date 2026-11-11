<!-- A link to another website. Content comes from the data files, so the URL is a variable. -->
<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		href,
		class: className = '',
		rel = undefined,
		children
	}: { href: string; class?: string; rel?: string; children: Snippet } = $props();
</script>

<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- external URL, not a route -->
<a {href} class={className} {rel}>{@render children()}</a>
