/** @type {import('./$types').PageLoad} */
export function load({ url }) {
	return {
		bgColorHex: url.searchParams.get('bgColorHex'),
		textColor: url.searchParams.get('textColor'),
		fontSize: url.searchParams.get('fontSize'),
		fontFamily: url.searchParams.get('fontFamily'),
		fontWeight: url.searchParams.get('fontWeight'),
		text: url.searchParams.get('text')
	};
}
