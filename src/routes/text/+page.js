import { loadStyles } from '$lib/style-loader';

/** @type {import('./$types').PageLoad} */
export function load({ url }) {
	const styles = loadStyles(url, 'text');

	return {
		...styles,
		text: url.searchParams.get('text')
	};
}
