<script lang="ts">
	let {
		text = '',
		bgColor = 'rgba(0,0,0,0)',
		bgColorHex = null,
		textColor = '#000000',
		fontSize = '2rem',
		fontWeight = 'normal',
		fontFamily = 'sans-serif'
	} = $props();

	let style = $derived(`
		--bg-color: ${bgColor || bgColorHex || 'rgba(0,0,0,0)'};
		--text-color: ${textColor || '#000000'};
		--font-size: ${fontSize || '2rem'};
		--font-weight: ${fontWeight || 'normal'};
		--font-family: ${fontFamily || 'sans-serif'};
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
	}
	.text {
		margin: 0;
		color: var(--text-color);
		font-size: var(--font-size);
		font-weight: var(--font-weight);
		font-family: var(--font-family);
	}
</style>
