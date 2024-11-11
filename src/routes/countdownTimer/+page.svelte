<script lang="ts">
	import { onDestroy } from 'svelte';

	let { data } = $props();

	const defaultData = {
		hours: Number(data.hours) || 0,
		minutes: Number(data.minutes) || 0,
		seconds: Number(data.seconds) || 0
	};

	let hours = $state(defaultData.hours);
	let minutes = $state(defaultData.minutes);
	let seconds = $state(defaultData.seconds);

	let timeupText = data.timeupText || "Time's up!";

	let timeup = $state(false);
	let isPaused = false;

	function padZero(num: number) {
		return num.toString().padStart(2, '0');
	}

	function formatTime() {
		if (data.hours) {
			return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
		}
		if (data.minutes) {
			return `${padZero(minutes)}:${padZero(seconds)}`;
		}
		if (data.seconds) {
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
		text-align: center;
		align-content: center;
		width: 100vw;
		height: 100vh;
	}
	.countdown-timer {
		margin: 0;
		font-size: 2rem;
	}
</style>
