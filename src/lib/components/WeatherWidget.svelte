<script lang="ts">
	import { get } from 'svelte/store';
	import { configStore } from '$lib/configStore';

	interface WeatherData {
		name: string;
		main: {
			temp: number;
			feels_like: number;
			temp_min: number;
			temp_max: number;
			pressure: number;
			humidity: number;
		};
		weather: {
			main: string;
			description: string;
			icon: string;
		}[];
		wind: {
			speed: number;
			deg: number;
			gust?: number;
		};
		sys: {
			sunrise: number;
			sunset: number;
		};
		visibility: number;
	}

	import type { Config } from '$lib/configStore';

	// --- Props ---
	let {
		location = 'London',
		// General styles
		fontFamily = 'sans-serif',
		textColor = '#000000',
		bgColorHex = '#ffffff',
		// Override logic
		weatherOverrideGeneralStyle = false,
		weatherStyleOptions = {} as Config['weatherStyleOptions'],
		// Detail visibility
		weatherShowWind = false,
		weatherShowAtmosphere = false,
		weatherShowSun = false
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

	function formatTime(timestamp: number) {
		const date = new Date(timestamp * 1000);
		// Adjust for timezone if the API provides a timezone offset
		// Note: OpenWeatherMap `dt` is UTC. Timezone offset is in `timezone`.
		// However, toLocaleTimeString without a specific timezone will use the user's local time,
		// which is generally the desired behavior.
		return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	}

	function windDirection(deg: number) {
		const directions = [
			'N',
			'NNE',
			'NE',
			'ENE',
			'E',
			'ESE',
			'SE',
			'SSE',
			'S',
			'SSW',
			'SW',
			'WSW',
			'W',
			'WNW',
			'NW',
			'NNW'
		];
		const index = Math.round(deg / 22.5) % 16;
		return directions[index];
	}

	const effectiveStyles = $derived(
		weatherOverrideGeneralStyle ? weatherStyleOptions : { fontFamily, textColor, bgColorHex }
	);

	let style = $derived(`
		--bg-color: ${effectiveStyles.bgColorHex || '#ffffff'};
		--text-color: ${effectiveStyles.textColor || '#000000'};
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

			{#if weatherShowWind || weatherShowAtmosphere || weatherShowSun}
				<div class="details">
					{#if weatherShowWind && weatherData.wind}
						<div class="detail-group">
							<h4>Wind</h4>
							<p>
								{windDirection(weatherData.wind.deg)}
								{weatherData.wind.speed.toFixed(1)} m/s
							</p>
							{#if weatherData.wind.gust}
								<p>Gusts: {weatherData.wind.gust.toFixed(1)} m/s</p>
							{/if}
						</div>
					{/if}

					{#if weatherShowAtmosphere && weatherData.main}
						<div class="detail-group">
							<h4>Atmosphere</h4>
							<p>Humidity: {weatherData.main.humidity}%</p>
							<p>Pressure: {weatherData.main.pressure} hPa</p>
							<p>Visibility: {(weatherData.visibility / 1000).toFixed(1)} km</p>
						</div>
					{/if}

					{#if weatherShowSun && weatherData.sys}
						<div class="detail-group">
							<h4>Sun</h4>
							<p>Sunrise: {formatTime(weatherData.sys.sunrise)}</p>
							<p>Sunset: {formatTime(weatherData.sys.sunset)}</p>
						</div>
					{/if}
				</div>
			{/if}
		</div>
	{:else}
		<p>Enter a location and API key in the settings page.</p>
	{/if}
</div>

<style>
	.weather-widget {
		font-size: 1rem;
		font-weight: normal;
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

	.details {
		display: flex;
		justify-content: space-around;
		gap: 1rem;
		margin-top: 1rem;
		text-align: left;
		width: 100%;
		border-top: 1px solid #eee;
		padding-top: 1rem;
		flex-wrap: wrap;
	}
	.detail-group {
		min-width: 120px;
		flex: 1;
	}
	.detail-group h4 {
		margin: 0 0 0.5rem 0;
		font-size: 0.9rem;
		color: var(--text-color);
		opacity: 0.8;
	}
	.detail-group p {
		margin: 0.25rem 0;
		font-size: 0.85rem;
		white-space: nowrap;
	}
</style>
