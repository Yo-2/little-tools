<script lang="ts">
	let {
		value = $bindable(''),
		placeholder = 'Add a font and press Enter...',
		options = []
	} = $props();
	let inputValue = $state('');
	let items = $derived(value ? value.split(',').map((item) => item.trim()) : []);

	function addItem() {
		if (inputValue && !items.includes(inputValue)) {
			const newItems = [...items, inputValue];
			value = newItems.join(', ');
			inputValue = '';
		}
	}

	function removeItem(itemToRemove: string) {
		const newItems = items.filter((item) => item !== itemToRemove);
		value = newItems.join(', ');
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			event.preventDefault();
			addItem();
		}
	}
</script>

<div class="multi-select">
	<div class="items">
		{#each items as item}
			<div class="item">
				{item}
				<button class="remove-btn" onclick={() => removeItem(item)}>x</button>
			</div>
		{/each}
	</div>
	<input
		type="text"
		bind:value={inputValue}
		onkeydown={handleKeydown}
		onblur={addItem}
		{placeholder}
		list="font-family-options"
	/>
	<datalist id="font-family-options">
		{#each options as option}
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
</style>
