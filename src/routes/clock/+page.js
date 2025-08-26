import { loadStyles } from '$lib/style-loader';

/** @type {import('./$types').PageLoad} */
export function load({ url }) {
	const styles = loadStyles(url, 'clock');
	const showDate = url.searchParams.get('showDate');
	const showDay = url.searchParams.get('showDay');
	const showSeconds = url.searchParams.get('showSeconds');

	return {
		...styles,
		styleType: url.searchParams.get('styleType'),
		showDate: showDate === 'true',
		showDay: showDay === 'true',
		showSeconds: showSeconds !== 'false',
		timezone: url.searchParams.get('timezone'),
		analogClockWidth: url.searchParams.get('analogClockWidth')
	};
}
