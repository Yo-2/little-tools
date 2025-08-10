<script lang="ts">
	import LadderGame from '$lib/components/LadderGame.svelte';
	let { data } = $props();
</script>

<div class="container">
	<h1>Ladder Game</h1>
	<LadderGame players={data.players} results={data.results} />
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 2rem;
	}
</style>
