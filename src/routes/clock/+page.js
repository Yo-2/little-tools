/** @type {import('./$types').PageLoad} */
export function load({ url }) {
	const showDate = url.searchParams.get('showDate');
	const showDay = url.searchParams.get('showDay');

	return {
		styleType: url.searchParams.get('styleType'),
		bgColorHex: url.searchParams.get('bgColorHex'),
		textColor: url.searchParams.get('textColor'),
		fontSize: url.searchParams.get('fontSize'),
		fontFamily: url.searchParams.get('fontFamily'),
		fontWeight: url.searchParams.get('fontWeight'),
		showDate: showDate === 'true',
		showDay: showDay === 'true',
		timezone: url.searchParams.get('timezone'),
		digitalClockWidth: url.searchParams.get('digitalClockWidth')
	};
}
