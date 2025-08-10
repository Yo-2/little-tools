<script lang="ts">
	import Text from '$lib/components/Text.svelte';
	let { data } = $props();

	const textProps = Object.fromEntries(Object.entries(data).filter(([, value]) => value !== null));
</script>

<Text {...textProps} />
