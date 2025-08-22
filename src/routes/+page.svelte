<script lang="ts">
	import Clock from '$lib/components/Clock.svelte';
	import CountdownTimer from '$lib/components/CountdownTimer.svelte';
	import Text from '$lib/components/Text.svelte';
	import SpinningWheel from '$lib/components/SpinningWheel.svelte';
	import LadderGame from '$lib/components/LadderGame.svelte';
	import WeatherWidget from '$lib/components/WeatherWidget.svelte';
	import Tabs from '$lib/components/Tabs.svelte';
	import Tab from '$lib/components/Tab.svelte';
	import MultiSelect from '$lib/components/MultiSelect.svelte';
	import ComboBox from '$lib/components/ComboBox.svelte';
	import {
		configStore,
		type Config,
		profilesStore,
		activeProfileNameStore,
		saveProfile as saveProfileToStore,
		updateActiveProfile,
		renameProfile as renameProfileInStore,
		deleteProfile as deleteProfileFromStore,
		loadProfile
	} from '$lib/configStore';
	import { cities } from '$lib/cities';
	import { base } from '$app/paths';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';

	let profileNames = $derived(Object.keys($profilesStore));

	onMount(() => {
		const profiles = get(profilesStore);
		let profileNames = Object.keys(profiles);

		// On initial load, check if any profiles exist. If not, create a default one.
		if (profileNames.length === 0) {
			saveProfileToStore('Default');
			// After creating 'Default', profile-related stores are updated.
			// We need to get the latest state to proceed.
			return; // The $derived `profileNames` will trigger updates.
		}

		// Check if there was a previously active profile and load it.
		const lastActiveProfile = get(activeProfileNameStore);
		if (lastActiveProfile && profiles[lastActiveProfile]) {
			loadProfile(lastActiveProfile);
		} else if (profileNames.length > 0) {
			// If no active profile is set or the last active one was deleted,
			// load the first available profile.
			loadProfile(profileNames[0]);
		}
	});

	// --- Profile Management Functions ---
	function handleSaveProfile() {
		const name = prompt('Enter a name for the new profile:', 'New Profile');
		if (name && !$profilesStore[name]) {
			saveProfileToStore(name);
		} else if (name) {
			alert(`A profile named "${name}" already exists.`);
		}
	}

	function handleUpdateProfile() {
		updateActiveProfile();
		alert(`Profile "${$activeProfileNameStore}" has been saved.`);
	}

	function handleRenameProfile() {
		const activeName = $activeProfileNameStore;
		if (!activeName) return;
		const newName = prompt('Enter the new name for this profile:', activeName);

		if (newName && newName !== activeName && !$profilesStore[newName]) {
			renameProfileInStore(activeName, newName);
		} else if (newName) {
			alert(`A profile named "${newName}" already exists or the name is unchanged.`);
		}
	}

	function handleDeleteProfile() {
		const activeName = $activeProfileNameStore;
		if (!activeName) return;

		if (Object.keys($profilesStore).length <= 1) {
			alert('Cannot delete the last profile.');
			return;
		}

		if (confirm(`Are you sure you want to delete the profile "${activeName}"?`)) {
			deleteProfileFromStore(activeName);
		}
	}

	function handleSwitchProfile(event: Event) {
		const target = event.target as HTMLSelectElement;
		const newProfileName = target.value;
		if (newProfileName && $profilesStore[newProfileName]) {
			loadProfile(newProfileName);
		}
	}

	type UrlParams = Omit<
		Partial<Config>,
		| 'clockStyleOptions'
		| 'timerStyleOptions'
		| 'textStyleOptions'
		| 'spinningWheelStyleOptions'
		| 'ladderStyleOptions'
		| 'weatherStyleOptions'
	> & {
		clockStyleOptions?: string;
		timerStyleOptions?: string;
		textStyleOptions?: string;
		spinningWheelStyleOptions?: string;
		ladderStyleOptions?: string;
		weatherStyleOptions?: string;
	};

	function generateUrl(path: string, params: UrlParams) {
		const url = new URL(base + path, window.location.origin);
		for (const key in params) {
			const value = params[key as keyof UrlParams];
			if (value !== null && value !== undefined && value !== '') {
				url.searchParams.set(key, String(value));
			}
		}
		return url.toString();
	}

	function openInNewTab(path: string, params: UrlParams) {
		window.open(generateUrl(path, params), '_blank');
	}

	function getClockParams() {
		const {
			fontFamily,
			fontSize,
			fontWeight,
			textColor,
			bgColorHex,
			styleType,
			showDate,
			showDay,
			timezone,
			analogClockWidth,
			clockOverrideGeneralStyle,
			clockStyleOptions
		} = get(configStore);
		return {
			fontFamily,
			fontSize,
			fontWeight,
			textColor,
			bgColorHex,
			styleType,
			showDate,
			showDay,
			timezone,
			analogClockWidth,
			clockOverrideGeneralStyle,
			clockStyleOptions: JSON.stringify(clockStyleOptions)
		};
	}

	function getTimerParams() {
		const {
			fontFamily,
			fontSize,
			fontWeight,
			textColor,
			bgColorHex,
			hours,
			minutes,
			seconds,
			timeupText,
			timerOverrideGeneralStyle,
			timerStyleOptions
		} = get(configStore);
		return {
			fontFamily,
			fontSize,
			fontWeight,
			textColor,
			bgColorHex,
			hours,
			minutes,
			seconds,
			timeupText,
			timerOverrideGeneralStyle,
			timerStyleOptions: JSON.stringify(timerStyleOptions)
		};
	}

	function getTextParams() {
		const {
			fontFamily,
			fontSize,
			fontWeight,
			textColor,
			bgColorHex,
			text,
			textOverrideGeneralStyle,
			textStyleOptions
		} = get(configStore);
		return {
			fontFamily,
			fontSize,
			fontWeight,
			textColor,
			bgColorHex,
			text,
			textOverrideGeneralStyle,
			textStyleOptions: JSON.stringify(textStyleOptions)
		};
	}

	function getWheelParams() {
		const {
			fontFamily,
			fontSize,
			fontWeight,
			textColor,
			bgColorHex,
			spinningWheelItems,
			spinningWheelOverrideGeneralStyle,
			spinningWheelStyleOptions
		} = get(configStore);
		return {
			fontFamily,
			fontSize,
			fontWeight,
			textColor,
			bgColorHex,
			spinningWheelItems,
			spinningWheelOverrideGeneralStyle,
			spinningWheelStyleOptions: JSON.stringify(spinningWheelStyleOptions)
		};
	}

	function getLadderParams() {
		const {
			fontFamily,
			fontSize,
			fontWeight,
			textColor,
			bgColorHex,
			ladderPlayers,
			ladderResults,
			ladderIsManualMode,
			ladderOverrideGeneralStyle,
			ladderStyleOptions
		} = get(configStore);
		return {
			fontFamily,
			fontSize,
			fontWeight,
			textColor,
			bgColorHex,
			ladderPlayers,
			ladderResults,
			ladderIsManualMode,
			ladderOverrideGeneralStyle,
			ladderStyleOptions: JSON.stringify(ladderStyleOptions)
		};
	}

	function getWeatherParams() {
		const {
			fontFamily,
			fontSize,
			fontWeight,
			textColor,
			bgColorHex,
			weatherLocation,
			weatherApiKey,
			weatherOverrideGeneralStyle,
			weatherStyleOptions
		} = get(configStore);
		return {
			fontFamily,
			fontSize,
			fontWeight,
			textColor,
			bgColorHex,
			weatherLocation,
			weatherApiKey,
			weatherOverrideGeneralStyle,
			weatherStyleOptions: JSON.stringify(weatherStyleOptions)
		};
	}

	function getContrastingTextColor(hexcolor: string) {
		if (!hexcolor) return '#000000';
		hexcolor = hexcolor.replace('#', '');
		if (hexcolor.length === 3) {
			hexcolor = hexcolor
				.split('')
				.map((char) => char + char)
				.join('');
		}
		const r = parseInt(hexcolor.substr(0, 2), 16);
		const g = parseInt(hexcolor.substr(2, 2), 16);
		const b = parseInt(hexcolor.substr(4, 2), 16);
		const yiq = (r * 299 + g * 587 + b * 114) / 1000;
		return yiq >= 128 ? '#000000' : '#ffffff';
	}

	function loadFonts(fontFamilies: string) {
		if (!fontFamilies) return;

		const fonts = fontFamilies.split(',').map((f) => f.trim());
		for (const fontName of fonts) {
			const fontId = `font-link-${fontName.replace(/\s/g, '-')}`;
			if (!document.getElementById(fontId)) {
				const link = document.createElement('link');
				link.id = fontId;
				link.rel = 'stylesheet';
				link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(
					/\s/g,
					'+'
				)}&display=swap`;
				document.head.appendChild(link);
			}
		}
	}

	// --- Reactive Font Loading ---
	$effect(() => {
		loadFonts($configStore.fontFamily);
		if ($configStore.clockOverrideGeneralStyle) {
			loadFonts($configStore.clockStyleOptions.fontFamily);
		}
		if ($configStore.timerOverrideGeneralStyle) {
			loadFonts($configStore.timerStyleOptions.fontFamily);
		}
		if ($configStore.textOverrideGeneralStyle) {
			loadFonts($configStore.textStyleOptions.fontFamily);
		}
		if ($configStore.spinningWheelOverrideGeneralStyle) {
			loadFonts($configStore.spinningWheelStyleOptions.fontFamily);
		}
		if ($configStore.ladderOverrideGeneralStyle) {
			loadFonts($configStore.ladderStyleOptions.fontFamily);
		}
		if ($configStore.weatherOverrideGeneralStyle) {
			loadFonts($configStore.weatherStyleOptions.fontFamily);
		}
	});

	const tabTitles = ['General', 'Clock', 'Timer', 'Text', 'Wheel', 'Ladder', 'Weather'];
	const timezones = Intl.supportedValuesOf('timeZone');
	const fontFamilies = [
		'Orbitron',
		'Roboto',
		'Inter',
		'Roboto Slab',
		'Press Start 2P',
		'Noto Sans TC',
		'LXGW WenKai TC',
		'DotGothic16',
		'Source Han Serif',
		'Noto Serif CJK',
		'Source Han Sans',
		'Noto Sans CJK',
		'WenQuanYi Zen Hei',
		'WenQuanYi Micro Hei',
		'Microsoft JhengHei',
		'Microsoft YaHei',
		'Nanum Myeongjo',
		'Nanum Gothic',
		'Hiragino Kaku Gothic',
		'Hiragino Minchō',
		'Yu Gothic',
		'Meiryo',
		'MS Gothic',
		'MS Mincho',
		'SimSun',
		'PMingLiU',
		'DFKai-SB',
		'Kaiti',
		'Lobster',
		'Pacifico',
		'Caveat',
		'Dancing Script',
		'Shadows Into Light',
		'Amatic SC',
		'Permanent Marker',
		'Bangers',
		'Creepster',
		'VT323',
		'Share Tech Mono',
		'Major Mono Display',
		'Black Ops One',
		'Special Elite',
		'Monoton',
		'Bungee',
		'Merriweather',
		'Playfair Display',
		'Lora',
		'PT Serif',
		'Georgia',
		'Times New Roman',
		'ZCOOL XiaoWei',
		'ZCOOL KuaiLe',
		'ZCOOL QingKe HuangYou',
		'Roboto Mono',
		'Source Code Pro',
		'Inconsolata',
		'Courier New',
		'monospace'
	];
</script>

<div class="config-page">
	<aside class="settings-panel">
		<h2>Settings</h2>

		<section class="profile-manager">
			<div class="profile-controls">
				<label class="profile-label">
					Profile:
					<select
						onchange={handleSwitchProfile}
						class="profile-select"
						bind:value={$activeProfileNameStore}
					>
						{#if profileNames.length === 0}
							<option value="" disabled selected>No profiles saved</option>
						{/if}
						{#each profileNames as name}
							<option value={name}>{name}</option>
						{/each}
					</select>
				</label>
				<div class="profile-buttons">
					<button
						onclick={handleUpdateProfile}
						title="Save changes to current profile"
						disabled={!$activeProfileNameStore}>Save</button
					>
					<button onclick={handleSaveProfile} title="Save current settings as new profile"
						>Save As...</button
					>
					<button
						onclick={handleRenameProfile}
						title="Rename selected profile"
						disabled={!$activeProfileNameStore}>Rename</button
					>
					<button
						onclick={handleDeleteProfile}
						title="Delete selected profile"
						disabled={!$activeProfileNameStore}>Delete</button
					>
				</div>
			</div>
		</section>

		<Tabs titles={tabTitles}>
			<Tab index={0}>
				<section>
					<h3>General</h3>
					<label>
						Font Family
						<MultiSelect bind:value={$configStore.fontFamily} options={fontFamilies} />
					</label>
					<label>
						Font Size
						<input type="text" bind:value={$configStore.fontSize} />
					</label>
					<label>
						Font Weight
						<select bind:value={$configStore.fontWeight}>
							<option value="100">100</option>
							<option value="200">200</option>
							<option value="300">300</option>
							<option value="400">400</option>
							<option value="500">500</option>
							<option value="600">600</option>
							<option value="700">700</option>
							<option value="800">800</option>
							<option value="900">900</option>
						</select>
					</label>
					<label>
						Text Color
						<div class="color-input-group">
							<input type="color" bind:value={$configStore.textColor} />
							<input
								type="text"
								bind:value={$configStore.textColor}
								style="background-color: {$configStore.textColor}; color: {getContrastingTextColor(
									$configStore.textColor
								)};"
							/>
						</div>
					</label>
					<label>
						Background Color
						<div class="color-input-group">
							<input type="color" bind:value={$configStore.bgColorHex} />
							<input
								type="text"
								bind:value={$configStore.bgColorHex}
								style="background-color: {$configStore.bgColorHex}; color: {getContrastingTextColor(
									$configStore.bgColorHex
								)};"
							/>
						</div>
					</label>
					<label>
						Google Fonts API Key
						<input type="password" bind:value={$configStore.googleFontsApiKey} />
					</label>
				</section>
			</Tab>
			<Tab index={1}>
				<section>
					<h3>Clock</h3>
					<div class="control-group">
						<span>Style</span>
						<label>
							<input type="radio" bind:group={$configStore.styleType} value="digital" />
							Digital
						</label>
						<label>
							<input type="radio" bind:group={$configStore.styleType} value="analog" />
							Analog
						</label>
					</div>
					{#if $configStore.styleType === 'digital'}
						<label class="checkbox-label">
							<input type="checkbox" bind:checked={$configStore.showDate} />
							Show Date
						</label>
						<label class="checkbox-label">
							<input type="checkbox" bind:checked={$configStore.showDay} />
							Show Day of Week
						</label>
					{/if}
					{#if $configStore.styleType === 'analog'}
						<label>
							Analog Clock Width
							<input
								type="text"
								bind:value={$configStore.analogClockWidth}
								placeholder="e.g., 300px or 100%"
							/>
						</label>
					{/if}
					<label>
						Timezone
						<select bind:value={$configStore.timezone}>
							<option value="">(User's Local Time)</option>
							{#each timezones as tz}
								<option value={tz}>{tz}</option>
							{/each}
						</select>
					</label>

					<h4 class="style-header">Style</h4>
					<label class="checkbox-label">
						<input type="checkbox" bind:checked={$configStore.clockOverrideGeneralStyle} />
						Override general styles
					</label>

					{#if $configStore.clockOverrideGeneralStyle}
						<div class="style-options-group">
							<label>
								Font Family
								<MultiSelect
									bind:value={$configStore.clockStyleOptions.fontFamily}
									options={fontFamilies}
								/>
							</label>
							<label>
								Font Size
								<input type="text" bind:value={$configStore.clockStyleOptions.fontSize} />
							</label>
							<label>
								Font Weight
								<select bind:value={$configStore.clockStyleOptions.fontWeight}>
									<option value="100">100</option>
									<option value="200">200</option>
									<option value="300">300</option>
									<option value="400">400</option>
									<option value="500">500</option>
									<option value="600">600</option>
									<option value="700">700</option>
									<option value="800">800</option>
									<option value="900">900</option>
								</select>
							</label>
							<label>
								Text Color
								<div class="color-input-group">
									<input type="color" bind:value={$configStore.clockStyleOptions.textColor} />
									<input
										type="text"
										bind:value={$configStore.clockStyleOptions.textColor}
										style="background-color: {$configStore.clockStyleOptions
											.textColor}; color: {getContrastingTextColor(
											$configStore.clockStyleOptions.textColor
										)};"
									/>
								</div>
							</label>
							<label>
								Background Color
								<div class="color-input-group">
									<input type="color" bind:value={$configStore.clockStyleOptions.bgColorHex} />
									<input
										type="text"
										bind:value={$configStore.clockStyleOptions.bgColorHex}
										style="background-color: {$configStore.clockStyleOptions
											.bgColorHex}; color: {getContrastingTextColor(
											$configStore.clockStyleOptions.bgColorHex
										)};"
									/>
								</div>
							</label>
						</div>
					{/if}
				</section>
			</Tab>
			<Tab index={2}>
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

					<h4 class="style-header">Style</h4>
					<label class="checkbox-label">
						<input type="checkbox" bind:checked={$configStore.timerOverrideGeneralStyle} />
						Override general styles
					</label>

					{#if $configStore.timerOverrideGeneralStyle}
						<div class="style-options-group">
							<label>
								Font Family
								<MultiSelect
									bind:value={$configStore.timerStyleOptions.fontFamily}
									options={fontFamilies}
								/>
							</label>
							<label>
								Font Size
								<input type="text" bind:value={$configStore.timerStyleOptions.fontSize} />
							</label>
							<label>
								Font Weight
								<select bind:value={$configStore.timerStyleOptions.fontWeight}>
									<option value="100">100</option>
									<option value="200">200</option>
									<option value="300">300</option>
									<option value="400">400</option>
									<option value="500">500</option>
									<option value="600">600</option>
									<option value="700">700</option>
									<option value="800">800</option>
									<option value="900">900</option>
								</select>
							</label>
							<label>
								Text Color
								<div class="color-input-group">
									<input type="color" bind:value={$configStore.timerStyleOptions.textColor} />
									<input
										type="text"
										bind:value={$configStore.timerStyleOptions.textColor}
										style="background-color: {$configStore.timerStyleOptions
											.textColor}; color: {getContrastingTextColor(
											$configStore.timerStyleOptions.textColor
										)};"
									/>
								</div>
							</label>
							<label>
								Background Color
								<div class="color-input-group">
									<input type="color" bind:value={$configStore.timerStyleOptions.bgColorHex} />
									<input
										type="text"
										bind:value={$configStore.timerStyleOptions.bgColorHex}
										style="background-color: {$configStore.timerStyleOptions
											.bgColorHex}; color: {getContrastingTextColor(
											$configStore.timerStyleOptions.bgColorHex
										)};"
									/>
								</div>
							</label>
						</div>
					{/if}
				</section>
			</Tab>
			<Tab index={3}>
				<section>
					<h3>Text Display</h3>
					<label>
						Text
						<input type="text" bind:value={$configStore.text} />
					</label>

					<h4 class="style-header">Style</h4>
					<label class="checkbox-label">
						<input type="checkbox" bind:checked={$configStore.textOverrideGeneralStyle} />
						Override general styles
					</label>

					{#if $configStore.textOverrideGeneralStyle}
						<div class="style-options-group">
							<label>
								Font Family
								<MultiSelect
									bind:value={$configStore.textStyleOptions.fontFamily}
									options={fontFamilies}
								/>
							</label>
							<label>
								Font Size
								<input type="text" bind:value={$configStore.textStyleOptions.fontSize} />
							</label>
							<label>
								Font Weight
								<select bind:value={$configStore.textStyleOptions.fontWeight}>
									<option value="100">100</option>
									<option value="200">200</option>
									<option value="300">300</option>
									<option value="400">400</option>
									<option value="500">500</option>
									<option value="600">600</option>
									<option value="700">700</option>
									<option value="800">800</option>
									<option value="900">900</option>
								</select>
							</label>
							<label>
								Text Color
								<div class="color-input-group">
									<input type="color" bind:value={$configStore.textStyleOptions.textColor} />
									<input
										type="text"
										bind:value={$configStore.textStyleOptions.textColor}
										style="background-color: {$configStore.textStyleOptions
											.textColor}; color: {getContrastingTextColor(
											$configStore.textStyleOptions.textColor
										)};"
									/>
								</div>
							</label>
							<label>
								Background Color
								<div class="color-input-group">
									<input type="color" bind:value={$configStore.textStyleOptions.bgColorHex} />
									<input
										type="text"
										bind:value={$configStore.textStyleOptions.bgColorHex}
										style="background-color: {$configStore.textStyleOptions
											.bgColorHex}; color: {getContrastingTextColor(
											$configStore.textStyleOptions.bgColorHex
										)};"
									/>
								</div>
							</label>
						</div>
					{/if}
				</section>
			</Tab>
			<Tab index={4}>
				<section>
					<h3>Spinning Wheel</h3>
					<label>
						Items (one per line)
						<textarea bind:value={$configStore.spinningWheelItems}></textarea>
					</label>

					<h4 class="style-header">Style</h4>
					<label class="checkbox-label">
						<input type="checkbox" bind:checked={$configStore.spinningWheelOverrideGeneralStyle} />
						Override general styles
					</label>

					{#if $configStore.spinningWheelOverrideGeneralStyle}
						<div class="style-options-group">
							<label>
								Font Family
								<MultiSelect
									bind:value={$configStore.spinningWheelStyleOptions.fontFamily}
									options={fontFamilies}
								/>
							</label>
							<label>
								Font Size
								<input type="text" bind:value={$configStore.spinningWheelStyleOptions.fontSize} />
							</label>
							<label>
								Font Weight
								<select bind:value={$configStore.spinningWheelStyleOptions.fontWeight}>
									<option value="100">100</option>
									<option value="200">200</option>
									<option value="300">300</option>
									<option value="400">400</option>
									<option value="500">500</option>
									<option value="600">600</option>
									<option value="700">700</option>
									<option value="800">800</option>
									<option value="900">900</option>
								</select>
							</label>
							<label>
								Text Color
								<div class="color-input-group">
									<input
										type="color"
										bind:value={$configStore.spinningWheelStyleOptions.textColor}
									/>
									<input
										type="text"
										bind:value={$configStore.spinningWheelStyleOptions.textColor}
										style="background-color: {$configStore.spinningWheelStyleOptions
											.textColor}; color: {getContrastingTextColor(
											$configStore.spinningWheelStyleOptions.textColor
										)};"
									/>
								</div>
							</label>
							<label>
								Background Color
								<div class="color-input-group">
									<input
										type="color"
										bind:value={$configStore.spinningWheelStyleOptions.bgColorHex}
									/>
									<input
										type="text"
										bind:value={$configStore.spinningWheelStyleOptions.bgColorHex}
										style="background-color: {$configStore.spinningWheelStyleOptions
											.bgColorHex}; color: {getContrastingTextColor(
											$configStore.spinningWheelStyleOptions.bgColorHex
										)};"
									/>
								</div>
							</label>
						</div>
					{/if}
				</section>
			</Tab>
			<Tab index={5}>
				<section>
					<h3>Ladder Game</h3>
					<label>
						Start Items (one per line)
						<textarea bind:value={$configStore.ladderPlayers}></textarea>
					</label>
					<label>
						End Items (one per line)
						<textarea bind:value={$configStore.ladderResults}></textarea>
					</label>
					<label class="checkbox-label">
						<input type="checkbox" bind:checked={$configStore.ladderIsManualMode} />
						Manual Mode
					</label>

					<h4 class="style-header">Style</h4>
					<label class="checkbox-label">
						<input type="checkbox" bind:checked={$configStore.ladderOverrideGeneralStyle} />
						Override general styles
					</label>

					{#if $configStore.ladderOverrideGeneralStyle}
						<div class="style-options-group">
							<label>
								Font Family
								<MultiSelect
									bind:value={$configStore.ladderStyleOptions.fontFamily}
									options={fontFamilies}
								/>
							</label>
							<label>
								Font Size (px)
								<input
									type="number"
									bind:value={$configStore.ladderStyleOptions.fontSize}
									min="8"
								/>
							</label>
							<label>
								Font Weight
								<select bind:value={$configStore.ladderStyleOptions.fontWeight}>
									<option value="normal">Normal</option>
									<option value="bold">Bold</option>
									<option value="lighter">Lighter</option>
								</select>
							</label>
							<label>
								Text Color
								<div class="color-input-group">
									<input type="color" bind:value={$configStore.ladderStyleOptions.textColor} />
									<input
										type="text"
										bind:value={$configStore.ladderStyleOptions.textColor}
										style="background-color: {$configStore.ladderStyleOptions
											.textColor}; color: {getContrastingTextColor(
											$configStore.ladderStyleOptions.textColor
										)};"
									/>
								</div>
							</label>
							<label>
								Background Color
								<div class="color-input-group">
									<input
										type="color"
										bind:value={$configStore.ladderStyleOptions.backgroundColor}
									/>
									<input
										type="text"
										bind:value={$configStore.ladderStyleOptions.backgroundColor}
										style="background-color: {$configStore.ladderStyleOptions
											.backgroundColor}; color: {getContrastingTextColor(
											$configStore.ladderStyleOptions.backgroundColor
										)};"
									/>
								</div>
							</label>
							<label>
								Line Color
								<div class="color-input-group">
									<input type="color" bind:value={$configStore.ladderStyleOptions.lineColor} />
									<input
										type="text"
										bind:value={$configStore.ladderStyleOptions.lineColor}
										style="background-color: {$configStore.ladderStyleOptions
											.lineColor}; color: {getContrastingTextColor(
											$configStore.ladderStyleOptions.lineColor
										)};"
									/>
								</div>
							</label>
							<label>
								Rung Color
								<div class="color-input-group">
									<input type="color" bind:value={$configStore.ladderStyleOptions.rungColor} />
									<input
										type="text"
										bind:value={$configStore.ladderStyleOptions.rungColor}
										style="background-color: {$configStore.ladderStyleOptions
											.rungColor}; color: {getContrastingTextColor(
											$configStore.ladderStyleOptions.rungColor
										)};"
									/>
								</div>
							</label>
							<label>
								Line Thickness (px)
								<input
									type="range"
									bind:value={$configStore.ladderStyleOptions.lineThickness}
									min="1"
									max="10"
								/>
							</label>
						</div>
					{/if}
				</section>
			</Tab>
			<Tab index={6}>
				<section>
					<h3>Weather Widget</h3>
					<label>
						Location
						<ComboBox
							bind:value={$configStore.weatherLocation}
							options={cities}
							placeholder="Select or type a city..."
						/>
					</label>
					<label>
						OpenWeatherMap API Key
						<input type="password" bind:value={$configStore.weatherApiKey} />
					</label>
					<h4 class="style-header">Style</h4>
					<label class="checkbox-label">
						<input type="checkbox" bind:checked={$configStore.weatherOverrideGeneralStyle} />
						Override general styles
					</label>

					{#if $configStore.weatherOverrideGeneralStyle}
						<div class="style-options-group">
							<label>
								Font Family
								<MultiSelect
									bind:value={$configStore.weatherStyleOptions.fontFamily}
									options={fontFamilies}
								/>
							</label>
							<label>
								Font Size
								<input type="text" bind:value={$configStore.weatherStyleOptions.fontSize} />
							</label>
							<label>
								Font Weight
								<select bind:value={$configStore.weatherStyleOptions.fontWeight}>
									<option value="100">100</option>
									<option value="200">200</option>
									<option value="300">300</option>
									<option value="400">400</option>
									<option value="500">500</option>
									<option value="600">600</option>
									<option value="700">700</option>
									<option value="800">800</option>
									<option value="900">900</option>
								</select>
							</label>
							<label>
								Text Color
								<div class="color-input-group">
									<input type="color" bind:value={$configStore.weatherStyleOptions.textColor} />
									<input
										type="text"
										bind:value={$configStore.weatherStyleOptions.textColor}
										style="background-color: {$configStore.weatherStyleOptions
											.textColor}; color: {getContrastingTextColor(
											$configStore.weatherStyleOptions.textColor
										)};"
									/>
								</div>
							</label>
							<label>
								Background Color
								<div class="color-input-group">
									<input type="color" bind:value={$configStore.weatherStyleOptions.bgColorHex} />
									<input
										type="text"
										bind:value={$configStore.weatherStyleOptions.bgColorHex}
										style="background-color: {$configStore.weatherStyleOptions
											.bgColorHex}; color: {getContrastingTextColor(
											$configStore.weatherStyleOptions.bgColorHex
										)};"
									/>
								</div>
							</label>
						</div>
					{/if}
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
				<button onclick={() => openInNewTab('/clock', getClockParams())}>Open Clock</button>
			</div>
			<div class="preview-item">
				<h3>Countdown Timer</h3>
				<div class="preview-content">
					<CountdownTimer {...$configStore} />
				</div>
				<button onclick={() => openInNewTab('/countdownTimer', getTimerParams())}
					>Open Countdown</button
				>
			</div>
			<div class="preview-item">
				<h3>Text Display</h3>
				<div class="preview-content">
					<Text {...$configStore} />
				</div>
				<button onclick={() => openInNewTab('/text', getTextParams())}>Open Text Display</button>
			</div>
			<div class="preview-item">
				<h3>Spinning Wheel</h3>
				<div class="preview-content">
					<SpinningWheel
						items={$configStore.spinningWheelItems.split('\n').filter((i) => i.trim() !== '')}
					/>
				</div>
				<button onclick={() => openInNewTab('/spinningWheel', getWheelParams())}
					>Open Spinning Wheel</button
				>
			</div>
			<div class="preview-item">
				<h3>Ladder Game</h3>
				<div class="preview-content">
					<LadderGame />
				</div>
				<button onclick={() => openInNewTab('/ladderGame', getLadderParams())}
					>Open Ladder Game</button
				>
			</div>
			<div class="preview-item">
				<h3>Weather Widget</h3>
				<div class="preview-content">
					<WeatherWidget location={$configStore.weatherLocation} />
				</div>
				<button onclick={() => openInNewTab('/weather', getWeatherParams())}>
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
	.color-input-group {
		display: flex;
		align-items: center;
	}
	.color-input-group input[type='color'] {
		width: 40px;
		height: 40px;
		padding: 0;
		border: none;
	}
	.color-input-group input[type='text'] {
		flex: 1;
		margin-left: 0.5rem;
	}

	.checkbox-label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.checkbox-label input {
		width: auto;
	}

	.style-header {
		margin-top: 1.5rem;
		margin-bottom: 1rem;
		font-size: 0.9rem;
		font-weight: bold;
		color: #555;
		border-bottom: 1px solid #eaeaea;
		padding-bottom: 0.5rem;
	}

	.style-options-group {
		border: 1px solid #ddd;
		padding: 1rem;
		margin-top: 1rem;
		margin-bottom: 1rem;
		border-radius: 4px;
		background-color: #fdfdfd;
	}

	.profile-manager {
		background-color: #f0f0f0;
		padding: 1rem;
		margin: 0 -2rem 2rem -2rem; /* Extend to panel edges, remove negative top margin */
		border-bottom: 1px solid #eaeaea;
	}

	.profile-controls {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.profile-label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-weight: bold;
	}

	.profile-select {
		flex-grow: 1;
		font-weight: normal; /* Override bold from label */
	}

	.profile-buttons {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 0.5rem;
	}

	.profile-buttons button {
		padding: 0.5rem;
		border: 1px solid #ccc;
		background-color: #fff;
		cursor: pointer;
		border-radius: 4px;
	}

	.profile-buttons button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.control-group {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 0.75rem;
	}
	.control-group span {
		font-weight: bold;
		min-width: 80px; /* Adjust as needed for alignment */
	}
	.control-group label {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		margin-bottom: 0; /* Override default label margin */
		font-weight: normal;
	}
</style>
