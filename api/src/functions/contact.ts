import { app } from '@azure/functions';
import { handleContact } from '../lib/contact';

app.http('contact', {
	methods: ['POST'],
	authLevel: 'anonymous',
	route: 'contact',
	handler: async (request, context) => {
		const { status, jsonBody } = await handleContact(await request.text(), {
			// Application setting in Azure; api/local.settings.json when run locally (see D16).
			token: process.env.PUSHBULLET_TOKEN,
			onError: (reason) => context.error('contact: message not sent:', reason)
		});
		return { status, jsonBody, headers: { 'Cache-Control': 'no-store' } };
	}
});
