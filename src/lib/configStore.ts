import { writable, type Writable } from 'svelte/store';
import { browser } from '$app/environment';

// --- Type Definitions ---

export interface GeneralConfig {
	fontFamily: string[];
	fontSize: string;
	fontWeight: string;
	textColor: string;
	bgColorHex: string;
}

export interface ComponentConfig {
	fontFamily?: string[];
	fontSize?: string;
	fontWeight?: string;
	textColor?: string;
	bgColorHex?: string;
}

export interface Config {
	general: GeneralConfig;
	components: {
		clock: ComponentConfig;
		countdownTimer: ComponentConfig & {
			hours: number;
			minutes: number;
			seconds: number;
			timeupText: string;
		};
		text: ComponentConfig & {
			text: string;
		};
		spinningWheel: ComponentConfig & {
			spinningWheelItems: string;
		};
		ladderGame: ComponentConfig & {
			ladderPlayers: string;
			ladderResults: string;
			ladderAnimationSpeed: number;
		};
		weather: ComponentConfig & {
			weatherLocation: string;
			weatherApiKey: string;
		};
	};
}

// --- Default Configuration ---

const defaultConfig: Config = {
	general: {
		fontFamily: ['sans-serif'],
		fontSize: '2rem',
		fontWeight: 'normal',
		textColor: '#000000',
		bgColorHex: '#ffffff'
	},
	components: {
		clock: {},
		countdownTimer: {
			hours: 0,
			minutes: 5,
			seconds: 0,
			timeupText: "Time's up!"
		},
		text: {
			text: 'Sample Text'
		},
		spinningWheel: {
			spinningWheelItems: 'Prize 1\nPrize 2\nPrize 3\nPrize 4\nPrize 5\nPrize 6'
		},
		ladderGame: {
			ladderPlayers: 'Player 1\nPlayer 2\nPlayer 3\nPlayer 4',
			ladderResults: 'Prize A\nPrize B\nPrize C\nPrize D',
			ladderAnimationSpeed: 2
		},
		weather: {
			weatherLocation: 'London',
			weatherApiKey: ''
		}
	}
};

// --- Helper Functions ---

function isObject(item: unknown): item is Record<string, unknown> {
	return !!item && typeof item === 'object' && !Array.isArray(item);
}

function deepMerge<T extends object>(target: T, source: Partial<T>): T {
	const output = { ...target };
	if (isObject(target) && isObject(source)) {
		Object.keys(source).forEach((key) => {
			const sourceKey = key as keyof T;
			if (isObject(source[sourceKey]) && sourceKey in target && isObject(target[sourceKey])) {
				output[sourceKey] = deepMerge(target[sourceKey] as object, source[sourceKey] as object) as T[keyof T];
			} else {
				output[sourceKey] = source[sourceKey] as T[keyof T];
			}
		});
	}
	return output;
}

function migrateOldConfig(oldConfig: any): Config {
	const oldFontFamily = oldConfig.fontFamily;
	return {
		general: {
			fontFamily: oldFontFamily
				? Array.isArray(oldFontFamily)
					? oldFontFamily
					: [oldFontFamily]
				: defaultConfig.general.fontFamily,
			fontSize: oldConfig.fontSize || defaultConfig.general.fontSize,
			fontWeight: oldConfig.fontWeight || defaultConfig.general.fontWeight,
			textColor: oldConfig.textColor || defaultConfig.general.textColor,
			bgColorHex: oldConfig.bgColorHex || defaultConfig.general.bgColorHex
		},
		components: {
			clock: {},
			countdownTimer: {
				hours: oldConfig.hours ?? defaultConfig.components.countdownTimer.hours,
				minutes: oldConfig.minutes ?? defaultConfig.components.countdownTimer.minutes,
				seconds: oldConfig.seconds ?? defaultConfig.components.countdownTimer.seconds,
				timeupText: oldConfig.timeupText || defaultConfig.components.countdownTimer.timeupText
			},
			text: {
				text: oldConfig.text || defaultConfig.components.text.text
			},
			spinningWheel: {
				spinningWheelItems:
					oldConfig.spinningWheelItems || defaultConfig.components.spinningWheel.spinningWheelItems
			},
			ladderGame: {
				ladderPlayers: oldConfig.ladderPlayers || defaultConfig.components.ladderGame.ladderPlayers,
				ladderResults: oldConfig.ladderResults || defaultConfig.components.ladderGame.ladderResults,
				ladderAnimationSpeed:
					oldConfig.ladderAnimationSpeed ?? defaultConfig.components.ladderGame.ladderAnimationSpeed
			},
			weather: {
				weatherLocation:
					oldConfig.weatherLocation || defaultConfig.components.weather.weatherLocation,
				weatherApiKey: oldConfig.weatherApiKey || defaultConfig.components.weather.weatherApiKey
			}
		}
	};
}


// --- Store Creation ---

function createPersistentStore(key: string, startValue: Config): Writable<Config> {
	const isBrowser = typeof window !== 'undefined' && browser;
	const storedValue = isBrowser ? localStorage.getItem(key) : null;

	let initialValue = startValue;

	if (storedValue) {
		try {
			const stored = JSON.parse(storedValue);
			// Check if it's the old flat structure by looking for a top-level general setting
			if (stored && stored.fontFamily && !stored.general) {
				const migrated = migrateOldConfig(stored);
				initialValue = deepMerge(startValue, migrated);
			} else {
				initialValue = deepMerge(startValue, stored);
			}
		} catch (e) {
			console.error('Failed to parse or merge config from localStorage', e);
			initialValue = startValue;
		}
	}

	const store = writable<Config>(initialValue);

	if (isBrowser) {
		store.subscribe((value) => {
			localStorage.setItem(key, JSON.stringify(value));
		});
	}

	return store;
}

export const configStore = createPersistentStore('toolkit-config', defaultConfig);
