<script lang="ts">
	import { configStore } from '$lib/configStore';
	import { writable } from 'svelte/store';
	import { hexToRgba } from '$lib/colorUtils';

	// --- Props ---
	const { showSidebarToggle = false } = $props();

	// --- State ---
	let players: string[] = $state([]);
	let results: string[] = $state([]);
	let rungs = $state<[number, number][]>([]); // [ladderIndex, yPosition]
	let paths = $state<(string | undefined)[]>([]);
	let isAnimating = $state(false);
	let showPaths = $state(false);
	let winners = $state<Record<string, string>>({});
	let hoveredPathIndex = $state<number | null>(null);
	let resultToPlayerMap = $state<Record<number, number>>({}); // resultIndex -> playerIndex
	let allCalculatedPaths = $state<(string | undefined)[]>([]);
	let playerEditing = $state<boolean[]>([]);
	let resultEditing = $state<boolean[]>([]);
	let revealedWinners = $state<Record<string, string>>({});
	let visiblePaths = $state<Record<number, string>>({});
	let resultsToShow = $derived(Object.keys(winners).length > 0 ? winners : revealedWinners);
	let isSidebarOpen = $state(false);
	let isResultsCollapsed = $state(true);

	// --- Constants ---
	const LADDER_HEIGHT = 400;
	const LADDER_WIDTH = 100;

	// --- Component State ---
	let isManualMode = $state(false);
	let importJson = $state('');

	// --- Style Derivations ---
	const effectiveStylesStore = writable({
		fontFamily: 'sans-serif',
		fontSize: '14px',
		fontWeight: 'normal',
		textColor: '#333333',
		backgroundColor: '#ffffff',
		lineColor: '#000000',
		rungColor: '#A52A2A',
		lineThickness: 2
	});

	$effect(() => {
		if ($configStore.ladderOverrideGeneralStyle) {
			effectiveStylesStore.set({
				...$configStore.ladderStyleOptions,
				fontSize: `${$configStore.ladderStyleOptions.fontSize}px`,
				textColor: hexToRgba(
					$configStore.ladderStyleOptions.textColor,
					$configStore.ladderStyleOptions.textColorOpacity
				),
				backgroundColor: hexToRgba(
					$configStore.ladderStyleOptions.backgroundColor,
					$configStore.ladderStyleOptions.backgroundColorOpacity
				)
			});
		} else {
			effectiveStylesStore.set({
				fontFamily: $configStore.fontFamily,
				fontSize: $configStore.fontSize,
				fontWeight: $configStore.fontWeight,
				textColor: hexToRgba($configStore.textColor, $configStore.textColorOpacity),
				backgroundColor: hexToRgba($configStore.bgColorHex, $configStore.bgColorOpacity),
				lineColor: hexToRgba($configStore.textColor, $configStore.textColorOpacity),
				rungColor: '#A52A2A',
				lineThickness: 2
			});
		}
	});

	// --- Lifecycle ---
	$effect(() => {
		const newPlayers = $configStore.ladderPlayers
			.split('\n')
			.map((s) => s.trim())
			.filter(Boolean);
		let newResults = $configStore.ladderResults
			.split('\n')
			.map((s) => s.trim())
			.filter(Boolean);

		if (newPlayers.length > newResults.length) {
			const diff = newPlayers.length - newResults.length;
			for (let i = 0; i < diff; i++) {
				newResults.push(`Prize ${newResults.length + 1}`);
			}
		}

		players = newPlayers;
		results = newResults;
	});

	// Regenerate ladder ONLY when the players array reference changes.
	$effect(() => {
		const p = players; // establish dependency on players
		generateLadders();
	});

	// Sync editing state arrays when players/results change.
	$effect(() => {
		playerEditing = new Array(players.length).fill(false);
	});
	$effect(() => {
		resultEditing = new Array(results.length).fill(false);
	});

	// --- Functions ---
	function handleSvgKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			// This is a simplified handler to satisfy a11y.
			// A full implementation would require tracking a virtual cursor.
			event.preventDefault();
		}
	}

	function handleSvgClick(event: MouseEvent) {
		if (!isManualMode) return;

		const svgRect = (event.currentTarget as SVGSVGElement).getBoundingClientRect();
		const x = event.clientX - svgRect.left;
		const y = event.clientY - svgRect.top;

		const laneIndex = Math.floor(x / LADDER_WIDTH);
		if (laneIndex >= players.length - 1) return; // Clicked outside of lanes

		// Find the closest y-level to the click position
		const yLevels = Array.from({ length: 12 }, (_, i) => (LADDER_HEIGHT / (12 + 1)) * (i + 1));
		const closestY = yLevels.reduce((prev, curr) =>
			Math.abs(curr - y) < Math.abs(prev - y) ? curr : prev
		);

		const rungIndex = rungs.findIndex(([rLane, rY]) => rLane === laneIndex && rY === closestY);
		const isOccupied = rungIndex !== -1;
		const isPrevLaneOccupied = rungs.some(
			([rLane, rY]) => rLane === laneIndex - 1 && rY === closestY
		);
		const isNextLaneOccupied = rungs.some(
			([rLane, rY]) => rLane === laneIndex + 1 && rY === closestY
		);

		if (isOccupied) {
			// Rung exists, so remove it
			rungs = rungs.filter((_, index) => index !== rungIndex);
		} else if (!isPrevLaneOccupied && !isNextLaneOccupied) {
			// Rung doesn't exist and no adjacent rungs, so add it
			rungs = [...rungs, [laneIndex, closestY]];
		}
	}

	function generateLadders() {
		if (isManualMode) return;
		showPaths = false;
		winners = {};
		revealedWinners = {};
		paths = [];
		visiblePaths = {};
		isResultsCollapsed = true;
		const newRungs: [number, number][] = [];
		const numPlayers = players.length;
		if (numPlayers <= 1) {
			rungs = [];
			return;
		}

		const numLanes = numPlayers - 1;
		const minRungsPerLane = 2;
		// Define 12 discrete vertical levels for rung placement.
		const numLevels = 12;
		const yLevels = Array.from(
			{ length: numLevels },
			(_, i) => (LADDER_HEIGHT / (numLevels + 1)) * (i + 1)
		);

		// Keep track of where rungs are placed to avoid horizontal collisions.
		// Key: y-level, Value: Set of lanes where a rung exists.
		const occupied = new Map<number, Set<number>>();

		// Iterate through each lane to place the minimum required rungs.
		for (let laneIndex = 0; laneIndex < numLanes; laneIndex++) {
			const availableYLevels = [...yLevels];
			let placedCount = 0;

			// Shuffle levels to randomize rung placement.
			availableYLevels.sort(() => Math.random() - 0.5);

			for (const y of availableYLevels) {
				if (placedCount >= minRungsPerLane) break;

				// Check if the adjacent previous lane has a rung at the same y-level.
				const isPrevLaneOccupied = occupied.get(y)?.has(laneIndex - 1);
				if (!isPrevLaneOccupied) {
					// Add the rung
					if (!occupied.has(y)) {
						occupied.set(y, new Set());
					}
					occupied.get(y)!.add(laneIndex);
					newRungs.push([laneIndex, y]);
					placedCount++;
				}
			}
		}

		// Optional: Add a few more rungs for extra complexity, respecting the rules.
		const extraRungs = numLanes; // Add one extra rung per lane on average.
		for (let i = 0; i < extraRungs; i++) {
			const laneIndex = Math.floor(Math.random() * numLanes);
			const y = yLevels[Math.floor(Math.random() * yLevels.length)];

			// Check for collisions: cannot be occupied in the target lane OR adjacent lanes.
			const isOccupied = occupied.get(y)?.has(laneIndex);
			const isPrevLaneOccupied = occupied.get(y)?.has(laneIndex - 1);
			const isNextLaneOccupied = occupied.get(y)?.has(laneIndex + 1);

			if (!isOccupied && !isPrevLaneOccupied && !isNextLaneOccupied) {
				if (!occupied.has(y)) {
					occupied.set(y, new Set());
				}
				occupied.get(y)!.add(laneIndex);
				newRungs.push([laneIndex, y]);
			}
		}

		rungs = newRungs;
	}

	function clearResults() {
		showPaths = false;
		winners = {};
		revealedWinners = {};
		paths = [];
		visiblePaths = {};
		isResultsCollapsed = true;
		hoveredPathIndex = null;
	}

	function tracePath(startLadder: number) {
		let x = startLadder * LADDER_WIDTH + LADDER_WIDTH / 2;
		let y = 0;
		let path = `M ${x} ${y}`;
		let currentLadder = startLadder;

		while (y < LADDER_HEIGHT) {
			const nextRung = rungs
				.filter(([ladderIdx]) => ladderIdx === currentLadder || ladderIdx === currentLadder - 1)
				.map((rung) => ({ ladder: rung[0], y: rung[1] }))
				.filter((rung) => rung.y > y)
				.sort((a, b) => a.y - b.y)[0];

			if (nextRung) {
				// Move to the rung
				path += ` L ${x} ${nextRung.y}`;
				y = nextRung.y;

				// Cross the rung
				if (nextRung.ladder === currentLadder) {
					x += LADDER_WIDTH;
					currentLadder++;
				} else {
					x -= LADDER_WIDTH;
					currentLadder--;
				}
				path += ` L ${x} ${y}`;
			} else {
				// Go straight to the bottom
				y = LADDER_HEIGHT;
				path += ` L ${x} ${y}`;
			}
		}
		return { path, endLadder: currentLadder };
	}

	function calculateAllPaths() {
		winners = {};
		const newResultToPlayerMap: Record<number, number> = {};
		allCalculatedPaths = players.map((_, i) => {
			const { path, endLadder } = tracePath(i);
			winners[players[i]] = results[endLadder];
			newResultToPlayerMap[endLadder] = i;
			return path;
		});
		resultToPlayerMap = newResultToPlayerMap;
	}

	function startAnimation() {
		if (isAnimating) return;
		isAnimating = true;
		showPaths = true;
		calculateAllPaths();
		paths = allCalculatedPaths;

		setTimeout(() => {
			revealedWinners = { ...winners };
			const newVisiblePaths: Record<number, string> = {};
			allCalculatedPaths.forEach((path, i) => {
				if (path) newVisiblePaths[i] = path;
			});
			visiblePaths = newVisiblePaths;
			paths = []; // Clear animation paths
			isAnimating = false;
		}, $configStore.ladderAnimationSpeed * 1000);
	}

	function startSinglePath(playerIndex: number) {
		if (isAnimating || visiblePaths[playerIndex]) return;
		isAnimating = true;
		showPaths = true;
		calculateAllPaths();

		// Animate just the one path
		const newPaths: (string | undefined)[] = [];
		newPaths[playerIndex] = allCalculatedPaths[playerIndex];
		paths = newPaths;

		setTimeout(() => {
			// After animation, move the path to the permanent visiblePaths
			visiblePaths[playerIndex] = allCalculatedPaths[playerIndex] as string;
			revealedWinners[players[playerIndex]] = winners[players[playerIndex]];
			paths = []; // Clear the temporary animation path
			isAnimating = false;
		}, $configStore.ladderAnimationSpeed * 1000);
	}

	async function startAnimationSequentially() {
		if (isAnimating) return;
		isAnimating = true;
		showPaths = true;
		calculateAllPaths();

		for (let i = 0; i < players.length; i++) {
			if (visiblePaths[i]) {
				continue; // Skip already visible paths
			}

			// Animate the current path
			const newPaths: (string | undefined)[] = [];
			newPaths[i] = allCalculatedPaths[i];
			paths = newPaths;

			await new Promise((resolve) =>
				setTimeout(resolve, $configStore.ladderAnimationSpeed * 1000 + 100)
			);

			// After animation, move the path to the permanent visiblePaths and reveal the winner
			if (allCalculatedPaths[i]) {
				visiblePaths[i] = allCalculatedPaths[i] as string;
				revealedWinners[players[i]] = winners[players[i]];
			}
		}

		paths = []; // Clear the temporary animation path
		isAnimating = false;
	}
