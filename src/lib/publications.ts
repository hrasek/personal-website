export type PublicationType = 'journal' | 'conference';

export interface Publication {
	type: PublicationType;
	title: string;
	venue: string;
	venueShort?: string;
	year: number;
	firstAuthor: boolean;
	doi: string;
}

/** Newest first; the original order decides between papers of the same year. */
export function sortNewestFirst<T extends { year: number }>(items: readonly T[]): T[] {
	return [...items].sort((a, b) => b.year - a.year);
}

function plural(count: number, singular: string, pluralForm: string): string {
	return `${count} ${count === 1 ? singular : pluralForm}`;
}

/** For example "1 journal article · 4 conference papers". Empty groups are left out. */
export function summarize(publications: readonly Publication[]): string {
	const journals = publications.filter((p) => p.type === 'journal').length;
	const conferences = publications.filter((p) => p.type === 'conference').length;
	const parts: string[] = [];
	if (journals) parts.push(plural(journals, 'journal article', 'journal articles'));
	if (conferences) parts.push(plural(conferences, 'conference paper', 'conference papers'));
	return parts.join(' · ');
}

export function doiUrl(doi: string): string {
	return `https://doi.org/${doi}`;
}
