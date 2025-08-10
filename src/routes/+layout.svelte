<script lang="ts">
	import '../app.css';
	import { configStore, type Config } from '$lib/configStore';
	import { browser } from '$app/environment';
	import { base } from '$app/paths';

	let { data } = $props();

	// A helper to deep merge objects, as the one in configStore is not exported.
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
				} else if (source[sourceKey] !== undefined) {
					output[sourceKey] = source[sourceKey] as T[keyof T];
				}
			});
		}
		return output;
	}

	// 1. When the layout loads, update the store with data from the URL.
	// This ensures that when a user navigates to a URL with params, the config reflects it.
	if (browser) {
		const newConfig = deepMerge($configStore, data.configFromUrl);
		configStore.set(newConfig);
	}

	// 2. When the config store changes, update the URL.
	// This ensures that when a user changes a setting, the URL is updated.
	$effect(() => {
		if (browser) {
			const config = $configStore;
			const url = new URL(window.location.href);
			const params = url.searchParams;

			// Flatten the config to URL params, matching the logic in +page.svelte
			for (const [key, value] of Object.entries(config.general)) {
				params.set(key, String(value));
			}
			for (const compKey of Object.keys(config.components)) {
				const compConfig = config.components[compKey as keyof typeof config.components];
				for (const [key, value] of Object.entries(compConfig)) {
					const urlKey = `${compKey}_${key}`;
					if (value !== null && value !== undefined && value !== '') {
						params.set(urlKey, String(value));
					} else {
						// Clean up empty params
						params.delete(urlKey);
					}
				}
			}

			// Update the URL without reloading the page.
			const newUrl = `${window.location.pathname}?${params.toString()}`;
			history.replaceState(history.state, '', newUrl);
		}
	});
</script>

<slot />
