<script lang="ts">
	import type { Config } from '$lib/configStore';

	// Props for the wheel segments and colors
	let {
		items = ['Prize 1', 'Prize 2', 'Prize 3', 'Prize 4', 'Prize 5', 'Prize 6'],
		colors = ['#FFDDC1', '#FFABAB', '#FFC3A0', '#FF677D', '#D4A5A5', '#392F5A'],
		// General styles
		fontFamily = 'sans-serif',
		fontSize = '1.5rem',
		fontWeight = 'normal',
		textColor = '#000000',
		bgColorHex = 'rgba(0,0,0,0)',
		// Override logic
		spinningWheelOverrideGeneralStyle = false,
		spinningWheelStyleOptions = {} as Config['spinningWheelStyleOptions']
	} = $props();

	let spinning = $state(false);
	let result = $state<string | null>(null);
	let rotation = $state(0);

	const numSegments = items.length;
	const anglePerSegment = 360 / numSegments;

	function getCoordinatesForPercent(percent: number) {
		const x = Math.cos(2 * Math.PI * percent);
		const y = Math.sin(2 * Math.PI * percent);
		return [x, y];
	}

	function spin() {
		if (spinning) return;

		spinning = true;
		result = null;

		const spinAngle = Math.floor(Math.random() * 360);
		const fullSpins = 10; // Spin at least 10 times
		const spinAmount = fullSpins * 360 + spinAngle;

		const newRotation = rotation + spinAmount;
		rotation = newRotation;

		setTimeout(() => {
			spinning = false;
			const finalAngle = newRotation % 360;
			const winningIndex = Math.floor((360 - finalAngle) / anglePerSegment) % numSegments;
			result = items[winningIndex];
		}, 4000); // Corresponds to the CSS transition duration
	}

	const effectiveStyles = $derived(
		spinningWheelOverrideGeneralStyle
			? spinningWheelStyleOptions
			: { fontFamily, fontSize, fontWeight, textColor, bgColorHex }
	);
</script>

<div
	class="wheel-container"
	style:background-color={effectiveStyles.bgColorHex}
	style:color={effectiveStyles.textColor}
>
	<div class="wheel-wrapper">
		<div class="wheel" style:transform="rotate({rotation}deg)">
			<svg viewBox="-1 -1 2 2" style="transform: rotate(-90deg)">
				{#each items as item, i}
					{@const [x, y] = getCoordinatesForPercent(i / numSegments)}
					{@const [x2, y2] = getCoordinatesForPercent((i + 1) / numSegments)}
					<path d="M 0,0 L {x},{y} A 1,1 0 0,1 {x2},{y2} Z" fill={colors[i % colors.length]} />
					{@const [textX, textY] = getCoordinatesForPercent((i + 0.5) / numSegments)}
					<text
						x={textX * 0.6}
						y={textY * 0.6}
						font-size="0.1"
						fill={effectiveStyles.textColor}
						font-family={effectiveStyles.fontFamily}
						font-weight={effectiveStyles.fontWeight}
						text-anchor="middle"
						alignment-baseline="middle"
						transform="rotate({(i + 0.5) * anglePerSegment + 90}, {textX * 0.6}, {textY * 0.6})"
					>
						{item}
					</text>
				{/each}
			</svg>
		</div>
		<div class="pointer"></div>
	</div>
	<button class="spin-button" onclick={spin} disabled={spinning}>
		{#if spinning}Spinning...{:else}Spin{/if}
	</button>
	{#if result}
		<div
			class="result"
			style:font-family={effectiveStyles.fontFamily}
			style:font-size={effectiveStyles.fontSize}
			style:font-weight={effectiveStyles.fontWeight}
		>
			Result: <strong>{result}</strong>
		</div>
	{/if}
</div>

<style>
	.wheel-container {
		display: grid;
		place-items: center;
		gap: 2rem;
		padding: 2rem;
		position: relative;
		width: 100%;
		height: 100%;
	}
	.wheel-wrapper {
		position: relative;
		width: 300px;
		height: 300px;
	}
	.wheel {
		width: 100%;
		height: 100%;
		border-radius: 50%;
		overflow: hidden;
		transition: transform 4s cubic-bezier(0.25, 0.1, 0.25, 1);
	}
	.wheel svg {
		width: 100%;
		height: 100%;
	}
	.pointer {
		width: 0;
		height: 0;
		border-left: 15px solid transparent;
		border-right: 15px solid transparent;
		border-top: 30px solid #e74c3c;
		position: absolute;
		top: 0;
		left: 50%;
		transform: translate(-50%, -100%);
		z-index: 10;
	}
	.spin-button {
		padding: 1rem 2rem;
		font-size: 1.5rem;
		cursor: pointer;
		border-radius: 8px;
		border: none;
		background-color: #3498db;
		color: white;
	}
	.spin-button:disabled {
		background-color: #bdc3c7;
	}
	.result {
		font-size: 1.5rem;
		margin-top: 1rem;
	}
</style>
