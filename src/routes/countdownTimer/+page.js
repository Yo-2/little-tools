import { loadStyles } from '$lib/style-loader';

/** @type {import('./$types').PageLoad} */
export function load({ url }) {
	const styles = loadStyles(url, 'timer');

	return {
		...styles,
		hours: Number(url.searchParams.get('hours')),
		minutes: Number(url.searchParams.get('minutes')),
		seconds: Number(url.searchParams.get('seconds')),
		timeupText: url.searchParams.get('timeupText')
	};
}
