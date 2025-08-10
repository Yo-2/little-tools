<script lang="ts">
	import Clock from '$lib/components/Clock.svelte';
	import CountdownTimer from '$lib/components/CountdownTimer.svelte';
	import Text from '$lib/components/Text.svelte';
	import SpinningWheel from '$lib/components/SpinningWheel.svelte';
	import LadderGame from '$lib/components/LadderGame.svelte';
	import WeatherWidget from '$lib/components/WeatherWidget.svelte';
	import Tabs from '$lib/components/Tabs.svelte';
	import Tab from '$lib/components/Tab.svelte';
	import { configStore, type Config } from '$lib/configStore';
	import { base } from '$app/paths';

	function generateUrl(path: string, params: Partial<Config>) {
		const url = new URL(base + path, window.location.origin);
		for (const key in params) {
			const value = params[key as keyof Config];
			if (value !== null && value !== undefined && value !== '') {
				url.searchParams.set(key, String(value));
			}
		}
		return url.toString();
	}

	function openInNewTab(path: string, params: Partial<Config>) {
		window.open(generateUrl(path, params), '_blank');
	}

	const tabTitles = ['General', 'Timer', 'Text', 'Wheel', 'Weather'];
</script>

<div class="config-page">
	<aside class="settings-panel">
		<h2>Settings</h2>

		<Tabs titles={tabTitles}>
			<Tab index={0}>
				<section>
					<h3>General</h3>
					<label>
						Font Family
						<input type="text" bind:value={$configStore.fontFamily} />
					</label>
					<label>
						Font Size
						<input type="text" bind:value={$configStore.fontSize} />
					</label>
					<label>
						Font Weight
						<select bind:value={$configStore.fontWeight}>
							<option value="normal">Normal</option>
							<option value="bold">Bold</option>
							<option value="lighter">Lighter</option>
						</select>
					</label>
					<label>
						Text Color
						<input type="color" bind:value={$configStore.textColor} />
					</label>
					<label>
						Background Color
						<input type="color" bind:value={$configStore.bgColorHex} />
					</label>
				</section>
			</Tab>
			<Tab index={1}>
				<section>
					<h3>Countdown Timer</h3>
					<label>
						Hours
						<input type="number" bind:value={$configStore.hours} min="0" />
					</label>
					<label>
						Minutes
						<input type="number" bind:value={$configStore.minutes} min="0" />
					</label>
					<label>
						Seconds
						<input type="number" bind:value={$configStore.seconds} min="0" />
					</label>
					<label>
						Time's Up Text
						<input type="text" bind:value={$configStore.timeupText} />
					</label>
				</section>
			</Tab>
			<Tab index={2}>
				<section>
					<h3>Text Display</h3>
					<label>
						Text
						<input type="text" bind:value={$configStore.text} />
					</label>
				</section>
			</Tab>
			<Tab index={3}>
				<section>
					<h3>Spinning Wheel</h3>
					<label>
						Items (comma-separated)
						<textarea bind:value={$configStore.spinningWheelItems}></textarea>
					</label>
				</section>
			</Tab>
			<Tab index={4}>
				<section>
					<h3>Weather Widget</h3>
					<label>
						Location
						<input type="text" bind:value={$configStore.weatherLocation} />
					</label>
					<label>
						OpenWeatherMap API Key
						<input type="password" bind:value={$configStore.weatherApiKey} />
					</label>
				</section>
			</Tab>
		</Tabs>
	</aside>

	<main class="preview-area">
		<h2>Preview</h2>
		<div class="preview-grid">
			<div class="preview-item">
				<h3>Clock</h3>
				<div class="preview-content">
					<Clock {...$configStore} />
				</div>
				<button onclick={() => openInNewTab('/clock', $configStore)}>Open Clock</button>
			</div>
			<div class="preview-item">
				<h3>Countdown Timer</h3>
				<div class="preview-content">
					<CountdownTimer {...$configStore} />
				</div>
				<button onclick={() => openInNewTab('/countdownTimer', $configStore)}>Open Countdown</button
				>
			</div>
			<div class="preview-item">
				<h3>Text Display</h3>
				<div class="preview-content">
					<Text {...$configStore} />
				</div>
				<button onclick={() => openInNewTab('/text', $configStore)}>Open Text Display</button>
			</div>
			<div class="preview-item">
				<h3>Spinning Wheel</h3>
				<div class="preview-content">
					<SpinningWheel items={$configStore.spinningWheelItems.split(',')} />
				</div>
				<button onclick={() => openInNewTab('/spinningWheel', $configStore)}
					>Open Spinning Wheel</button
				>
			</div>
			<div class="preview-item">
				<h3>Ladder Game</h3>
				<div class="preview-content">
					<LadderGame />
				</div>
				<button onclick={() => openInNewTab('/ladderGame', $configStore)}>Open Ladder Game</button>
			</div>
			<div class="preview-item">
				<h3>Weather Widget</h3>
				<div class="preview-content">
					<WeatherWidget location={$configStore.weatherLocation} />
				</div>
				<button
					onclick={() =>
						openInNewTab('/weather', { weatherLocation: $configStore.weatherLocation })}
				>
					Open Weather Widget
				</button>
			</div>
		</div>
	</main>
</div>

<style>
	.config-page {
		display: flex;
		height: 100vh;
		font-family: sans-serif;
	}

	.settings-panel {
		width: 350px;
		padding: 2rem;
		border-right: 1px solid #eaeaea;
		overflow-y: auto;
	}

	.settings-panel h2 {
		margin-top: 0;
	}

	.settings-panel section {
		margin-bottom: 2rem;
	}

	.settings-panel h3 {
		margin-bottom: 1rem;
		margin-top: 0;
	}

	.settings-panel label {
		display: block;
		margin-bottom: 0.75rem;
	}

	.settings-panel input,
	.settings-panel select,
	.settings-panel textarea {
		width: 100%;
		padding: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		box-sizing: border-box;
	}

	.preview-area {
		flex: 1;
		padding: 2rem;
		background-color: #f7f7f7;
		overflow-y: auto;
	}

	.preview-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 2rem;
	}

	.preview-item {
		border: 1px solid #eaeaea;
		border-radius: 8px;
		background-color: #fff;
		display: flex;
		flex-direction: column;
	}

	.preview-item h3 {
		padding: 1rem;
		margin: 0;
		border-bottom: 1px solid #eaeaea;
	}

	.preview-content {
		padding: 1rem;
		min-height: 200px;
		flex-grow: 1;
		display: grid;
		place-items: center;
	}

	.preview-item button {
		display: block;
		width: calc(100% - 2rem);
		margin: 1rem;
		padding: 0.75rem;
		border: 1px solid #0070f3;
		background-color: #0070f3;
		color: white;
		border-radius: 4px;
		cursor: pointer;
		text-align: center;
		margin-top: auto;
	}
	.preview-item button:hover {
		background-color: #005bb5;
	}
</style>
