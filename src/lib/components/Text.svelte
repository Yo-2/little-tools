<script lang="ts">
	import type { Config } from '$lib/configStore';
	import { hexToRgba } from '$lib/colorUtils';

	let {
		text = '',
		bgColorHex = '#ffffff',
		textColor = '#000000',
		bgColorOpacity = 100,
		textColorOpacity = 100,
		fontSize = '2rem',
		fontWeight = 'normal',
		fontFamily = 'sans-serif',
		textOverrideGeneralStyle = false,
		textStyleOptions = {} as Config['textStyleOptions']
	} = $props();

	const effectiveStyles = $derived(
		textOverrideGeneralStyle
			? textStyleOptions
			: {
					fontFamily,
					fontSize,
					fontWeight,
					textColor,
					bgColorHex,
					textColorOpacity,
					bgColorOpacity
				}
	);

	let style = $derived(`
		--bg-color: ${hexToRgba(effectiveStyles.bgColorHex, effectiveStyles.bgColorOpacity) || 'rgba(0,0,0,0)'};
		--text-color: ${hexToRgba(effectiveStyles.textColor, effectiveStyles.textColorOpacity) || '#000000'};
		--font-size: ${effectiveStyles.fontSize || '2rem'};
		--font-weight: ${effectiveStyles.fontWeight || 'normal'};
		--font-family: ${effectiveStyles.fontFamily || 'sans-serif'};
	`);
</script>

<div class="text-container" {style}>
	<p class="text">{text}</p>
</div>

<style>
	.text-container {
		display: grid;
		text-align: center;
		align-content: center;
		width: 100%;
		height: 100%;
		background-color: var(--bg-color);
		font-family: var(--font-family);
	}
	.text {
		margin: 0;
		color: var(--text-color);
		font-size: var(--font-size);
		font-weight: var(--font-weight);
	}
</style>
