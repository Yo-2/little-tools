<script lang="ts">
	import CountdownTimer from '$lib/components/CountdownTimer.svelte';
	let { data } = $props();

	const countdownProps = Object.fromEntries(
		Object.entries(data).filter(([, value]) => value !== null)
	);
</script>

<CountdownTimer {...countdownProps} />
