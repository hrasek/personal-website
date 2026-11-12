import { app } from '@azure/functions';
import { config } from '../lib/config';
import { getRatings, type RatingsState } from '../lib/ratings';

// Module scope: kept between requests while this function instance is running.
const state: RatingsState = {};

app.http('chess', {
	methods: ['GET'],
	authLevel: 'anonymous',
	route: 'chess',
	handler: async (_request, context) => {
		const body = await getRatings(state, config, fetch, Date.now(), (error) =>
			context.warn('chess: keeping previous value:', error)
		);
		return {
			status: 200,
			jsonBody: body,
			// A visitor's browser reuses the answer for 5 minutes.
			headers: { 'Cache-Control': 'public, max-age=300' }
		};
	}
});
