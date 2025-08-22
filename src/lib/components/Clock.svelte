<script lang="ts">
	import { onDestroy } from 'svelte';
	import AnalogClock from './AnalogClock.svelte';

	import type { ToolStyleOptions } from '$lib/configStore';

	let {
		styleType = 'digital', // 'digital' | 'analog'
		showDate = false,
		showDay = false,
		timezone, // undefined means user's local time
		analogClockWidth = '100%',
		// General styles
		bgColorHex = 'rgba(0,0,0,0)',
		textColor = '#000000',
		fontSize = '2rem',
		fontWeight = 'normal',
		fontFamily = 'sans-serif',
		// Override styles
		clockOverrideGeneralStyle = false,
		clockStyleOptions
	} = $props<{
		styleType?: 'digital' | 'analog';
		showDate?: boolean;
		showDay?: boolean;
		timezone?: string;
		analogClockWidth?: string;
		bgColorHex?: string;
		textColor?: string;
		fontSize?: string;
		fontWeight?: string;
		fontFamily?: string;
		clockOverrideGeneralStyle?: boolean;
		clockStyleOptions?: ToolStyleOptions;
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

	const finalStyles = $derived(() => {
		if (clockOverrideGeneralStyle && clockStyleOptions) {
			return {
				bgColor: clockStyleOptions.bgColorHex,
				textColor: clockStyleOptions.textColor,
				fontSize: clockStyleOptions.fontSize,
				fontWeight: clockStyleOptions.fontWeight,
				fontFamily: clockStyleOptions.fontFamily
			};
		}
		return {
			bgColor: bgColorHex,
			textColor: textColor,
			fontSize: fontSize,
			fontWeight: fontWeight,
			fontFamily: fontFamily
		};
	});

	let style = $derived(`
		--bg-color: ${finalStyles().bgColor || 'rgba(0,0,0,0)'};
		--text-color: ${finalStyles().textColor || '#000000'};
		--font-size: ${finalStyles().fontSize || '2rem'};
		--font-weight: ${finalStyles().fontWeight || 'normal'};
		--font-family: ${finalStyles().fontFamily || 'sans-serif'};
	`);
</script>

<div class="clock-container" {style}>
	{#if styleType === 'analog'}
		<div class="analog-clock-wrapper" style="width: {analogClockWidth};">
			<AnalogClock {...timeParts()} textColor={finalStyles().textColor} />
		</div>
	{:else}
		<div class="digital-clock-wrapper">
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
		font-family: var(--font-family);
		color: var(--text-color);
		font-size: var(--font-size);
		font-weight: var(--font-weight);
	}
	.analog-clock-wrapper,
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
		width: 100%;
		text-align: center;
	}
	.date,
	.day {
		font-size: calc(var(--font-size) * 0.4);
		font-weight: normal;
	}
</style>
