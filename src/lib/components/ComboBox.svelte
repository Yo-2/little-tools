<script lang="ts">
	let { value = $bindable(''), options = [], placeholder = '' } = $props();
</script>

<div class="combobox">
	<input type="text" bind:value {placeholder} list="combobox-options" />
	<datalist id="combobox-options">
		{#each options as option}
			<option value={option}></option>
		{/each}
	</datalist>
</div>

<style>
	.combobox {
		width: 100%;
	}
	input {
		width: 100%;
		padding: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		box-sizing: border-box;
	}
</style>
