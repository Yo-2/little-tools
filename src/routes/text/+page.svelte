<script lang="ts">
	import Text from '$lib/components/Text.svelte';
	import { configStore } from '$lib/configStore';
	import { onMount } from 'svelte';

	let { data } = $props();
	let props = {};

	onMount(() => {
		const general = { ...$configStore.general, ...data.configFromUrl.general };
		const component = {
			...$configStore.components.text,
			...data.configFromUrl.components.text
		};
		props = { ...general, ...component };
	});
</script>

<div class="container">
	<Text {...props} />
</div>

<style>
	.container {
		width: 100vw;
		height: 100vh;
	}
</style>
