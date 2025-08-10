<script lang="ts">
	import Clock from '$lib/components/Clock.svelte';
	import CountdownTimer from '$lib/components/CountdownTimer.svelte';
	import Text from '$lib/components/Text.svelte';
	import SpinningWheel from '$lib/components/SpinningWheel.svelte';
	import LadderGame from '$lib/components/LadderGame.svelte';
	import WeatherWidget from '$lib/components/WeatherWidget.svelte';
	import Tabs from '$lib/components/Tabs.svelte';
	import Tab from '$lib/components/Tab.svelte';
	import { configStore, type Config, type ComponentConfig } from '$lib/configStore';
	import { base } from '$app/paths';

	function getComponentProps(name: keyof Config['components']) {
		const componentConf = $configStore.components[name];
		const generalConf = $configStore.general;

		// Start with general properties
		const props: Record<string, any> = { ...generalConf };

		// Merge component-specific properties, filtering out undefined values
		for (const key in componentConf) {
			const value = componentConf[key as keyof typeof componentConf];
			if (value !== undefined && value !== null && value !== '') {
				props[key] = value;
			}
		}

		// Add specific non-style props
		Object.assign(props, $configStore.components[name]);

		return props;
	}

	function generateUrl(path: string, config: Config) {
		const url = new URL(base + path, window.location.origin);
		const params = new URLSearchParams();

		// Flatten the config to URL params
		for (const [key, value] of Object.entries(config.general)) {
			params.set(key, String(value));
		}
		for (const compKey of Object.keys(config.components)) {
			const compConfig = config.components[compKey as keyof typeof config.components];
			for (const [key, value] of Object.entries(compConfig)) {
				if (value !== null && value !== undefined && value !== '') {
					// Prefix component-specific props to avoid collisions, e.g., text_text
					params.set(`${compKey}_${key}`, String(value));
				}
			}
		}

		url.search = params.toString();
		return url.toString();
	}

	function openInNewTab(path: string) {
		window.open(generateUrl(path, $configStore), '_blank');
	}

	const tabTitles = ['General', 'Clock', 'Timer', 'Text', 'Wheel', 'Ladder', 'Weather'];

	// A list of available fonts for the new UI.
	// In a real app, this might come from a config file or API.
	const availableFonts = [
		// Generic
		'sans-serif',
		'serif',
		'monospace',
		'cursive',
		'fantasy',
		// Common web-safe fonts
		'Arial',
		'Verdana',
		'Tahoma',
		'Trebuchet MS',
		'Times New Roman',
		'Georgia',
		'Courier New',
		// Custom fonts (assuming they are added in app.css)
		'Roboto'
	];
</script>

