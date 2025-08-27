import type { ToolStyleOptions } from './configStore';

export function loadStyles(url: URL, componentName: string) {
	const fontFamily = url.searchParams.get('fontFamily') ?? undefined;
	const fontSize = url.searchParams.get('fontSize') ?? undefined;
	const fontWeight = url.searchParams.get('fontWeight') ?? undefined;
	const textColor = url.searchParams.get('textColor') ?? undefined;
	const bgColorHex = url.searchParams.get('bgColorHex') ?? undefined;
	const bgColorOpacityStr = url.searchParams.get('bgColorOpacity');
	const textColorOpacityStr = url.searchParams.get('textColorOpacity');

	const bgColorOpacity = bgColorOpacityStr ? parseInt(bgColorOpacityStr, 10) : undefined;
	const textColorOpacity = textColorOpacityStr ? parseInt(textColorOpacityStr, 10) : undefined;

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
		bgColorHex,
		bgColorOpacity,
		textColorOpacity
	};
}
