import { buildSitemap, site, sitemapPaths } from '#lib/site.js';

export const prerender = true;

export function GET() {
	return new Response(buildSitemap(site.url, sitemapPaths), {
		headers: { 'Content-Type': 'application/xml; charset=utf-8' }
	});
}
