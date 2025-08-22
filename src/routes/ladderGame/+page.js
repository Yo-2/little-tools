import { loadStyles } from '$lib/style-loader';

/** @type {import('./$types').PageLoad} */
export function load({ url }) {
	const styles = loadStyles(url, 'ladder');
	const playersParam = url.searchParams.get('ladderPlayers');
	const resultsParam = url.searchParams.get('ladderResults');
	const isManualMode = url.searchParams.get('ladderIsManualMode');

	return {
		...styles,
		players: playersParam ? playersParam.split('\n') : [],
		results: resultsParam ? resultsParam.split('\n') : [],
		isManualMode: isManualMode === 'true'
	};
}
