<script lang="ts">
	import { onDestroy } from 'svelte';

	let {
		hours: initialHours = 0,
		minutes: initialMinutes = 0,
		seconds: initialSeconds = 0,
		timeupText = "Time's up!",
		bgColor = 'rgba(0,0,0,0)',
		bgColorHex = null,
		textColor = '#000000',
		fontSize = '2rem',
		fontWeight = 'normal',
		fontFamily = 'sans-serif'
	} = $props();

	const defaultData = {
		hours: Number(initialHours) || 0,
		minutes: Number(initialMinutes) || 0,
		seconds: Number(initialSeconds) || 0
	};

	let hours = $state(defaultData.hours);
	let minutes = $state(defaultData.minutes);
	let seconds = $state(defaultData.seconds);

	let timeup = $state(false);
	let isPaused = false;

	function padZero(num: number) {
		return num.toString().padStart(2, '0');
	}

	function formatTime() {
		if (initialHours) {
			return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
		}
		if (initialMinutes) {
			return `${padZero(minutes)}:${padZero(seconds)}`;
		}
		if (initialSeconds) {
			return `${padZero(seconds)}`;
		}
		return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
	}

	function countdown() {
		const countSeconds = hours * 3600 + minutes * 60 + seconds;
		if (countSeconds <= 1) {
			timeup = true;
			return;
		}
		if (isPaused) {
			return;
		}
		seconds--;
		if (seconds < 0) {
			seconds = 59;
			minutes--;
			if (minutes < 0) {
				minutes = 59;
				hours--;
			}
		}
	}

	function reset() {
		hours = defaultData.hours;
		minutes = defaultData.minutes;
		seconds = defaultData.seconds;
		timeup = false;
	}

	function playOrPause() {
		isPaused = !isPaused;
	}

	const timerId = setInterval(() => {
		countdown();
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
		' * 3.2);';
</script>

<button class="countdown-timer-container" style={bgStyle} onclick={playOrPause} ondblclick={reset}>
	{#if timeup}
		<p class="countdown-timer timeup-text" style={clockStyle}>
			{timeupText}
		</p>
	{:else}
		<p class="countdown-timer time" style={clockStyle}>
			{formatTime()}
		</p>
	{/if}
</button>

<style>
	.countdown-timer-container {
		display: grid;
		justify-items: center;
		align-content: center;
		width: 100%;
		height: 100%;
	}
	.countdown-timer {
		margin: 0;
		word-break: keep-all;
	}
</style>
