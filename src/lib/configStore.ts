import { writable, type Writable } from 'svelte/store';
import { browser } from '$app/environment';

export interface Config {
	fontFamily: string;
	fontSize: string;
	fontWeight: string;
	textColor: string;
	bgColorHex: string;

	// Countdown Timer specific
	hours: number;
	minutes: number;
	seconds: number;
	timeupText: string;

	// Text specific
	text: string;

	// Spinning Wheel specific
	spinningWheelItems: string;

	// Weather Widget specific
	weatherLocation: string;
	weatherApiKey: string;

	// Ladder Game specific
	ladderPlayers: string;
	ladderResults: string;
	ladderAnimationSpeed: number;
	ladderLineColor: string;
	ladderRungColor: string;
	ladderLineThickness: number;
	ladderIsObfuscated: boolean;
	ladderIsManualMode: boolean;
}

const defaultConfig: Config = {
	fontFamily: 'sans-serif',
	fontSize: '2rem',
	fontWeight: 'normal',
	textColor: '#000000',
	bgColorHex: '#ffffff',

	hours: 0,
	minutes: 5,
	seconds: 0,
	timeupText: "Time's up!",

	text: 'Sample Text',

	spinningWheelItems: 'Prize 1\nPrize 2\nPrize 3\nPrize 4\nPrize 5\nPrize 6',

	weatherLocation: 'London',
	weatherApiKey: '',

	ladderPlayers: 'Player 1\nPlayer 2\nPlayer 3\nPlayer 4',
	ladderResults: 'Prize A\nPrize B\nPrize C\nPrize D',
	ladderAnimationSpeed: 2,
	ladderLineColor: '#000000',
	ladderRungColor: '#A52A2A',
	ladderLineThickness: 2,
	ladderIsObfuscated: false,
	ladderIsManualMode: false
};

function createPersistentStore<T>(key: string, startValue: T): Writable<T> {
	const isBrowser = typeof window !== 'undefined' && browser;
	const storedValue = isBrowser ? localStorage.getItem(key) : null;

	// Merge stored value with defaults to prevent errors on new properties
	const stored = storedValue ? JSON.parse(storedValue) : {};
	const initialValue = { ...startValue, ...stored };

	const store = writable<T>(initialValue);

	if (isBrowser) {
		store.subscribe((value) => {
			localStorage.setItem(key, JSON.stringify(value));
		});
	}

	return store;
}

export const configStore = createPersistentStore<Config>('toolkit-config', defaultConfig);
