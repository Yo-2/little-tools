<script lang="ts">
	let { isOpen, close } = $props();
</script>

{#if isOpen}
	<div class="sidebar-overlay" onclick={close}>
		<div class="sidebar-content" onclick={(e) => e.stopPropagation()}>
			<button class="close-button" onclick={close}>&times;</button>
			<slot />
		</div>
	</div>
{/if}

<style>
	.sidebar-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 1000;
		display: flex;
		justify-content: flex-end;
	}
	.sidebar-content {
		width: 100%;
		max-width: 400px;
		height: 100%;
		background-color: white;
		padding: 2rem;
		overflow-y: auto;
		box-shadow: -2px 0 8px rgba(0, 0, 0, 0.2);
		position: relative;
	}
	.close-button {
		position: absolute;
		top: 1rem;
		right: 1rem;
		font-size: 1.5rem;
		background: none;
		border: none;
		cursor: pointer;
	}
</style>
