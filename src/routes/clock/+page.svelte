<script lang="ts">
	import { onDestroy } from 'svelte';

	let { data } = $props();

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

	const bgStyle = 'background-color: ' + (data.bgColor || data.bgColorHex || 'rgba(0,0,0,0)');
	const clockStyle =
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

<div class="clock-container" style={bgStyle}>
	<p class="clock" style={clockStyle}>{formatTime(time)}</p>
</div>

<style>
	.clock-container {
		text-align: center;
		align-content: center;
		width: 100vw;
		height: 100vh;
	}
	.clock {
		margin: 0;
		font-size: 2rem;
	}
</style>
