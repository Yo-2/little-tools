import { loadStyles } from '$lib/style-loader';

/** @type {import('./$types').PageLoad} */
export function load({ url }) {
	const styles = loadStyles(url, 'weather');
	delete styles.fontSize;
	delete styles.fontWeight;

	return {
		...styles,
		location: url.searchParams.get('weatherLocation') ?? undefined,
		weatherApiKey: url.searchParams.get('weatherApiKey'),
		weatherShowWind: url.searchParams.get('weatherShowWind') === 'true',
		weatherShowAtmosphere: url.searchParams.get('weatherShowAtmosphere') === 'true',
		weatherShowSun: url.searchParams.get('weatherShowSun') === 'true'
	};
}