</script>

<div
	class="game-container"
	style="
		--player-count: {players.length};
		--svg-width: {players.length * LADDER_WIDTH}px;
		background-color: {$effectiveStylesStore.backgroundColor};
		font-family: {$effectiveStylesStore.fontFamily};
		font-size: {$effectiveStylesStore.fontSize};
		font-weight: {$effectiveStylesStore.fontWeight};
		color: {$effectiveStylesStore.textColor};
	"
>
	{#if showSidebarToggle}
		<button class="sidebar-toggle" onclick={() => (isSidebarOpen = !isSidebarOpen)}>⚙️</button>
	{/if}
	<div class="inputs">
		{#each players as player, i}
			<div
				class="player-input"
				role="button"
				tabindex="0"
				onmouseenter={() => {
					if (!isAnimating) hoveredPathIndex = i;
				}}
				onmouseleave={() => (hoveredPathIndex = null)}
			>
				<input
					type="text"
					bind:value={players[i]}
					readonly={!playerEditing[i]}
					ondblclick={() => (playerEditing[i] = true)}
					onblur={() => (playerEditing[i] = false)}
					onclick={(e) => {
						e.stopPropagation();
						startSinglePath(i);
					}}
				/>
			</div>
		{/each}
	</div>
	<div class="svg-container">
		<svg
			role="button"
			tabindex="0"
			aria-label="Ladder editor canvas"
			class="ladder-svg"
			class:manual-mode={isManualMode}
			viewBox={`0 0 ${players.length * LADDER_WIDTH} ${LADDER_HEIGHT + 50}`}
			preserveAspectRatio="xMidYMin meet"
			onclick={handleSvgClick}
			onkeydown={handleSvgKeyDown}
		>
			<!-- Ladders -->
			{#each players as player, i}
				<line
					data-player={player}
					x1={i * LADDER_WIDTH + LADDER_WIDTH / 2}
					y1="0"
					x2={i * LADDER_WIDTH + LADDER_WIDTH / 2}
					y2={LADDER_HEIGHT}
					stroke={$effectiveStylesStore.lineColor}
					stroke-width={$effectiveStylesStore.lineThickness}
				/>
			{/each}
			<!-- Rungs -->
			{#each rungs as [ladderIndex, y]}
				<line
					x1={ladderIndex * LADDER_WIDTH + LADDER_WIDTH / 2}
					y1={y}
					x2={(ladderIndex + 1) * LADDER_WIDTH + LADDER_WIDTH / 2}
					y2={y}
					stroke={$effectiveStylesStore.rungColor}
					stroke-width={$effectiveStylesStore.lineThickness}
				/>
			{/each}
			<!-- Paths -->
			{#if showPaths}
				{@const finalPaths = isAnimating ? paths : Object.values(visiblePaths)}
				{@const pathKeys = isAnimating
					? paths.map((_, i) => i)
					: Object.keys(visiblePaths).map(Number)}

				<!-- Render non-hovered paths first -->
				{#each pathKeys as i}
					{@const path = isAnimating ? paths[i] : visiblePaths[i]}
					{#if path && i !== hoveredPathIndex}
						<path
							d={path}
							stroke={[
								'rgba(255, 0, 0, 0.7)',
								'rgba(0, 0, 255, 0.7)',
								'rgba(0, 128, 0, 0.7)',
								'rgba(255, 165, 0, 0.7)'
							][i % 4]}
							stroke-width={3}
							fill="none"
							class:trace-path={isAnimating && paths[i]}
							style:opacity={hoveredPathIndex !== null ? 0.3 : 1}
							style:transition="all 0.2s"
							style:--animation-duration={$configStore.ladderAnimationSpeed + 's'}
						/>
					{/if}
				{/each}
				<!-- Render hovered path last so it's on top -->
				{#if hoveredPathIndex !== null}
					{@const i = hoveredPathIndex}
					{@const path = isAnimating ? paths[i] : visiblePaths[i]}
					{#if path}
						<path
							d={path}
							stroke={[
								'rgba(255, 0, 0, 0.7)',
								'rgba(0, 0, 255, 0.7)',
								'rgba(0, 128, 0, 0.7)',
								'rgba(255, 165, 0, 0.7)'
							][i % 4]}
							stroke-width={5}
							fill="none"
							class:trace-path={isAnimating && paths[i]}
							style:transition="all 0.2s"
							style:--animation-duration={$configStore.ladderAnimationSpeed + 's'}
						/>
					{/if}
				{/if}
			{/if}
		</svg>
	</div>
	<div class="results-container">
		{#each results as result, i}
			{@const playerIndex = resultToPlayerMap[i]}
			{@const player = players[playerIndex]}
			{@const isRevealed = true}
			<div
				class="result-input"
				role="button"
				tabindex="0"
				onmouseenter={() => {
					if (!isAnimating) hoveredPathIndex = resultToPlayerMap[i];
				}}
				onmouseleave={() => (hoveredPathIndex = null)}
			>
				{#if isRevealed}
					<input
						type="text"
						bind:value={results[i]}
						readonly={!resultEditing[i]}
						ondblclick={() => (resultEditing[i] = !resultEditing[i])}
						onblur={() => (resultEditing[i] = false)}
					/>
				{:else}
					<input type="text" value="???" readonly style="cursor: help;" />
				{/if}
			</div>
		{/each}
	</div>

	<div class="controls">
		<button onclick={generateLadders} disabled={isAnimating || isManualMode}>New Ladder</button>
		<button onclick={clearResults} disabled={isAnimating || !showPaths}>Clear</button>
		<button onclick={startAnimation} disabled={isAnimating}>Start All</button>
		<button onclick={startAnimationSequentially} disabled={isAnimating}>Start Sequentially</button>
	</div>

	<div class="speed-control">
		<label for="animation-speed">Animation Speed (seconds):</label>
		<input
			type="number"
			id="animation-speed"
			bind:value={$configStore.ladderAnimationSpeed}
			min="0.1"
			step="0.1"
			class="speed-input"
		/>
	</div>

	{#if Object.keys(resultsToShow).length > 0}
		<div class="winners">
			<button
				class="results-toggle"
				onclick={() => (isResultsCollapsed = !isResultsCollapsed)}
				aria-expanded={!isResultsCollapsed}
			>
				<h3>Results {isResultsCollapsed ? '▼' : '▲'}</h3>
			</button>
			{#if !isResultsCollapsed}
				<ul>
					{#each Object.entries(resultsToShow) as [player, result]}
						<li>{player} → {result}</li>
					{/each}
				</ul>
			{/if}
		</div>
	{/if}

	<div class="sidebar-container {isSidebarOpen ? 'open' : ''}">
		<div class="sidebar">
			<h3>Ladder Game Settings</h3>
			<div>
				<label for="start-items">Start Items (one per line)</label>
				<textarea id="start-items" bind:value={$configStore.ladderPlayers} rows="4"></textarea>
			</div>
			<div>
				<label for="end-items">End Items (one per line)</label>
				<textarea id="end-items" bind:value={$configStore.ladderResults} rows="4"></textarea>
			</div>

			<div class="manual-mode-toggle">
				<label>
					<input type="checkbox" bind:checked={isManualMode} />
					Manual Mode
				</label>
			</div>

			<h4 class="config-header">Style Options</h4>
			<div class="manual-mode-toggle" style="padding: 8px; background-color: #f0f0f0;">
				<label style="cursor: pointer;">
					<input type="checkbox" bind:checked={$configStore.ladderOverrideGeneralStyle} />
					Override general styles
				</label>
			</div>
			{#if $configStore.ladderOverrideGeneralStyle}
				<div class="style-grid">
					<label for="font-family-input">Font Family</label>
					<input
						id="font-family-input"
						type="text"
						bind:value={$configStore.ladderStyleOptions.fontFamily}
					/>
					<label for="font-size-input">Font Size (px)</label>
					<input
						id="font-size-input"
						type="number"
						bind:value={$configStore.ladderStyleOptions.fontSize}
						min="8"
					/>
					<label for="font-weight-select">Font Weight</label>
					<select id="font-weight-select" bind:value={$configStore.ladderStyleOptions.fontWeight}>
						<option value="normal">Normal</option>
						<option value="bold">Bold</option>
						<option value="lighter">Lighter</option>
					</select>
					<label for="text-color-input">Text Color</label>
					<input
						id="text-color-input"
						type="color"
						bind:value={$configStore.ladderStyleOptions.textColor}
					/>
					<label for="bg-color-input">Background Color</label>
					<input
						id="bg-color-input"
						type="color"
						bind:value={$configStore.ladderStyleOptions.backgroundColor}
					/>
					<label for="line-color-input">Line Color</label>
					<input
						id="line-color-input"
						type="color"
						bind:value={$configStore.ladderStyleOptions.lineColor}
					/>
					<label for="rung-color-input">Rung Color</label>
					<input
						id="rung-color-input"
						type="color"
						bind:value={$configStore.ladderStyleOptions.rungColor}
					/>
					<label for="line-thickness-range"
						>Line Thickness: {$configStore.ladderStyleOptions.lineThickness}px</label
					>
					<input
						id="line-thickness-range"
						type="range"
						bind:value={$configStore.ladderStyleOptions.lineThickness}
						min="1"
						max="10"
						class="slider"
					/>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.game-container {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 1rem;
		box-sizing: border-box;
		width: 100%;
		min-height: 100vh;
		overflow-x: hidden;
	}
	.inputs,
	.results-container {
		display: grid;
		grid-template-columns: repeat(var(--player-count, 1), 1fr);
		width: 100%;
		max-width: 800px; /* Match the svg-container */
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 10px;
	}
	.results-container {
		margin-top: 10px;
	}
	.player-input,
	.result-input {
		text-align: center;
		cursor: pointer;
	}
	.player-input input,
	.result-input input {
		width: 90%; /* Give a little space */
		margin: auto;
	}
	input {
		width: 100%;
		text-align: center;
		border: 1px solid #ccc;
		padding: 5px;
		border-radius: 4px;
		background-color: inherit;
		color: inherit;
		font-family: inherit;
		font-size: inherit;
	}
	.svg-container {
		width: 100%;
		max-width: 800px; /* Prevent it from getting too wide */
	}
	.ladder-svg {
		width: 100%;
		height: auto;
		border: 1px solid #eee;
	}
	.controls {
		margin-top: 20px;
		display: flex;
		gap: 10px;
	}
	button {
		padding: 10px 20px;
		font-size: 1em;
		cursor: pointer;
		background-color: #f0f0f0;
		border: 1px solid #ccc;
		border-radius: 4px;
	}
	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	.trace-path {
		stroke-dasharray: 5000;
		stroke-dashoffset: 5000;
		animation: dash var(--animation-duration, 2s) linear forwards;
	}
	@keyframes dash {
		to {
			stroke-dashoffset: 0;
		}
	}
	.winners {
		margin-top: 20px;
		border: 1px solid #ccc;
		padding: 10px;
		width: 300px;
	}
	.config-header {
		margin-top: 15px;
		margin-bottom: 5px;
		border-top: 1px solid #eee;
		padding-top: 15px;
	}
	.style-grid {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 8px 12px;
		align-items: center;
	}
	.style-grid label {
		font-weight: normal;
		text-align: right;
		font-size: 0.9em;
	}
	.results-toggle {
		background: none;
		border: none;
		padding: 0;
		margin: 0;
		font: inherit;
		color: inherit;
		cursor: pointer;
		width: 100%;
		text-align: left;
	}
	.results-toggle h3 {
		margin: 0;
	}
	.manual-mode-toggle {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 8px;
		background-color: #f0f0f0;
		border-radius: 5px;
		margin-top: 10px;
	}
	.manual-mode-toggle label {
		cursor: pointer;
	}
	.ladder-svg.manual-mode {
		cursor: pointer;
	}
	.style-grid input,
	.style-grid select {
		width: 100%;
		box-sizing: border-box;
		padding: 4px;
	}
	.slider {
		-webkit-appearance: none;
		appearance: none;
		width: 100%;
		height: 10px;
		background: #ddd;
		outline: none;
		opacity: 0.7;
		-webkit-transition: 0.2s;
		transition: opacity 0.2s;
		border-radius: 5px;
	}
	.slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 20px;
		height: 20px;
		background: #4caf50;
		cursor: pointer;
		border-radius: 50%;
	}
	.slider::-moz-range-thumb {
		width: 20px;
		height: 20px;
		background: #4caf50;
		cursor: pointer;
		border-radius: 50%;
	}
	.sidebar-toggle {
		position: fixed;
		top: 20px;
		right: 20px;
		z-index: 1001;
		font-size: 24px;
		line-height: 1;
	}
	.sidebar-container {
		position: fixed;
		top: 0;
		right: -350px; /* Hidden off-screen */
		width: 350px;
		height: 100%;
		background: #f9f9f9;
		box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
		transition: right 0.3s ease-in-out;
		z-index: 1000;
	}
	.sidebar-container.open {
		right: 0; /* Slides in */
	}
	.sidebar {
		padding: 15px;
		height: 100%;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.sidebar h3,
	.sidebar h4 {
		margin: 0;
		text-align: center;
	}
	.sidebar textarea {
		width: 100%;
		box-sizing: border-box;
		padding: 8px;
		border-radius: 4px;
		border: 1px solid #ccc;
		font-family: inherit;
	}
</style>
