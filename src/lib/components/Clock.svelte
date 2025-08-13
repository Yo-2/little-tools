<script lang="ts">
	import { onDestroy } from 'svelte';
	import AnalogClock from './AnalogClock.svelte';

	let {
		styleType = 'digital', // 'digital' | 'analog'
		showDate = false,
		showDay = false,
		timezone, // undefined means user's local time
		digitalClockWidth = '100%',
		bgColorHex = 'rgba(0,0,0,0)',
		textColor = '#000000',
		fontSize = '2rem',
		fontWeight = 'normal',
		fontFamily = 'sans-serif'
	} = $props<{
		styleType?: 'digital' | 'analog';
		showDate?: boolean;
		showDay?: boolean;
		timezone?: string;
		digitalClockWidth?: string;
		bgColorHex?: string;
		textColor?: string;
		fontSize?: string;
		fontWeight?: string;
		fontFamily?: string;
	}>();

	let time = $state(new Date());

	const timeFormatter = $derived(() => {
		return new Intl.DateTimeFormat('en-US', {
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			hour12: false,
			timeZone: timezone || undefined
		});
	});

	const dateFormatter = $derived(() => {
		return new Intl.DateTimeFormat('sv-SE', {
			// ISO 8601 format YYYY-MM-DD
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			timeZone: timezone || undefined
		});
	});

	const dayFormatter = $derived(() => {
		return new Intl.DateTimeFormat('en-US', { weekday: 'long', timeZone: timezone || undefined });
	});

	function formatTime(time: Date) {
		return timeFormatter().format(time);
	}

	function formatDate(time: Date) {
		return dateFormatter().format(time);
	}

	function formatDay(time: Date) {
		return dayFormatter().format(time);
	}

	const timerId = setInterval(() => {
		time = new Date();
	}, 1000);

	let timeParts = $derived(() => {
		const parts = new Intl.DateTimeFormat('en-US', {
			hour: 'numeric',
			minute: 'numeric',
			second: 'numeric',
			hour12: false,
			timeZone: timezone || undefined
		}).formatToParts(time);
		return {
			hours: parseInt(parts.find((p) => p.type === 'hour')?.value || '0'),
			minutes: parseInt(parts.find((p) => p.type === 'minute')?.value || '0'),
			seconds: parseInt(parts.find((p) => p.type === 'second')?.value || '0')
		};
	});

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
	{#if styleType === 'analog'}
		<AnalogClock {...timeParts()} {textColor} />
	{:else}
		<div class="digital-clock-wrapper" style="width: {digitalClockWidth};">
			<p class="clock" role="timer" aria-live="polite">{formatTime(time)}</p>
			{#if showDate}
				<p class="date">{formatDate(time)}</p>
			{/if}
			{#if showDay}
				<p class="day">{formatDay(time)}</p>
			{/if}
		</div>
	{/if}
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
	.digital-clock-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25em; /* Spacing between time, date, and day */
	}
	.clock,
	.date,
	.day {
		margin: 0;
		color: var(--text-color);
		font-family: var(--font-family);
		width: 100%;
		text-align: center;
	}
	.clock {
		font-size: var(--font-size);
		font-weight: var(--font-weight);
	}
	.date,
	.day {
		font-size: calc(var(--font-size) * 0.4);
		font-weight: normal;
	}
</style>
