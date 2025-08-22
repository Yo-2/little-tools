import type { ToolStyleOptions } from './configStore';

export function loadStyles(url: URL, componentName: string) {
	const fontFamily = url.searchParams.get('fontFamily');
	const fontSize = url.searchParams.get('fontSize');
	const fontWeight = url.searchParams.get('fontWeight');
	const textColor = url.searchParams.get('textColor');
	const bgColorHex = url.searchParams.get('bgColorHex');

	const overrideFlag = url.searchParams.get(`${componentName}OverrideGeneralStyle`);
	const styleOptionsStr = url.searchParams.get(`${componentName}StyleOptions`);

	if (overrideFlag === 'true' && styleOptionsStr) {
		try {
			const specificStyles = JSON.parse(styleOptionsStr) as ToolStyleOptions;
			return {
				[`${componentName}OverrideGeneralStyle`]: true,
				[`${componentName}StyleOptions`]: specificStyles
			};
		} catch (e) {
			console.error('Failed to parse style options:', e);
		}
	}

	return {
		fontFamily,
		fontSize,
		fontWeight,
		textColor,
		bgColorHex
	};
}
