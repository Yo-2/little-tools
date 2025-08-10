<script lang="ts">
	import CountdownTimer from '$lib/components/CountdownTimer.svelte';
	import { configStore } from '$lib/configStore';
	import { onMount } from 'svelte';

	let { data } = $props();
	let props = {};

	onMount(() => {
		const general = { ...$configStore.general, ...data.configFromUrl.general };
		const component = {
			...$configStore.components.countdownTimer,
			...data.configFromUrl.components.countdownTimer
		};
		props = { ...general, ...component };
	});
</script>

<div class="container">
	<CountdownTimer {...props} />
</div>

<style>
	.container {
		width: 100vw;
		height: 100vh;
	}
</style>
