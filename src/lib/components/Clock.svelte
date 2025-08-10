<script lang="ts">
	import { onDestroy } from 'svelte';

	let {
		bgColorHex = 'rgba(0,0,0,0)',
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

	let style = $derived(`
		--bg-color: ${bgColorHex || 'rgba(0,0,0,0)'};
		--text-color: ${textColor || '#000000'};
		--font-size: ${fontSize || '2rem'};
		--font-weight: ${fontWeight || 'normal'};
		--font-family: ${fontFamily || 'sans-serif'};
	`);
</script>

<div class="clock-container" {style}>
	<p class="clock" role="timer" aria-live="polite">{formatTime(time)}</p>
</div>

<style>
	.clock-container {
		display: grid;
		justify-items: center;
		align-content: center;
		width: 100%;
		height: 100%;
		background-color: var(--bg-color);
	}
	.clock {
		margin: 0;
		color: var(--text-color);
		font-size: var(--font-size);
		font-weight: var(--font-weight);
		font-family: var(--font-family);
		width: calc(var(--font-size) * 3);
	}
</style>
