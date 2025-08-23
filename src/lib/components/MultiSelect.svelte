<script lang="ts">
	import type { FontCategory, Font } from '$lib/fonts';

	let {
		value = $bindable(''),
		placeholder = 'Search available fonts...',
		options = [] as FontCategory[]
	} = $props();

	let inputValue = $state('');
	let showDropdown = $state(false);

	let items = $derived(
		value
			? value
					.split(',')
					.map((item) => item.trim())
					.filter(Boolean)
			: []
	);

	const filteredCategories: FontCategory[] = $derived(
		inputValue
			? options
					.map((category) => ({
						...category,
						fonts: category.fonts.filter((font) =>
							font.label.toLowerCase().includes(inputValue.toLowerCase())
						)
					}))
					.filter((category) => category.fonts.length > 0)
			: options
	);

	let draggedItem: string | null = null;

	function addItem(font: Font) {
		if (font.value && !items.includes(font.value)) {
			const newItems = [...items, font.value];
			value = newItems.join(', ');
		}
		inputValue = '';
		showDropdown = false;
	}

	function removeItem(itemToRemove: string) {
		const newItems = items.filter((item) => item !== itemToRemove);
		value = newItems.join(', ');
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			event.preventDefault();
			const firstMatch = filteredCategories[0]?.fonts[0];
			if (firstMatch) {
				addItem(firstMatch);
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

<div
	class="multi-select"
	role="combobox"
	aria-haspopup="listbox"
	aria-expanded={showDropdown}
	aria-controls="font-dropdown"
>
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
			onkeydown={handleKeydown}
			onfocus={() => (showDropdown = true)}
			onblur={() => setTimeout(() => (showDropdown = false), 150)}
			{placeholder}
			aria-autocomplete="list"
		/>
		{#if showDropdown && filteredCategories.length > 0}
			<div class="dropdown" role="listbox" id="font-dropdown">
				{#each filteredCategories as category (category.name)}
					<div class="category">
						<div class="category-name" role="presentation">{category.name}</div>
						{#each category.fonts as font (font.value)}
							<div
								class="option"
								role="option"
								aria-selected="false"
								tabindex="0"
								onmousedown={() => addItem(font)}
								onkeydown={(e) => e.key === 'Enter' && addItem(font)}
							>
								{font.label}
							</div>
						{/each}
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	.multi-select {
		position: relative;
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
	.dropdown {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		background-color: white;
		border: 1px solid #ccc;
		border-top: none;
		border-radius: 0 0 4px 4px;
		max-height: 300px;
		overflow-y: auto;
		z-index: 1000;
	}
	.category {
		padding: 0.5rem;
	}
	.category-name {
		font-weight: bold;
		font-size: 0.9em;
		color: #555;
		padding: 0.5rem 0.25rem;
		border-bottom: 1px solid #eee;
	}
	.option {
		padding: 0.5rem;
		cursor: pointer;
	}
	.option:hover {
		background-color: #f0f0f0;
	}
</style>
