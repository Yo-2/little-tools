<script lang="ts">
	import LadderGame from '$lib/components/LadderGame.svelte';
	import { configStore } from '$lib/configStore';
	import { onMount } from 'svelte';

	let { data } = $props();
	let props = {};

	onMount(() => {
		const general = { ...$configStore.general, ...data.configFromUrl.general };
		const component = {
			...$configStore.components.ladderGame,
			...data.configFromUrl.components.ladderGame
		};
		props = {
			...general,
			...component,
			players: component.ladderPlayers.split('\n'),
			results: component.ladderResults.split('\n')
		};
	});
</script>

<div class="container">
	<h1>Ladder Game</h1>
	<LadderGame {...props} />
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 2rem;
	}
</style>
