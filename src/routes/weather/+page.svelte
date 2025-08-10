<script lang="ts">
	import WeatherWidget from '$lib/components/WeatherWidget.svelte';
	import { configStore } from '$lib/configStore';
	import { onMount } from 'svelte';

	let { data } = $props();
	let props = {};

	onMount(() => {
		const general = { ...$configStore.general, ...data.configFromUrl.general };
		const component = {
			...$configStore.components.weather,
			...data.configFromUrl.components.weather
		};
		props = {
			...general,
			...component,
			location: component.weatherLocation,
			apiKey: component.weatherApiKey
		};
	});
</script>

<div class="container">
	<WeatherWidget {...props} />
</div>

<style>
	.container {
		display: grid;
		place-items: center;
		width: 100vw;
		height: 100vh;
	}
</style>
