<script lang="ts">
	import { hexToRgba } from '$lib/colorUtils';
	import type { Config } from '$lib/configStore';

	let {
		hours: initialHours = 0,
		minutes: initialMinutes = 0,
		seconds: initialSeconds = 0,
		timeupText = "Time's up!",
		showHours = false,
		showMinutes = false,
		bgColorHex = '#ffffff',
		textColor = '#000000',
		bgColorOpacity = 100,
		textColorOpacity = 100,
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
	let timeup = $state(false);
	let isPaused = $state(true);
	let remainingTime = $state(0); // Time in milliseconds

	function updateDisplay() {
		if (remainingTime < 0) remainingTime = 0;
		const totalSeconds = Math.ceil(remainingTime / 1000);
		hours = Math.floor(totalSeconds / 3600);
		minutes = Math.floor((totalSeconds % 3600) / 60);
		seconds = totalSeconds % 60;
	}

	function setInitialTime() {
		remainingTime =
			(defaultData.hours * 3600 + defaultData.minutes * 60 + defaultData.seconds) * 1000;
		updateDisplay();
	}

	// This effect resets the timer when props change
	$effect(() => {
		setInitialTime();
		isPaused = true;
		timeup = false;
	});

	// This effect handles the countdown logic
	$effect(() => {
		if (isPaused || timeup) {
			return; // Do nothing if paused or finished
		}

		const endTime = Date.now() + remainingTime;
		let frameId: number;

		function frame() {
			remainingTime = endTime - Date.now();

			if (remainingTime <= 0) {
				remainingTime = 0;
				timeup = true;
				isPaused = true; // This will cause this effect to cleanup and stop
			}
			updateDisplay();

			// The loop continues as long as this effect is active.
			// The effect will be re-run (and this loop cleaned up) when isPaused becomes true.
			frameId = requestAnimationFrame(frame);
		}

		frameId = requestAnimationFrame(frame);

		// Cleanup function for the effect, runs when isPaused/timeup changes, or component unmounts
		return () => {
			cancelAnimationFrame(frameId);
		};
	});

	function playOrPause() {
		if (timeup) return;
		isPaused = !isPaused;
	}

	function reset() {
		timeup = false;
		isPaused = true; // This will trigger the effect cleanup
		setInitialTime();
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key.toLowerCase() === 'r') {
			reset();
		}
	}

	function padZero(num: number) {
		return num.toString().padStart(2, '0');
	}

	function formatTime() {
		if (showHours) {
			return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
		}
		if (showMinutes) {
			return `${padZero(minutes)}:${padZero(seconds)}`;
		}

		// default behavior
		if (defaultData.hours > 0) {
			return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
		}
		if (defaultData.minutes > 0) {
			return `${padZero(minutes)}:${padZero(seconds)}`;
		}
		if (defaultData.seconds > 0) {
			return `${padZero(seconds)}`;
		}
		return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
	}

	const effectiveStyles = $derived(
		timerOverrideGeneralStyle
			? timerStyleOptions
			: {
					fontFamily,
					fontSize,
					fontWeight,
					textColor,
					bgColorHex,
					textColorOpacity,
					bgColorOpacity
				}
	);

	let style = $derived(`
		--bg-color: ${hexToRgba(effectiveStyles.bgColorHex, effectiveStyles.bgColorOpacity) || 'rgba(0,0,0,0)'};
		--text-color: ${hexToRgba(effectiveStyles.textColor, effectiveStyles.textColorOpacity) || '#000000'};
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

<pre>
	isPaused: {isPaused}
	timeup: {timeup}
	remainingTime: {remainingTime}
</pre>

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
