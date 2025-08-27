<script lang="ts">
	import WeatherWidget from '$lib/components/WeatherWidget.svelte';
	let { data } = $props();
</script>

<div class="container">
	<WeatherWidget {...data} />
</div>

<style>
	.container {
		display: grid;
		place-items: center;
		width: 100vw;
		height: 100vh;
	}
</style>
