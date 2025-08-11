<script lang="ts">
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	const activeTab = getContext<Writable<number>>('activeTab');
	let { index = 0, children } = $props();
</script>

{#if $activeTab === index}
	<div class="tab-panel">
		{@render children()}
	</div>
{/if}
