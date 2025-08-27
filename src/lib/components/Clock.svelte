<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import AnalogClock from './AnalogClock.svelte';
	import { hexToRgba } from '$lib/colorUtils';

	import type { ToolStyleOptions } from '$lib/configStore';

	let {
		styleType = 'digital', // 'digital' | 'analog'
		showDate = false,
		showDay = false,
		showSeconds = true,
		timezone, // undefined means user's local time
		analogClockWidth = '100%',
		// General styles
		bgColorHex = '#ffffff',
		textColor = '#000000',
		bgColorOpacity = 100,
		textColorOpacity = 100,
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
		showSeconds?: boolean;
		timezone?: string;
		analogClockWidth?: string;
		bgColorHex?: string;
		textColor?: string;
		bgColorOpacity?: number;
		textColorOpacity?: number;
		fontSize?: string;
		fontWeight?: string;
		fontFamily?: string;
		clockOverrideGeneralStyle?: boolean;
		clockStyleOptions?: ToolStyleOptions;
	}>();

	let time = $state(new Date());

	const timeFormatter = $derived(() => {
		const options: Intl.DateTimeFormatOptions = {
			hour: '2-digit',
			minute: '2-digit',
			hour12: false,
			timeZone: timezone || undefined
		};

		if (showSeconds) {
			options.second = '2-digit';
		}

		return new Intl.DateTimeFormat('en-US', options);
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

	let frameId: number;
	function update() {
		time = new Date();
		frameId = requestAnimationFrame(update);
	}
	onMount(() => {
		update();
	});

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
		if (frameId) {
			cancelAnimationFrame(frameId);
		}
	});

	const finalStyles = $derived(() => {
		if (clockOverrideGeneralStyle && clockStyleOptions) {
			return {
				bgColor: hexToRgba(clockStyleOptions.bgColorHex, clockStyleOptions.bgColorOpacity),
				textColor: hexToRgba(clockStyleOptions.textColor, clockStyleOptions.textColorOpacity),
				fontSize: clockStyleOptions.fontSize,
				fontWeight: clockStyleOptions.fontWeight,
				fontFamily: clockStyleOptions.fontFamily
			};
		}
		return {
			bgColor: hexToRgba(bgColorHex, bgColorOpacity),
			textColor: hexToRgba(textColor, textColorOpacity),
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
			<AnalogClock {...timeParts()} {showSeconds} textColor={finalStyles().textColor} />
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
