<script lang="ts">
	// Import all font definitions.
	// This makes the @font-face rules available globally, but the browser
	// will only download the actual font file when it's used in a component.
	import '$lib/fonts.ts';

	let { children } = $props();
</script>

{@render children?.()}
