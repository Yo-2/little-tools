/** @type {import('./$types').PageLoad} */
export function load({ url }) {
	const itemsParam = url.searchParams.get('spinningWheelItems');
	return {
		// Provide default items if the parameter is not present
		items: itemsParam
			? itemsParam.split('\n').filter((i) => i.trim() !== '')
			: ['Prize 1', 'Prize 2', 'Prize 3', 'Prize 4', 'Prize 5', 'Prize 6']
	};
}
