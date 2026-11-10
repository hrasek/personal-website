<script lang="ts">
	let { id, eyebrow, title }: { id: string; eyebrow: string; title: string } = $props();
</script>

<p class="eyebrow">{eyebrow}</p>
<h2 {id}>{title}</h2>

<style>
	h2 {
		margin-top: var(--space-2);
		margin-bottom: var(--space-6);
	}
</style>
