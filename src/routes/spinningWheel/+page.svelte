<script lang="ts">
	import SpinningWheel from '$lib/components/SpinningWheel.svelte';
	let { data } = $props();
</script>

<div class="container">
	<SpinningWheel {...data} />
</div>

<style>
	.container {
		display: grid;
		place-items: center;
		width: 100vw;
		height: 100vh;
	}
</style>
