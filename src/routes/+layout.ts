import type { LayoutLoad } from './$types';
import { configStore, defaultConfig } from '$lib/configStore';
import { get } from 'svelte/store';

// This function runs on the server or in the browser before the page loads.
// It reads configuration from the URL and provides it to the page layout.
export const load: LayoutLoad = ({ url }) => {
	const configFromUrl: any = { general: {}, components: {} };

	// 1. Parse General settings from URL (e.g., ?fontFamily=Arial)
	for (const key in defaultConfig.general) {
		if (url.searchParams.has(key)) {
			configFromUrl.general[key] = url.searchParams.get(key);
		}
	}

	// 2. Parse Component-specific settings from URL (e.g., ?text_text=HelloWorld)
	for (const compKey in defaultConfig.components) {
		const componentDefaultConfig = defaultConfig.components[compKey as keyof typeof defaultConfig.components];
		const componentUrlConfig: any = {};

		for (const key in componentDefaultConfig) {
			const urlKey = `${compKey}_${key}`;
			if (url.searchParams.has(urlKey)) {
				let value: any = url.searchParams.get(urlKey);
				const defaultValue = componentDefaultConfig[key as keyof typeof componentDefaultConfig];

				// Attempt to parse numbers and booleans from string params
				if (typeof defaultValue === 'number') {
					const parsed = parseFloat(value);
					if (!isNaN(parsed)) value = parsed;
				} else if (typeof defaultValue === 'boolean') {
					value = value === 'true';
				}
				componentUrlConfig[key] = value;
			}
		}
		if (Object.keys(componentUrlConfig).length > 0) {
			configFromUrl.components[compKey] = componentUrlConfig;
		}
	}

    // 3. The returned object will be available in `data.configFromUrl` in +layout.svelte
	return {
		configFromUrl
	};
};
