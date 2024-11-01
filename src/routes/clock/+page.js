/** @type {import('./$types').PageLoad} */
export function load({ url }) {
	return {
		bgColor: url.searchParams.get('bgColor'),
		bgColorHex: url.searchParams.get('bgColorHex')
			? '#' + url.searchParams.get('bgColorHex')
			: null,
		textColor: url.searchParams.get('textColor'),
		fontSize: url.searchParams.get('fontSize')
	};
}
