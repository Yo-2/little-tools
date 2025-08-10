<script lang="ts">
	let { selectedFonts = $bindable() } = $props<{ selectedFonts: string[] }>();

	// This list should be consistent with the one in +page.svelte.
	// In a larger app, this would come from a shared module.
	const availableFonts = [
		'sans-serif',
		'serif',
		'monospace',
		'cursive',
		'fantasy',
		'Arial',
		'Verdana',
		'Tahoma',
		'Trebuchet MS',
		'Times New Roman',
		'Georgia',
		'Courier New',
		'Roboto'
	];
</script>

<div class="font-family-selector">
	{#each availableFonts as font}
		<label class="font-option">
			<input type="checkbox" value={font} bind:group={selectedFonts} />
			<span style:font-family={font}>{font}</span>
		</label>
	{/each}
</div>

<style>
	.font-family-selector {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		max-height: 200px;
		overflow-y: auto;
		border: 1px solid #ccc;
		padding: 0.5rem;
		border-radius: 4px;
	}
	.font-option {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.9rem; /* Smaller font for the options */
	}
	.font-option input {
		width: auto;
	}
</style>
