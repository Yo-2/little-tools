import { loadStyles } from '$lib/style-loader';

/** @type {import('./$types').PageLoad} */
export function load({ url }) {
	const styles = loadStyles(url, 'weather');

	return {
		...styles,
		weatherLocation: url.searchParams.get('weatherLocation'),
		weatherApiKey: url.searchParams.get('weatherApiKey'),
		weatherShowWind: url.searchParams.get('weatherShowWind') === 'true',
		weatherShowAtmosphere: url.searchParams.get('weatherShowAtmosphere') === 'true',
		weatherShowSun: url.searchParams.get('weatherShowSun') === 'true'
	};
}
