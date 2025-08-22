<script lang="ts">
	import type { Config } from '$lib/configStore';

	let {
		text = '',
		bgColorHex = 'rgba(0,0,0,0)',
		textColor = '#000000',
		fontSize = '2rem',
		fontWeight = 'normal',
		fontFamily = 'sans-serif',
		textOverrideGeneralStyle = false,
		textStyleOptions = {} as Config['textStyleOptions']
	} = $props();

	const effectiveStyles = $derived(
		textOverrideGeneralStyle
			? textStyleOptions
			: { fontFamily, fontSize, fontWeight, textColor, bgColorHex }
	);

	let style = $derived(`
		--bg-color: ${effectiveStyles.bgColorHex || 'rgba(0,0,0,0)'};
		--text-color: ${effectiveStyles.textColor || '#000000'};
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
	}
</style>