<div class="config-page">
	<aside class="settings-panel">
		<h2>Settings</h2>

		<Tabs titles={tabTitles}>
			<Tab index={0}>
				<section>
					<h3>General</h3>
					<div class="form-group">
						<label>Font Family</label>
						<div class="font-family-selector">
							{#each availableFonts as font}
								<label class="font-option">
									<input
										type="checkbox"
										value={font}
										bind:group={$configStore.general.fontFamily}
									/>
									<span style:font-family={font}>{font}</span>
								</label>
							{/each}
						</div>
					</div>
					<label>
						Font Size
						<input type="text" bind:value={$configStore.general.fontSize} />
					</label>
					<label>
						Font Weight
						<select bind:value={$configStore.general.fontWeight}>
							<option value="normal">Normal</option>
							<option value="bold">Bold</option>
							<option value="lighter">Lighter</option>
						</select>
					</label>
					<label>
						Text Color
						<input type="color" bind:value={$configStore.general.textColor} />
					</label>
					<label>
						Background Color
						<input type="color" bind:value={$configStore.general.bgColorHex} />
					</label>
				</section>
			</Tab>
			<Tab index={1}>
				<section>
					<h3>Clock Overrides</h3>
					<p class="description">Leave blank to use General settings.</p>
					<label>
						Font Family
						<input type="text" list="font-families" bind:value={$configStore.components.clock.fontFamily} />
					</label>
					<label>
						Font Size
						<input type="text" bind:value={$configStore.components.clock.fontSize} />
					</label>
				</section>
			</Tab>
			<Tab index={2}>
				<section>
					<h3>Countdown Timer</h3>
					<label>
						Hours
						<input type="number" bind:value={$configStore.components.countdownTimer.hours} min="0" />
					</label>
					<label>
						Minutes
						<input type="number" bind:value={$configStore.components.countdownTimer.minutes} min="0" />
					</label>
					<label>
						Seconds
						<input type="number" bind:value={$configStore.components.countdownTimer.seconds} min="0" />
					</label>
					<label>
						Time's Up Text
						<input type="text" bind:value={$configStore.components.countdownTimer.timeupText} />
					</label>
				</section>
			</Tab>
			<Tab index={3}>
				<section>
					<h3>Text Display</h3>
					<label>
						Text
						<input type="text" bind:value={$configStore.components.text.text} />
					</label>
				</section>
			</Tab>
			<Tab index={4}>
				<section>
					<h3>Spinning Wheel</h3>
					<label>
						Items (one per line)
						<textarea bind:value={$configStore.components.spinningWheel.spinningWheelItems}></textarea>
					</label>
				</section>
			</Tab>
			<Tab index={5}>
				<section>
					<h3>Ladder Game</h3>
					<label>
						Players (one per line)
						<textarea bind:value={$configStore.components.ladderGame.ladderPlayers}></textarea>
					</label>
					<label>
						Prizes (one per line)
						<textarea bind:value={$configStore.components.ladderGame.ladderResults}></textarea>
					</label>
					<label>
						Animation Speed ({$configStore.components.ladderGame.ladderAnimationSpeed}s)
						<input
							type="range"
							bind:value={$configStore.components.ladderGame.ladderAnimationSpeed}
							min="0.5"
							max="10"
							step="0.1"
						/>
					</label>
				</section>
			</Tab>
			<Tab index={6}>
				<section>
					<h3>Weather Widget</h3>
					<label>
						Location
						<input type="text" bind:value={$configStore.components.weather.weatherLocation} />
					</label>
					<label>
						OpenWeatherMap API Key
						<input type="password" bind:value={$configStore.components.weather.weatherApiKey} />
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
					<Clock {...getComponentProps('clock')} />
				</div>
				<button onclick={() => openInNewTab('/clock')}>Open Clock</button>
			</div>
			<div class="preview-item">
				<h3>Countdown Timer</h3>
				<div class="preview-content">
					<CountdownTimer {...getComponentProps('countdownTimer')} />
				</div>
				<button onclick={() => openInNewTab('/countdownTimer')}>Open Countdown</button
				>
			</div>
			<div class="preview-item">
				<h3>Text Display</h3>
				<div class="preview-content">
					<Text {...getComponentProps('text')} />
				</div>
				<button onclick={() => openInNewTab('/text')}>Open Text Display</button>
			</div>
			<div class="preview-item">
				<h3>Spinning Wheel</h3>
				<div class="preview-content">
					<SpinningWheel
						items={$configStore.components.spinningWheel.spinningWheelItems.split('\n').filter((i) => i.trim() !== '')}
					/>
				</div>
				<button onclick={() => openInNewTab('/spinningWheel')}>Open Spinning Wheel</button>
			</div>
			<div class="preview-item">
				<h3>Ladder Game</h3>
				<div class="preview-content">
					<LadderGame
						{...getComponentProps('ladderGame')}
						players={$configStore.components.ladderGame.ladderPlayers.split('\n')}
						results={$configStore.components.ladderGame.ladderResults.split('\n')}
						animationSpeed={$configStore.components.ladderGame.ladderAnimationSpeed}
					/>
				</div>
				<button onclick={() => openInNewTab('/ladderGame')}>Open Ladder Game</button>
			</div>
			<div class="preview-item">
				<h3>Weather Widget</h3>
				<div class="preview-content">
					<WeatherWidget
						{...getComponentProps('weather')}
						location={$configStore.components.weather.weatherLocation}
						apiKey={$configStore.components.weather.weatherApiKey}
					/>
				</div>
				<button onclick={() => openInNewTab('/weather')}>
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

	.form-group {
		margin-bottom: 0.75rem;
	}
	.form-group > label {
		margin-bottom: 0.5rem;
		font-weight: bold;
	}
	.font-family-selector {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		max-height: 200px;
		overflow-y: auto;
		border: 1px solid #ccc;
		padding: 0.5rem;
		border-radius: 4px;
	}
	.font-option {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	.font-option input {
		width: auto;
	}

	.description {
		font-size: 0.8rem;
		color: #666;
		margin-top: -0.5rem;
		margin-bottom: 1rem;
	}

	.preview-area {
		flex: 1;
		padding: 2rem;
		background-color: #f7f7f7;
		overflow-y: auto;
	}

	.preview-grid {
		display: grid;
		grid-template-columns: 1fr;
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
