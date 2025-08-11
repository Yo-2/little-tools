<script lang="ts">
	import LadderGame from '$lib/components/LadderGame.svelte';
</script>

<div class="container">
	<h1>Ladder Game</h1>
	<LadderGame showSidebarToggle={true} />
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 2rem;
	}
</style>
