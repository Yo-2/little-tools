<script lang="ts">
	import { get } from 'svelte/store';
	import { configStore } from '$lib/configStore';

	interface WeatherData {
		name: string;
		main: {
			temp: number;
		};
		weather: {
			main: string;
			description: string;
			icon: string;
		}[];
	}

	import type { Config } from '$lib/configStore';

	// --- Props ---
	let {
		location = 'London',
		// General styles
		fontFamily = 'sans-serif',
		fontSize = '1rem',
		fontWeight = 'normal',
		textColor = '#000000',
		bgColorHex = '#ffffff',
		// Override logic
		weatherOverrideGeneralStyle = false,
		weatherStyleOptions = {} as Config['weatherStyleOptions']
	} = $props();

	// --- State ---
	let weatherData = $state<WeatherData | null>(null);
	let error = $state<string | null>(null);
	let loading = $state(true);

	// --- Lifecycle ---
	$effect(() => {
		fetchWeather();
	});

	// --- Functions ---
	async function fetchWeather() {
		const apiKey = get(configStore).weatherApiKey;

		if (!apiKey || !location) {
			error = 'API Key and Location are required.';
			loading = false;
			return;
		}

		loading = true;
		error = null;
		weatherData = null;

		try {
			const response = await fetch(
				`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`
			);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Failed to fetch weather data');
			}

			weatherData = await response.json();
		} catch (e) {
			if (e instanceof Error) {
				error = e.message;
			} else {
				error = 'An unknown error occurred.';
			}
		} finally {
			loading = false;
		}
	}

	const effectiveStyles = $derived(
		weatherOverrideGeneralStyle
			? weatherStyleOptions
			: { fontFamily, fontSize, fontWeight, textColor, bgColorHex }
	);

	let style = $derived(`
		--bg-color: ${effectiveStyles.bgColorHex || '#ffffff'};
		--text-color: ${effectiveStyles.textColor || '#000000'};
		--font-size: ${effectiveStyles.fontSize || '1rem'};
		--font-weight: ${effectiveStyles.fontWeight || 'normal'};
		--font-family: ${effectiveStyles.fontFamily || 'sans-serif'};
	`);
</script>

<div class="weather-widget" {style}>
	{#if loading}
		<p>Loading...</p>
	{:else if error}
		<p class="error">{error}</p>
	{:else if weatherData}
		<div class="weather-content">
			<h3>{weatherData.name}</h3>
			<div class="main-info">
				<img
					src="https://openweathermap.org/img/wn/{weatherData.weather[0].icon}@2x.png"
					alt={weatherData.weather[0].description}
				/>
				<p class="temp">{Math.round(weatherData.main.temp)}°C</p>
			</div>
			<p class="description">{weatherData.weather[0].main}</p>
		</div>
	{:else}
		<p>Enter a location and API key in the settings page.</p>
	{/if}
</div>

<style>
	.weather-widget {
		font-size: var(--font-size);
		font-weight: var(--font-weight);
		color: var(--text-color);
		background-color: var(--bg-color);
		padding: 1rem;
		border: 1px solid #ccc;
		border-radius: 8px;
		min-width: 200px;
		text-align: center;
		width: 100%;
		height: 100%;
		display: grid;
		place-content: center;
		font-family: var(--font-family);
	}
	.error {
		color: red;
	}
	.weather-content h3 {
		margin: 0 0 0.5rem 0;
	}
	.main-info {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.temp {
		font-size: 2.5rem;
		font-weight: bold;
		margin: 0;
	}
	.description {
		text-transform: capitalize;
		margin: 0.5rem 0 0 0;
	}
</style>
