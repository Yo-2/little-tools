<script lang="ts">
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	const activeTab = getContext<Writable<number>>('activeTab');
	let { index = 0 } = $props<{ index: number }>();
</script>

{#if $activeTab === index}
	<div class="tab-panel">
		<slot />
	</div>
{/if}
