<!--
	GitHub and LinkedIn logos from Font Awesome Free (brands).
	Icons: CC BY 4.0, https://fontawesome.com/license/free (attribution as required).
	Decorative: the link next to it carries the accessible name.
-->
<script lang="ts">
	import { faGithub } from '@fortawesome/free-brands-svg-icons/faGithub';
	import { faLinkedin } from '@fortawesome/free-brands-svg-icons/faLinkedin';

	let { name }: { name: 'github' | 'linkedin' } = $props();

	const icons = { github: faGithub, linkedin: faLinkedin };
	const [width, height, , , path] = $derived(icons[name].icon);
</script>

<svg
	class="brand-icon"
	viewBox="0 0 {width} {height}"
	aria-hidden="true"
	focusable="false"
	fill="currentColor"
>
	<path d={Array.isArray(path) ? path.join(' ') : path} />
</svg>

<style>
	.brand-icon {
		width: 1.25em;
		height: 1.25em;
		flex-shrink: 0;
	}
</style>
