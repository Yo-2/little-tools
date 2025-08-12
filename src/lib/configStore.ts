import { writable, type Writable, get } from 'svelte/store';
import { browser } from '$app/environment';

export interface LadderStyleOptions {
	fontFamily: string;
	fontSize: number;
	fontWeight: string;
	textColor: string;
	backgroundColor: string;
	lineColor: string;
	rungColor: string;
	lineThickness: number;
}

export interface ToolStyleOptions {
	fontFamily: string;
	fontSize: string;
	fontWeight: string;
	textColor: string;
	bgColorHex: string;
}

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
	timerOverrideGeneralStyle: boolean;
	timerStyleOptions: ToolStyleOptions;

	// Text specific
	text: string;
	textOverrideGeneralStyle: boolean;
	textStyleOptions: ToolStyleOptions;

	// Spinning Wheel specific
	spinningWheelItems: string;
	spinningWheelOverrideGeneralStyle: boolean;
	spinningWheelStyleOptions: ToolStyleOptions;

	// Weather Widget specific
	weatherLocation: string;
	weatherApiKey: string;
	weatherOverrideGeneralStyle: boolean;
	weatherStyleOptions: ToolStyleOptions;

	// Ladder Game specific
	ladderPlayers: string;
	ladderResults: string;
	ladderAnimationSpeed: number;
	ladderIsManualMode: boolean;
	ladderOverrideGeneralStyle: boolean;
	ladderStyleOptions: LadderStyleOptions;
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
	timerOverrideGeneralStyle: false,
	timerStyleOptions: {
		fontFamily: 'sans-serif',
		fontSize: '2rem',
		fontWeight: 'normal',
		textColor: '#000000',
		bgColorHex: '#ffffff'
	},

	text: 'Sample Text',
	textOverrideGeneralStyle: false,
	textStyleOptions: {
		fontFamily: 'sans-serif',
		fontSize: '2rem',
		fontWeight: 'normal',
		textColor: '#000000',
		bgColorHex: '#ffffff'
	},

	spinningWheelItems: 'Prize 1\nPrize 2\nPrize 3\nPrize 4\nPrize 5\nPrize 6',
	spinningWheelOverrideGeneralStyle: false,
	spinningWheelStyleOptions: {
		fontFamily: 'sans-serif',
		fontSize: '1rem',
		fontWeight: 'bold',
		textColor: '#000000',
		bgColorHex: '#ffffff'
	},

	weatherLocation: 'London',
	weatherApiKey: '',
	weatherOverrideGeneralStyle: false,
	weatherStyleOptions: {
		fontFamily: 'sans-serif',
		fontSize: '1rem',
		fontWeight: 'normal',
		textColor: '#000000',
		bgColorHex: '#ffffff'
	},

	ladderPlayers: 'Player 1\nPlayer 2\nPlayer 3\nPlayer 4',
	ladderResults: 'Prize A\nPrize B\nPrize C\nPrize D',
	ladderAnimationSpeed: 2,
	ladderIsManualMode: false,
	ladderOverrideGeneralStyle: false,
	ladderStyleOptions: {
		fontFamily: 'sans-serif',
		fontSize: 14,
		fontWeight: 'normal',
		textColor: '#333333',
		backgroundColor: '#ffffff',
		lineColor: '#000000',
		rungColor: '#A52A2A',
		lineThickness: 2
	}
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

// --- Profile Management ---
export const profilesStore = createPersistentStore<Record<string, Config>>('toolkit-profiles', {});
export const activeProfileNameStore = createPersistentStore<string | null>(
	'toolkit-active-profile-name',
	null
);

export function saveProfile(name: string) {
	const currentConfig = get(configStore);
	profilesStore.update((profiles) => {
		profiles[name] = currentConfig;
		return profiles;
	});
	activeProfileNameStore.set(name);
}

export function renameProfile(oldName: string, newName: string) {
	profilesStore.update((profiles) => {
		if (profiles[oldName] && !profiles[newName]) {
			profiles[newName] = profiles[oldName];
			delete profiles[oldName];
		}
		return profiles;
	});
	if (get(activeProfileNameStore) === oldName) {
		activeProfileNameStore.set(newName);
	}
}

export function deleteProfile(name: string) {
	profilesStore.update((profiles) => {
		delete profiles[name];
		return profiles;
	});
	if (get(activeProfileNameStore) === name) {
		activeProfileNameStore.set(null);
	}
}

export function loadProfile(name: string) {
	const profiles = get(profilesStore);
	const profileConfig = profiles[name];
	if (profileConfig) {
		// To prevent issues with missing properties on older profiles, merge with default
		const fullConfig = { ...defaultConfig, ...profileConfig };
		configStore.set(fullConfig);
		activeProfileNameStore.set(name);
	}
}
