<script lang="ts">
	import { absoluteUrl, site } from '../site';

	// All null until site.url is set in data/site.json (see site.ts).
	const canonical = absoluteUrl(site.url, '/');
	const image = absoluteUrl(site.url, site.image.path);
</script>

<svelte:head>
	<title>{site.title}</title>
	<meta name="description" content={site.description} />

	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="Martin Hošek" />
	<meta property="og:locale" content={site.locale} />
	<meta property="og:title" content={site.title} />
	<meta property="og:description" content={site.description} />
	<meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />

	{#if canonical}
		<link rel="canonical" href={canonical} />
		<meta property="og:url" content={canonical} />
	{/if}

	{#if image}
		<meta property="og:image" content={image} />
		<meta property="og:image:type" content="image/png" />
		<meta property="og:image:width" content={String(site.image.width)} />
		<meta property="og:image:height" content={String(site.image.height)} />
		<meta property="og:image:alt" content={site.image.alt} />
	{/if}
</svelte:head>
