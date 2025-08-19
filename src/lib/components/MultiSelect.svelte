<script lang="ts">
	import { configStore } from '$lib/configStore';

	let { value = $bindable(''), placeholder = 'Search Google Fonts...', options = [] } = $props();

	let inputValue = $state('');
	let items = $derived(
		value
			? value
					.split(',')
					.map((item) => item.trim())
					.filter(Boolean)
			: []
	);
	let fontList = $state<string[]>(options);
	let loading = $state(false);

	let draggedItem: string | null = null;

	async function searchFonts() {
		const apiKey = $configStore.googleFontsApiKey;
		if (!apiKey) {
			// Silently fail if no API key is provided
			fontList = options;
			return;
		}

		if (inputValue.length < 2) {
			fontList = options; // Show popular fonts if search is short
			return;
		}

		loading = true;
		try {
			// In a real scenario, you would proxy this request to hide the API key.
			const response = await fetch(
				`https://www.googleapis.com/webfonts/v1/webfonts?key=${apiKey}&sort=popularity`
			);
			if (!response.ok) {
				throw new Error('Failed to fetch font list');
			}
			const data: { items: { family: string }[] } = await response.json();
			const allFonts = data.items.map((font) => font.family);
			// Simple search filter
			fontList = allFonts.filter((font) => font.toLowerCase().includes(inputValue.toLowerCase()));
		} catch (error) {
			console.error('Error fetching Google Fonts:', error);
			fontList = options; // Fallback to popular fonts on error
		} finally {
			loading = false;
		}
	}

	function addItem(font: string) {
		if (font && !items.includes(font)) {
			const newItems = [...items, font];
			value = newItems.join(', ');
		}
		inputValue = '';
		fontList = options; // Reset to popular list
	}

	function removeItem(itemToRemove: string) {
		const newItems = items.filter((item) => item !== itemToRemove);
		value = newItems.join(', ');
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			event.preventDefault();
			// Find the best match from the current list and add it
			const bestMatch = fontList.find((f) => f.toLowerCase().startsWith(inputValue.toLowerCase()));
			if (bestMatch) {
				addItem(bestMatch);
			}
		}
	}

	function handleDragStart(item: string) {
		draggedItem = item;
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
	}

	function handleDrop(targetItem: string) {
		if (!draggedItem || draggedItem === targetItem) return;

		const fromIndex = items.indexOf(draggedItem);
		const toIndex = items.indexOf(targetItem);

		const newItems = [...items];
		newItems.splice(fromIndex, 1);
		newItems.splice(toIndex, 0, draggedItem);

		value = newItems.join(', ');
		draggedItem = null;
	}
</script>

<div class="multi-select">
	<div class="items" role="list">
		{#each items as item (item)}
			<div
				class="item"
				role="listitem"
				draggable="true"
				ondragstart={() => handleDragStart(item)}
				ondragover={handleDragOver}
				ondrop={() => handleDrop(item)}
			>
				<span class="drag-handle">::</span>
				{item}
				<button class="remove-btn" onclick={() => removeItem(item)}>x</button>
			</div>
		{/each}
	</div>
	<div class="input-wrapper">
		<input
			type="text"
			bind:value={inputValue}
			oninput={searchFonts}
			onkeydown={handleKeydown}
			{placeholder}
			list="font-family-options"
		/>
		{#if loading}
			<div class="spinner"></div>
		{/if}
	</div>
	<datalist id="font-family-options">
		{#each fontList as option}
			<option value={option}></option>
		{/each}
	</datalist>
</div>

<style>
	.multi-select {
		display: flex;
		flex-direction: column;
		border: 1px solid #ccc;
		border-radius: 4px;
		padding: 0.25rem;
	}
	.items {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem;
		margin-bottom: 0.25rem;
	}
	.item {
		background-color: #0070f3;
		color: white;
		border-radius: 3px;
		padding: 0.25rem 0.5rem;
		display: flex;
		align-items: center;
		font-size: 0.875em;
		cursor: grab;
	}
	.item:active {
		cursor: grabbing;
	}
	.drag-handle {
		margin-right: 0.5rem;
		cursor: grab;
	}
	.remove-btn {
		margin-left: 0.5rem;
		border: none;
		background: none;
		color: white;
		cursor: pointer;
		font-weight: bold;
		padding: 0;
	}
	input {
		border: none;
		padding: 0.25rem;
		width: 100%;
		box-sizing: border-box;
	}
	input:focus {
		outline: none;
	}
	.input-wrapper {
		position: relative;
		display: flex;
	}
	.spinner {
		border: 2px solid #f3f3f3;
		border-top: 2px solid #3498db;
		border-radius: 50%;
		width: 16px;
		height: 16px;
		animation: spin 1s linear infinite;
		position: absolute;
		right: 10px;
		top: 50%;
		transform: translateY(-50%);
	}
	@keyframes spin {
		0% {
			transform: translateY(-50%) rotate(0deg);
		}
		100% {
			transform: translateY(-50%) rotate(360deg);
		}
	}
</style>
