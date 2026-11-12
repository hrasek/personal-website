<script lang="ts">
	import { onMount } from 'svelte';
	import {
		formatDay,
		isChessApiResponse,
		mergeRatings,
		ratingCards,
		type ChessRatings
	} from '../chess';
	import content from '../data/beyond-code.json';
	import stored from '../data/chess.json';
	import ExternalLink from './ExternalLink.svelte';
	import SectionHeading from './SectionHeading.svelte';

	// Stored values render first (and are all a visitor without JavaScript sees).
	let ratings = $state<ChessRatings>(stored as ChessRatings);
	const cards = $derived(ratingCards(ratings));

	// Then ask /api/chess for live values. Any failure keeps the stored values;
	// during `npm run dev` the endpoint doesn't exist, which is expected.
	onMount(async () => {
		try {
			const response = await fetch('/api/chess', { signal: AbortSignal.timeout(8000) });
			if (!response.ok) return;
			const live: unknown = await response.json();
			if (isChessApiResponse(live)) ratings = mergeRatings(ratings, live);
		} catch {
			// Network error, timeout or invalid JSON: keep the stored values.
		}
	});
	const profileUrl = content.chesscomProfileUrl as string | null;
</script>

<section id="chess" class="section band" aria-labelledby="chess-title">
	<div class="container">
		<SectionHeading id="chess-title" eyebrow="05 — Beyond code" title={content.title} />

		<div class="chess">
			<div class="prose">
				{#each content.paragraphs as paragraph, i (i)}
					<p class:muted={i > 0}>{paragraph}</p>
				{/each}
			</div>

			<ul class="ratings" aria-label="Chess ratings">
				{#each cards as card (card.label)}
					<li class="card">
						<p class="label">{card.label}</p>
						<p class="rating">{card.rating}</p>
						<p class="note">{card.note}</p>
					</li>
				{/each}
			</ul>

			<p class="source">
				Ratings from Chess.com and FIDE, updated {formatDay(ratings.fetchedAt)}. Formats without a
				game in the last 12 months are hidden.
			</p>

			{#if profileUrl}
				<ExternalLink href={profileUrl} class="profile-link">Chess.com profile →</ExternalLink>
			{/if}
		</div>
	</div>
</section>

<style>
	.chess {
		max-width: 600px;
	}

	.prose p + p {
		margin-top: var(--space-4);
	}

	.ratings {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-4);
		margin: var(--space-6) 0 0;
		padding: 0;
		list-style: none;
	}

	@media (min-width: 640px) {
		.ratings {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	.card {
		padding: var(--space-5) var(--space-4);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		background: var(--color-bg);
	}

	.label {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: var(--color-muted);
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.rating {
		font-size: 2.25rem;
		font-weight: 700;
		line-height: 1.2;
		letter-spacing: -0.02em;
	}

	.note {
		font-size: 0.875rem;
		color: var(--color-muted);
	}

	.source {
		margin-top: var(--space-5);
		font-size: 0.875rem;
		color: var(--color-muted);
	}

	.chess :global(.profile-link) {
		display: inline-block;
		margin-top: var(--space-4);
		color: var(--color-accent);
		font-weight: 600;
		text-decoration: none;
	}

	.chess :global(.profile-link:hover) {
		text-decoration: underline;
	}
</style>
