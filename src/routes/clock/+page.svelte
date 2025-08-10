<script lang="ts">
	import Clock from '$lib/components/Clock.svelte';
	let { data } = $props();

	const clockProps = Object.fromEntries(Object.entries(data).filter(([, value]) => value !== null));
</script>

<Clock {...clockProps} />
