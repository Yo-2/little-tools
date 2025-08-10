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

	const bgStyle = 'background-color: ' + (bgColor || bgColorHex || 'rgba(0,0,0,0)');
	const textStyle =
		'color: ' +
		(textColor || '#000000') +
		';' +
		'font-size: ' +
		(fontSize || '2rem') +
		';' +
		'font-weight: ' +
		(fontWeight || 'normal') +
		';' +
		'font-family: ' +
		fontFamily;
</script>

<div class="text-container" style={bgStyle}>
	<p class="text" style={textStyle}>{text}</p>
</div>

<style>
	.text-container {
		display: grid;
		text-align: center;
		align-content: center;
		width: 100%;
		height: 100%;
	}
	.text {
		margin: 0;
		font-size: 2rem;
	}
</style>
