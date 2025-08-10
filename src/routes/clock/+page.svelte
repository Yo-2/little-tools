<script lang="ts">
	import Clock from '$lib/components/Clock.svelte';
	import { configStore } from '$lib/configStore';
	import { onMount } from 'svelte';

	let { data } = $props();
	let clockProps = {};

	// We get the config from the URL via the root layout's load function.
	// We also need the full config from the store to ensure defaults are applied.
	onMount(() => {
		const general = { ...$configStore.general, ...data.configFromUrl.general };
		const component = { ...$configStore.components.clock, ...data.configFromUrl.components.clock };
		clockProps = { ...general, ...component };
	});
</script>

<div class="container">
	<Clock {...clockProps} />
</div>

<style>
	.container {
		width: 100vw;
		height: 100vh;
	}
</style>
