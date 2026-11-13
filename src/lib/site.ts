/**
 * Site-wide SEO settings. The values live in `data/site.json`.
 *
 * `url` is the public address of the site (for example https://example.com).
 * It stays `null` until the domain is decided. While it is `null`, the build
 * leaves out everything that needs an absolute URL: the canonical link,
 * og:url, og:image, the sitemap entries and the Sitemap line in robots.txt.
 */
import site from './data/site.json';

export { site };

/** Normalises a base URL: must be http(s), no trailing slash. Returns null if invalid. */
export function normaliseBaseUrl(base: string | null | undefined): string | null {
	if (!base) return null;
	let parsed: URL;
	try {
		parsed = new URL(base);
	} catch {
		return null;
	}
	if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return null;
	return parsed.origin + parsed.pathname.replace(/\/+$/, '');
}

/** Joins a base URL and an absolute path. Returns null when there is no valid base. */
export function absoluteUrl(base: string | null | undefined, path: string): string | null {
	const root = normaliseBaseUrl(base);
	if (root === null) return null;
	return root + (path.startsWith('/') ? path : `/${path}`);
}

/** Paths listed in the sitemap. The site is a single page. */
export const sitemapPaths = ['/'];

/** Builds sitemap.xml. With no base URL it is a valid, empty sitemap. */
export function buildSitemap(base: string | null | undefined, paths: string[]): string {
	const urls = paths
		.map((path) => absoluteUrl(base, path))
		.filter((url): url is string => url !== null)
		.map((url) => `\t<url>\n\t\t<loc>${escapeXml(url)}</loc>\n\t</url>`);
	return [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
		...urls,
		'</urlset>',
		''
	].join('\n');
}

/** Builds robots.txt. Adds the Sitemap line only when a base URL is set. */
export function buildRobots(base: string | null | undefined): string {
	const lines = ['# Allow crawling everything.', 'User-agent: *', 'Disallow:'];
	const sitemap = absoluteUrl(base, '/sitemap.xml');
	if (sitemap !== null) lines.push('', `Sitemap: ${sitemap}`);
	return lines.join('\n') + '\n';
}

function escapeXml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}
