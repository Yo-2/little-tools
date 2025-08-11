<script lang="ts">
	import { configStore } from '$lib/configStore';

	const { showSidebarToggle = false } = $props();

	// --- Component State (non-persistent) ---
	let rungs = $state<[number, number][]>([]); // [ladderIndex, yPosition]
	let paths = $state<(string | undefined)[]>([]);
	let isAnimating = $state(false);
	let showPaths = $state(false);
	let winners = $state<Record<string, string>>({});
	let hoveredPathIndex = $state<number | null>(null);
	let resultToPlayerMap = $state<Record<number, number>>({}); // resultIndex -> playerIndex
	let allCalculatedPaths = $state<(string | undefined)[]>([]);
	let revealedWinners = $state<Record<string, string>>({});
	let visiblePaths = $state<Record<number, string>>({});
	let isSidebarOpen = $state(false);
	let isResultsCollapsed = $state(true);

	// --- Derived State from Store ---
	let players = $derived(
		$configStore.ladderPlayers
			.split('\n')
			.map((s) => s.trim())
			.filter(Boolean)
	);

	let results = $derived(() => {
		let newResults = $configStore.ladderResults
			.split('\n')
			.map((s) => s.trim())
			.filter(Boolean);
		if (players().length > newResults.length) {
			const diff = players().length - newResults.length;
			for (let i = 0; i < diff; i++) {
				newResults.push(`Prize ${newResults.length + 1}`);
			}
		}
		return newResults;
	});

	// --- Lifecycle ---
	$effect(() => {
		// Regenerate ladder when players array changes.
		// By depending on `players`, we also indirectly depend on `$configStore.ladderPlayers`.
		generateLadders();
	});

	// --- Functions ---
	function handleSvgKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
		}
	}

	function handleSvgClick(event: MouseEvent) {
		if (!$configStore.ladderIsManualMode) return;

		const svgRect = (event.currentTarget as SVGSVGElement).getBoundingClientRect();
		const x = event.clientX - svgRect.left;
		const y = event.clientY - svgRect.top;

		const laneIndex = Math.floor(x / $configStore.ladderWidth);
		if (laneIndex >= players().length - 1) return;

		const yLevels = Array.from(
			{ length: 12 },
			(_, i) => ($configStore.ladderHeight / (12 + 1)) * (i + 1)
		);
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
			rungs = rungs.filter((_, index) => index !== rungIndex);
		} else if (!isPrevLaneOccupied && !isNextLaneOccupied) {
			rungs = [...rungs, [laneIndex, closestY]];
		}
	}

	function generateLadders() {
		if ($configStore.ladderIsManualMode) return;
		showPaths = false;
		winners = {};
		revealedWinners = {};
		paths = [];
		visiblePaths = {};
		isResultsCollapsed = true; // Collapse results on new ladder

		const newRungs: [number, number][] = [];
		const numPlayers = players().length;
		if (numPlayers <= 1) {
			rungs = [];
			return;
		}

		const numLanes = numPlayers - 1;
		const minRungsPerLane = 2;
		const numLevels = 12;
		const yLevels = Array.from(
			{ length: numLevels },
			(_, i) => ($configStore.ladderHeight / (numLevels + 1)) * (i + 1)
		);

		const occupied = new Map<number, Set<number>>();
		for (let laneIndex = 0; laneIndex < numLanes; laneIndex++) {
			const availableYLevels = [...yLevels];
			let placedCount = 0;
			availableYLevels.sort(() => Math.random() - 0.5);

			for (const y of availableYLevels) {
				if (placedCount >= minRungsPerLane) break;
				const isPrevLaneOccupied = occupied.get(y)?.has(laneIndex - 1);
				if (!isPrevLaneOccupied) {
					if (!occupied.has(y)) {
						occupied.set(y, new Set());
					}
					occupied.get(y)!.add(laneIndex);
					newRungs.push([laneIndex, y]);
					placedCount++;
				}
			}
		}

		const extraRungs = numLanes;
		for (let i = 0; i < extraRungs; i++) {
			const laneIndex = Math.floor(Math.random() * numLanes);
			const y = yLevels[Math.floor(Math.random() * yLevels.length)];
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

	function tracePath(startLadder: number) {
		let x = startLadder * $configStore.ladderWidth + $configStore.ladderWidth / 2;
		let y = 0;
		let path = `M ${x} ${y}`;
		let currentLadder = startLadder;

		while (y < $configStore.ladderHeight) {
			const nextRung = rungs
				.filter(([ladderIdx]) => ladderIdx === currentLadder || ladderIdx === currentLadder - 1)
				.map((rung) => ({ ladder: rung[0], y: rung[1] }))
				.filter((rung) => rung.y > y)
				.sort((a, b) => a.y - b.y)[0];

			if (nextRung) {
				path += ` L ${x} ${nextRung.y}`;
				y = nextRung.y;

				if (nextRung.ladder === currentLadder) {
					x += $configStore.ladderWidth;
					currentLadder++;
				} else {
					x -= $configStore.ladderWidth;
					currentLadder--;
				}
				path += ` L ${x} ${y}`;
			} else {
				y = $configStore.ladderHeight;
				path += ` L ${x} ${y}`;
			}
		}
		return { path, endLadder: currentLadder };
	}

	function calculateAllPaths() {
		winners = {};
		const newResultToPlayerMap: Record<number, number> = {};
		allCalculatedPaths = players().map((_, i) => {
			const { path, endLadder } = tracePath(i);
			if (players()[i] && results()[endLadder]) {
				winners[players()[i]] = results()[endLadder];
				newResultToPlayerMap[endLadder] = i;
			}
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
			revealedWinners = { ...winners }; // Reveal all winners at the end
			isAnimating = false;
		}, $configStore.ladderAnimationSpeed * 1000);
	}

	function startSinglePath(playerIndex: number) {
		if (isAnimating || visiblePaths[playerIndex]) return;
		isAnimating = true;
		showPaths = true;
		calculateAllPaths();

		const newPaths: (string | undefined)[] = [];
		newPaths[playerIndex] = allCalculatedPaths[playerIndex];
		paths = newPaths;

		setTimeout(() => {
			visiblePaths[playerIndex] = allCalculatedPaths[playerIndex] as string;
			if (players()[playerIndex] && winners[players()[playerIndex]]) {
				revealedWinners[players()[playerIndex]] = winners[players()[playerIndex]];
			}
			paths = [];
			isAnimating = false;
		}, $configStore.ladderAnimationSpeed * 1000);
	}

	async function startAnimationSequentially() {
		if (isAnimating) return;
		isAnimating = true;
		showPaths = true;
		calculateAllPaths();

		for (let i = 0; i < players().length; i++) {
			const newPaths: (string | undefined)[] = [];
			newPaths[i] = allCalculatedPaths[i];
			paths = newPaths;
			await new Promise((resolve) =>
				setTimeout(resolve, $configStore.ladderAnimationSpeed * 1000 + 100)
			);
			if (players()[i] && winners[players()[i]]) {
				revealedWinners[players()[i]] = winners[players()[i]];
			}
		}

		paths = allCalculatedPaths;
		isAnimating = false;
	}
</script>

<div
	class="game-container"
	style="
		--animation-duration: {$configStore.ladderAnimationSpeed}s;
		--player-count: {players.length};
		--svg-width: {players.length * $configStore.ladderWidth}px;
		background-color: {$configStore.ladderStyleOptions.backgroundColor};
		font-family: {$configStore.ladderStyleOptions.fontFamily};
		font-size: {$configStore.ladderStyleOptions.fontSize}px;
		font-weight: {$configStore.ladderStyleOptions.fontWeight};
		color: {$configStore.ladderStyleOptions.textColor};
	"
>
	{#if showSidebarToggle}
		<button class="sidebar-toggle" onclick={() => (isSidebarOpen = !isSidebarOpen)}>⚙️</button>
	{/if}

	<div class="inputs">
		{#each players as _, i}
			<div
				class="player-input"
				role="button"
				tabindex="0"
				onmouseenter={() => (hoveredPathIndex = i)}
				onmouseleave={() => (hoveredPathIndex = null)}
				onclick={(e) => {
					e.stopPropagation();
					startSinglePath(i);
				}}
				onkeydown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') startSinglePath(i);
				}}
			>
				<input type="text" value={players[i]} readonly />
			</div>
		{/each}
	</div>
	<div class="svg-container">
		<svg
			role="button"
			tabindex="0"
			aria-label="Ladder editor canvas"
			class="ladder-svg"
			class:manual-mode={$configStore.ladderIsManualMode}
			viewBox={`0 0 ${players.length * $configStore.ladderWidth} ${$configStore.ladderHeight + 50}`}
			preserveAspectRatio="xMidYMin meet"
			onclick={handleSvgClick}
			onkeydown={handleSvgKeyDown}
		>
			<!-- Ladders -->
			{#each players as _, i}
				<line
					data-player={players[i]}
					x1={i * $configStore.ladderWidth + $configStore.ladderWidth / 2}
					y1="0"
					x2={i * $configStore.ladderWidth + $configStore.ladderWidth / 2}
					y2={$configStore.ladderHeight}
					stroke={$configStore.ladderStyleOptions.lineColor}
					stroke-width={$configStore.ladderStyleOptions.lineThickness}
				/>
			{/each}
			<!-- Rungs -->
			{#each rungs as [ladderIndex, y]}
				<line
					x1={ladderIndex * $configStore.ladderWidth + $configStore.ladderWidth / 2}
					y1={y}
					x2={(ladderIndex + 1) * $configStore.ladderWidth + $configStore.ladderWidth / 2}
					y2={y}
					stroke={$configStore.ladderStyleOptions.rungColor}
					stroke-width={$configStore.ladderStyleOptions.lineThickness}
				/>
			{/each}
			<!-- Paths -->
			{#if showPaths}
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
						/>
					{/if}
				{/if}
			{/if}
		</svg>
	</div>
	<div class="results-container">
		{#each results as _, i}
			{@const playerIndex = resultToPlayerMap[i]}
			{@const isRevealed =
				!$configStore.ladderIsObfuscated || revealedWinners[players[playerIndex]]}
			<div
				class="result-input"
				role="button"
				tabindex="0"
				onmouseenter={() => (hoveredPathIndex = resultToPlayerMap[i])}
				onmouseleave={() => (hoveredPathIndex = null)}
			>
				{#if isRevealed}
					<input type="text" value={results[i]} readonly />
				{:else}
					<input type="text" value="???" readonly style="cursor: help;" />
				{/if}
			</div>
		{/each}
	</div>

	<div class="controls">
		<button onclick={generateLadders} disabled={isAnimating || $configStore.ladderIsManualMode}
			>New Ladder</button
		>
		<button onclick={startAnimation} disabled={isAnimating}>Start All</button>
		<button onclick={startAnimationSequentially} disabled={isAnimating}>Start Sequentially</button>
	</div>

	{#if Object.keys(revealedWinners).length > 0}
		<div class="winners">
			<button
				class="results-header-button"
				aria-expanded={!isResultsCollapsed}
				onclick={() => (isResultsCollapsed = !isResultsCollapsed)}
			>
				<h3>Results {isResultsCollapsed ? '▼' : '▲'}</h3>
			</button>
			{#if !isResultsCollapsed}
				<ul>
					{#each Object.entries(revealedWinners) as [player, winnerResult]}
						<li>{player} → {winnerResult}</li>
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
					<input type="checkbox" bind:checked={$configStore.ladderIsManualMode} />
					Manual Mode
				</label>
			</div>
			<div class="manual-mode-toggle">
				<label>
					<input type="checkbox" bind:checked={$configStore.ladderIsObfuscated} />
					Hide Results
				</label>
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

			<h4 class="config-header">Dimensions</h4>
			<div class="style-grid">
				<label for="ladder-height">Height (px)</label>
				<input id="ladder-height" type="number" bind:value={$configStore.ladderHeight} />
				<label for="ladder-width">Width (px)</label>
				<input id="ladder-width" type="number" bind:value={$configStore.ladderWidth} />
			</div>

			<h4 class="config-header">Style Options</h4>
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
	.inputs {
		display: grid;
		grid-template-columns: repeat(var(--player-count, 1), 1fr);
		width: var(--svg-width, 100%);
		max-width: 100%;
		margin-bottom: 10px;
	}
	.results-container {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 10px;
		margin-top: 10px;
		margin-bottom: 10px;
	}
	.player-input,
	.result-input {
		text-align: center;
		cursor: pointer;
	}
	.player-input input {
		width: 90%; /* Give a little space */
		margin: auto;
	}
	.result-input {
		width: 90px;
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
		max-width: 800px;
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
		text-align: center;
	}
	.winners h3 {
		margin: 0; /* Reset margin from h3 */
	}
	.results-header-button {
		background: none;
		border: none;
		padding: 0;
		margin: 0;
		font: inherit;
		color: inherit;
		cursor: pointer;
		text-align: inherit;
		width: 100%;
	}
	.sidebar-toggle {
		position: fixed;
		top: 20px;
		right: 20px;
		z-index: 1001;
		width: 50px;
		height: 50px;
		border-radius: 50%;
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
	.style-grid select,
	.speed-input {
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
</style>
