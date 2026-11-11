import { describe, expect, it } from 'vitest';
import { doiUrl, sortNewestFirst, summarize, type Publication } from './publications';

const paper = (type: Publication['type'], year: number): Publication => ({
	type,
	title: `${type} ${year}`,
	venue: 'Venue',
	year,
	firstAuthor: true,
	doi: '10.1000/test'
});

describe('summarize', () => {
	it('counts journal articles and conference papers', () => {
		const list = [paper('journal', 2022), paper('conference', 2021), paper('conference', 2023)];
		expect(summarize(list)).toBe('1 journal article · 2 conference papers');
	});

	it('uses the singular for one conference paper', () => {
		expect(summarize([paper('conference', 2021)])).toBe('1 conference paper');
	});

	it('leaves out empty groups and returns an empty string for no papers', () => {
		expect(summarize([paper('journal', 2020), paper('journal', 2021)])).toBe('2 journal articles');
		expect(summarize([])).toBe('');
	});
});

describe('sortNewestFirst', () => {
	it('sorts by year, newest first, without changing the input', () => {
		const list = [paper('conference', 2018), paper('conference', 2023), paper('conference', 2021)];
		expect(sortNewestFirst(list).map((p) => p.year)).toEqual([2023, 2021, 2018]);
		expect(list.map((p) => p.year)).toEqual([2018, 2023, 2021]);
	});
});

describe('doiUrl', () => {
	it('builds a doi.org link, also for DOIs with slashes', () => {
		expect(doiUrl('10.1109/EFTF/IFCS57587.2023.10272040')).toBe(
			'https://doi.org/10.1109/EFTF/IFCS57587.2023.10272040'
		);
	});
});
