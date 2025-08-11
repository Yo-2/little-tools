<script lang="ts">
	import { writable } from 'svelte/store';
	import { setContext } from 'svelte';

	const activeTab = writable(0);
	setContext('activeTab', activeTab);

	let { titles = [], children } = $props();
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
		{@render children()}
	</div>
</div>

<style>
	.tab-buttons {
		display: flex;
		border-bottom: 1px solid #ccc;
		overflow-x: auto;
		white-space: nowrap;
		scrollbar-width: none; /* For Firefox */
	}
	.tab-buttons::-webkit-scrollbar {
		display: none; /* For Chrome, Safari, and Opera */
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
