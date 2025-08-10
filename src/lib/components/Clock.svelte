<script lang="ts">
	import { onDestroy } from 'svelte';

	let {
		bgColor = 'rgba(0,0,0,0)',
		bgColorHex = null,
		textColor = '#000000',
		fontSize = '2rem',
		fontWeight = 'normal',
		fontFamily = 'sans-serif'
	} = $props();

	let time = $state(new Date());

	function padZero(num: number) {
		return num.toString().padStart(2, '0');
	}
	function formatTime(time: Date) {
		return `${padZero(time.getHours())}:${padZero(time.getMinutes())}:${padZero(time.getSeconds())}`;
	}

	const timerId = setInterval(() => {
		time = new Date();
	}, 1000);

	onDestroy(() => {
		clearInterval(timerId);
	});

	const bgStyle = 'background-color: ' + (bgColor || bgColorHex || 'rgba(0,0,0,0)');
	const clockStyle =
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
		fontFamily +
		';' +
		'width: ' +
		'calc(' +
		(fontSize || '2rem') +
		' * 3);';
</script>

<div class="clock-container" style={bgStyle}>
	<p class="clock" style={clockStyle}>{formatTime(time)}</p>
</div>

<style>
	.clock-container {
		display: grid;
		justify-items: center;
		align-content: center;
		width: 100%;
		height: 100%;
	}
	.clock {
		margin: 0;
		font-size: 2rem;
	}
</style>
