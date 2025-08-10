/** @type {import('./$types').PageLoad} */
export function load({ url }) {
	return {
		bgColor: url.searchParams.get('bgColor'),
		bgColorHex: url.searchParams.get('bgColorHex')
			? '#' + url.searchParams.get('bgColorHex')
			: null,
		textColor: url.searchParams.get('textColor'),
		fontSize: url.searchParams.get('fontSize'),
		fontFamily: url.searchParams.get('fontFamily'),
		fontWeight: url.searchParams.get('fontWeight'),
		hours: Number(url.searchParams.get('hours')),
		minutes: Number(url.searchParams.get('minutes')),
		seconds: Number(url.searchParams.get('seconds')),
		timeupText: url.searchParams.get('timeupText')
	};
}
