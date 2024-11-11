<script lang="ts">
	let { data } = $props();

	let text = data.text;

	const bgStyle = 'background-color: ' + (data.bgColor || data.bgColorHex || 'rgba(0,0,0,0)');
	const textStyle =
		'color: ' +
		(data.textColor || '#000000') +
		';' +
		'font-size: ' +
		(data.fontSize || '2rem') +
		';' +
		'font-weight: ' +
		(data.fontWeight || 'normal') +
		';' +
		'font-family: ' +
		data.fontFamily;
</script>

<div class="text-container" style={bgStyle}>
	<p class="text" style={textStyle}>{text}</p>
</div>

<style>
	.text-container {
		text-align: center;
		align-content: center;
		width: 100vw;
		height: 100vh;
	}
	.text {
		margin: 0;
		font-size: 2rem;
	}
</style>
