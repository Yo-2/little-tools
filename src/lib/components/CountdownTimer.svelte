<script lang="ts">
	import { onDestroy } from 'svelte';

	import type { Config } from '$lib/configStore';

	let {
		hours: initialHours = 0,
		minutes: initialMinutes = 0,
		seconds: initialSeconds = 0,
		timeupText = "Time's up!",
		bgColorHex = 'rgba(0,0,0,0)',
		textColor = '#000000',
		fontSize = '2rem',
		fontWeight = 'normal',
		fontFamily = 'sans-serif',

		timerOverrideGeneralStyle = false,
		timerStyleOptions = {} as Config['timerStyleOptions']
	} = $props();

	let defaultData = $derived({
		hours: Number(initialHours) || 0,
		minutes: Number(initialMinutes) || 0,
		seconds: Number(initialSeconds) || 0
	});

	let hours = $state(0);
	let minutes = $state(0);
	let seconds = $state(0);

	$effect(() => {
		hours = defaultData.hours;
		minutes = defaultData.minutes;
		seconds = defaultData.seconds;
	});

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

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key.toLowerCase() === 'r') {
			reset();
		}
	}

	const timerId = setInterval(() => {
		countdown();
	}, 1000);

	onDestroy(() => {
		clearInterval(timerId);
	});

	const effectiveStyles = $derived(
		timerOverrideGeneralStyle
			? timerStyleOptions
			: { fontFamily, fontSize, fontWeight, textColor, bgColorHex }
	);

	let style = $derived(`
		--bg-color: ${effectiveStyles.bgColorHex || 'rgba(0,0,0,0)'};
		--text-color: ${effectiveStyles.textColor || '#000000'};
		--font-size: ${effectiveStyles.fontSize || '2rem'};
		--font-weight: ${effectiveStyles.fontWeight || 'normal'};
		--font-family: ${effectiveStyles.fontFamily || 'sans-serif'};
	`);

	let ariaLabel = $derived(
		`${isPaused ? 'Play' : 'Pause'} timer. Double-click or press R to reset.`
	);
</script>

<button
	class="countdown-timer-container"
	{style}
	onclick={playOrPause}
	ondblclick={reset}
	onkeydown={handleKeyDown}
	aria-label={ariaLabel}
>
	{#if timeup}
		<p class="countdown-timer timeup-text">
			{timeupText}
		</p>
	{:else}
		<p class="countdown-timer time">
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
		background-color: var(--bg-color);
		border: none;
		cursor: pointer;
		font-family: var(--font-family);
		color: var(--text-color);
		font-size: var(--font-size);
		font-weight: var(--font-weight);
	}
	.countdown-timer {
		margin: 0;
		word-break: keep-all;
		width: 100%;
		text-align: center;
	}
</style>
