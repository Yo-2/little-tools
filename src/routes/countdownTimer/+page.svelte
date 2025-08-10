<script lang="ts">
	import CountdownTimer from '$lib/components/CountdownTimer.svelte';
	let { data } = $props();

	const countdownProps = Object.fromEntries(
		Object.entries(data).filter(([, value]) => value !== null)
	);
</script>

<div class="container">
	<CountdownTimer {...countdownProps} />
</div>

<style>
	.container {
		width: 100vw;
		height: 100vh;
	}
</style>
