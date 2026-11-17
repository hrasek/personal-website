import { buildRobots, site } from '#lib/site.js';

export const prerender = true;

export function GET() {
	return new Response(buildRobots(site.url), {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' }
	});
}
