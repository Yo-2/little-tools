<script lang="ts">
	import LadderGame from '$lib/components/LadderGame.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import LadderSettings from '$lib/components/LadderSettings.svelte';

	let isSidebarOpen = $state(false);
</script>

<div class="page-container">
	<header>
		<h1>Ladder Game</h1>
		<button class="settings-button" onclick={() => (isSidebarOpen = true)}>
			Settings
		</button>
	</header>

	<main>
		<LadderGame />
	</main>

	<Sidebar isOpen={isSidebarOpen} close={() => (isSidebarOpen = false)}>
		<LadderSettings />
	</Sidebar>
</div>

<style>
	.page-container {
		display: flex;
		flex-direction: column;
		height: 100vh;
		width: 100vw;
	}
	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.5rem 1rem;
		border-bottom: 1px solid #eee;
		flex-shrink: 0;
	}
	h1 {
		margin: 0;
		font-size: 1.5rem;
	}
	main {
		flex-grow: 1;
		overflow: auto; /* To contain the game */
	}
</style>
