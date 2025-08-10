<script lang="ts">
	import SpinningWheel from '$lib/components/SpinningWheel.svelte';
	import { configStore } from '$lib/configStore';
	import { onMount } from 'svelte';

	let { data } = $props();
	let props = {};

	onMount(() => {
		const general = { ...$configStore.general, ...data.configFromUrl.general };
		const component = {
			...$configStore.components.spinningWheel,
			...data.configFromUrl.components.spinningWheel
		};
		props = {
			...general,
			...component,
			items: component.spinningWheelItems.split('\n').filter((i) => i.trim() !== '')
		};
	});
</script>

<div class="container">
	<SpinningWheel {...props} />
</div>

<style>
	.container {
		display: grid;
		place-items: center;
		width: 100vw;
		height: 100vh;
	}
</style>
