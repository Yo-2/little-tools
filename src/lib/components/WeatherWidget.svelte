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

	// --- Props ---
	let { location = 'London' } = $props();

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
</script>

<div class="weather-widget">
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
		font-family: sans-serif;
		padding: 1rem;
		border: 1px solid #ccc;
		border-radius: 8px;
		min-width: 200px;
		text-align: center;
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
