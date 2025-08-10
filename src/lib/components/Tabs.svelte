<script lang="ts">
	import { writable } from 'svelte/store';
	import { setContext } from 'svelte';

	const activeTab = writable(0);
	setContext('activeTab', activeTab);

	let { titles = [] } = $props<{ titles: string[] }>();
</script>

<div class="tabs">
	<div class="tab-buttons">
		{#each titles as title, i}
			<button class:active={$activeTab === i} onclick={() => ($activeTab = i)}>
				{title}
			</button>
		{/each}
	</div>
	<div class="tab-content">
		<slot />
	</div>
</div>

<style>
	.tab-buttons {
		display: flex;
		border-bottom: 1px solid #ccc;
		overflow-x: auto;
		white-space: nowrap;
	}
	.tab-buttons::-webkit-scrollbar {
		height: 5px;
	}
	.tab-buttons::-webkit-scrollbar-track {
		background: #f1f1f1;
	}
	.tab-buttons::-webkit-scrollbar-thumb {
		background: #888;
		border-radius: 5px;
	}
	.tab-buttons::-webkit-scrollbar-thumb:hover {
		background: #555;
	}
	.tab-buttons button {
		padding: 10px 15px;
		cursor: pointer;
		border: none;
		background: none;
		font-size: 1em;
		border-bottom: 2px solid transparent;
	}
	.tab-buttons button.active {
		border-bottom-color: #0070f3;
		font-weight: bold;
	}
	.tab-content {
		padding-top: 1rem;
	}
</style>
