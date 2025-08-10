/** @type {import('./$types').PageLoad} */
export function load({ url }) {
	const playersParam = url.searchParams.get('ladderPlayers');
	const resultsParam = url.searchParams.get('ladderResults');

	return {
		players: playersParam ? playersParam.split('\n') : undefined,
		results: resultsParam ? resultsParam.split('\n') : undefined
	};
}
