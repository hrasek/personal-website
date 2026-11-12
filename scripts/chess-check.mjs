// Calls the real Chess.com and FIDE APIs with the same code the function uses,
// and prints what /api/chess would return. Run: npm run chess:check
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { config } = require('../api/dist/src/lib/config.js');
const { getRatings } = require('../api/dist/src/lib/ratings.js');

const errors = [];
const result = await getRatings({}, config, fetch, Date.now(), (error) => errors.push(error));

console.log(JSON.stringify(result, null, 2));
for (const error of errors)
	console.error('Problem:', error instanceof Error ? error.message : error);
process.exitCode = errors.length > 0 ? 1 : 0;
