<script lang="ts">
	let {
		hours = 0,
		minutes = 0,
		seconds = 0,
		textColor = '#000000'
	} = $props<{
		hours: number;
		minutes: number;
		seconds: number;
		textColor: string;
	}>();

	// Formulas for clock hand rotation
	// 360 / 12 = 30 degrees per hour
	// 360 / 60 = 6 degrees per minute
	// 360 / 60 = 6 degrees per second
	// Hour hand also moves with minutes: 30 / 60 = 0.5 degrees per minute
	const secondDeg = $derived(seconds * 6);
	const minuteDeg = $derived(minutes * 6 + seconds * 0.1);
	const hourDeg = $derived(hours * 30 + minutes * 0.5);
</script>

<div class="analog-clock">
	<svg viewBox="0 0 200 200" width="100%" height="100%">
		<!-- Clock Face -->
		<circle cx="100" cy="100" r="98" fill="none" stroke={textColor} stroke-width="4" />

		<!-- Hour and Minute Markers -->
		{#each Array(12) as _, i}
			<line
				x1="100"
				y1="10"
				x2="100"
				y2="20"
				stroke={textColor}
				stroke-width="4"
				transform="rotate({i * 30} 100 100)"
			/>
		{/each}
		{#each Array(60) as _, i}
			<line
				x1="100"
				y1="10"
				x2="100"
				y2="15"
				stroke={textColor}
				stroke-width="2"
				transform="rotate({i * 6} 100 100)"
			/>
		{/each}

		<!-- Hands -->
		<g transform="translate(100, 100)">
			<!-- Hour Hand -->
			<line
				x1="0"
				y1="0"
				x2="0"
				y2="-50"
				stroke={textColor}
				stroke-width="6"
				stroke-linecap="round"
				transform="rotate({hourDeg})"
			/>
			<!-- Minute Hand -->
			<line
				x1="0"
				y1="0"
				x2="0"
				y2="-80"
				stroke={textColor}
				stroke-width="4"
				stroke-linecap="round"
				transform="rotate({minuteDeg})"
			/>
			<!-- Second Hand -->
			<line
				x1="0"
				y1="0"
				x2="0"
				y2="-90"
				stroke="red"
				stroke-width="2"
				stroke-linecap="round"
				transform="rotate({secondDeg})"
			/>
			<!-- Center Dot -->
			<circle cx="0" cy="0" r="5" fill={textColor} />
		</g>
	</svg>
</div>

<style>
	.analog-clock {
		width: 100%;
		height: 100%;
	}
</style>
