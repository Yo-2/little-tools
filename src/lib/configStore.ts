import { writable, type Writable } from 'svelte/store';
import { browser } from '$app/environment';

export interface Config {
	fontFamily: string;
	fontSize: string;
	fontWeight: string;
	textColor: string;
	bgColor: string; // Not used directly, but kept for consistency
	bgColorHex: string;

	// Countdown Timer specific
	hours: number;
	minutes: number;
	seconds: number;
	timeupText: string;

	// Text specific
	text: string;
}

const defaultConfig: Config = {
	fontFamily: 'sans-serif',
	fontSize: '2rem',
	fontWeight: 'normal',
	textColor: '#000000',
	bgColor: 'rgba(255, 255, 255, 1)',
	bgColorHex: '#ffffff',

	hours: 0,
	minutes: 5,
	seconds: 0,
	timeupText: "Time's up!",

	text: 'Sample Text'
};

function createPersistentStore<T>(key: string, startValue: T): Writable<T> {
	const isBrowser = typeof window !== 'undefined' && browser;
	const storedValue = isBrowser ? localStorage.getItem(key) : null;
	const initialValue = storedValue ? JSON.parse(storedValue) : startValue;

	const store = writable<T>(initialValue);

	if (isBrowser) {
		store.subscribe((value) => {
			localStorage.setItem(key, JSON.stringify(value));
		});
	}

	return store;
}

export const configStore = createPersistentStore<Config>('toolkit-config', defaultConfig);
