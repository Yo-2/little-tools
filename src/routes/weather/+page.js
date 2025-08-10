/** @type {import('./$types').PageLoad} */
export function load({ url }) {
	return {
		weatherLocation: url.searchParams.get('weatherLocation')
	};
}
