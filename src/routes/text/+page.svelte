<script lang="ts">
	import Text from '$lib/components/Text.svelte';
	let { data } = $props();

	const textProps = Object.fromEntries(Object.entries(data).filter(([, value]) => value !== null));
</script>

<div class="container">
	<Text {...textProps} />
</div>

<style>
	.container {
		width: 100vw;
		height: 100vh;
	}
</style>
