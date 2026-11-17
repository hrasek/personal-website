import { describe, expect, it } from 'vitest';
import { absoluteUrl, buildRobots, buildSitemap, normaliseBaseUrl } from './site';

describe('normaliseBaseUrl', () => {
	it('returns null when no URL is set', () => {
		expect(normaliseBaseUrl(null)).toBeNull();
		expect(normaliseBaseUrl('')).toBeNull();
	});

	it('rejects invalid URLs and other protocols', () => {
		expect(normaliseBaseUrl('example.com')).toBeNull();
		expect(normaliseBaseUrl('ftp://example.com')).toBeNull();
	});

	it('removes trailing slashes, query and hash', () => {
		expect(normaliseBaseUrl('https://example.com/')).toBe('https://example.com');
		expect(normaliseBaseUrl('https://example.com/sub//?a=1#x')).toBe('https://example.com/sub');
	});
});

describe('absoluteUrl', () => {
	it('joins the base and the path', () => {
		expect(absoluteUrl('https://example.com/', '/og-image.png')).toBe(
			'https://example.com/og-image.png'
		);
		expect(absoluteUrl('https://example.com', 'cv.pdf')).toBe('https://example.com/cv.pdf');
	});

	it('returns null without a base URL', () => {
		expect(absoluteUrl(null, '/')).toBeNull();
	});
});

describe('buildSitemap', () => {
	it('lists the pages when a base URL is set', () => {
		const xml = buildSitemap('https://example.com', ['/']);
		expect(xml).toContain('<loc>https://example.com/</loc>');
		expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
	});

	it('is a valid empty sitemap without a base URL', () => {
		const xml = buildSitemap(null, ['/']);
		expect(xml).not.toContain('<url>');
		expect(xml).toContain('</urlset>');
	});
});

describe('buildRobots', () => {
	it('adds the Sitemap line only when a base URL is set', () => {
		expect(buildRobots('https://example.com')).toContain(
			'Sitemap: https://example.com/sitemap.xml'
		);
		expect(buildRobots(null)).not.toContain('Sitemap:');
	});

	it('always allows crawling', () => {
		expect(buildRobots(null)).toContain('User-agent: *\nDisallow:');
	});
});
