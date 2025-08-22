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
				fontFamily: specificStyles.fontFamily || fontFamily,
				fontSize: specificStyles.fontSize || fontSize,
				fontWeight: specificStyles.fontWeight || fontWeight,
				textColor: specificStyles.textColor || textColor,
				bgColorHex: specificStyles.bgColorHex || bgColorHex
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
