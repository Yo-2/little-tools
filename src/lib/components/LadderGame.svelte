<script lang="ts">
	import { configStore } from '$lib/configStore';

	/* eslint-disable @typescript-eslint/no-unused-vars */
	// --- Props ---
	const { players: playersProp, results: resultsProp } = $props();

	// --- State ---
	let players = $state(playersProp || ['Player 1', 'Player 2', 'Player 3', 'Player 4']);
	let results = $state(resultsProp || ['Prize A', 'Prize B', 'Prize C', 'Prize D']);
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

	// --- Constants ---
	const LADDER_HEIGHT = 400;
	const LADDER_WIDTH = 100;

	// --- Component State ---
	let startItemsInput = $state('');
	let endItemsInput = $state('');
	let validationError = $state('');
	let isManualMode = $state(false);
	let isObfuscated = $state(false);
	let importJson = $state('');
	let styleOptions = $state({
		fontFamily: 'sans-serif',
		fontSize: 14,
		fontWeight: 'normal',
		textColor: '#333333',
		backgroundColor: '#ffffff',
		lineColor: '#000000',
		rungColor: '#A52A2A', // brown
		lineThickness: 2
	});

	// --- Lifecycle ---
	// One-time initialization from props.
	$effect.pre(() => {
		// Pre-fill text areas from props only once
		if (playersProp) startItemsInput = playersProp.join('\n');
		if (resultsProp) endItemsInput = resultsProp.join('\n');
		applyConfigChanges(); // Apply initial config
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
	function exportState() {
		const state = {
			players,
			results,
			rungs,
			styleOptions,
			isManualMode,
			isObfuscated
		};
		const json = JSON.stringify(state, null, 2);
		navigator.clipboard.writeText(json);
		alert('設定已複製到剪貼簿！');
	}

	function importState() {
		try {
			const state = JSON.parse(importJson);
			// Basic validation
			if (!state.players || !state.results || !state.rungs || !state.styleOptions) {
				throw new Error('無效的設定格式');
			}
			players = state.players;
			results = state.results;
			rungs = state.rungs;
			styleOptions = state.styleOptions;
			isManualMode = state.isManualMode ?? false;
			isObfuscated = state.isObfuscated ?? false;

			// Sync textareas
			startItemsInput = players.join('\n');
			endItemsInput = results.join('\n');

			alert('設定已成功匯入！');
		} catch (e) {
			alert('匯入失敗：無效的 JSON 或格式錯誤。');
			console.error(e);
		}
	}

	function applyConfigChanges() {
		validationError = '';
		const newPlayers = startItemsInput
			.split('\n')
			.map((s) => s.trim())
			.filter(Boolean);
		let newResults = endItemsInput
			.split('\n')
			.map((s) => s.trim())
			.filter(Boolean);

		if (newPlayers.length < newResults.length) {
			validationError = '錯誤：起始點數量不能少於結束點數量。';
			return;
		}

		if (newResults.length < newPlayers.length) {
			const diff = newPlayers.length - newResults.length;
			for (let i = 0; i < diff; i++) {
				newResults.push(`結果 ${newResults.length + 1}`);
			}
		}

		players = newPlayers;
		results = newResults;
	}

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
		const yLevels = Array.from(
			{ length: 12 },
			(_, i) => (LADDER_HEIGHT / (12 + 1)) * (i + 1)
		);
		const closestY = yLevels.reduce((prev, curr) =>
			Math.abs(curr - y) < Math.abs(prev - y) ? curr : prev
		);

		const rungIndex = rungs.findIndex(([rLane, rY]) => rLane === laneIndex && rY === closestY);
		const isOccupied = rungIndex !== -1;
		const isPrevLaneOccupied = rungs.some(([rLane, rY]) => rLane === laneIndex - 1 && rY === closestY);
		const isNextLaneOccupied = rungs.some(([rLane, rY]) => rLane === laneIndex + 1 && rY === closestY);

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
			const newPaths: (string | undefined)[] = [];
			newPaths[i] = allCalculatedPaths[i];
			paths = newPaths;
			await new Promise((resolve) =>
				setTimeout(resolve, $configStore.ladderAnimationSpeed * 1000 + 100)
			);
		}

		paths = allCalculatedPaths;
		isAnimating = false;
	}
</script>

<div
	class="game-container"
	style="background-color: {styleOptions.backgroundColor}; font-family: {styleOptions.fontFamily}; font-size: {styleOptions.fontSize}px; font-weight: {styleOptions.fontWeight}; color: {styleOptions.textColor};"
>
	<div class="inputs">
		{#each players as player, i}
			<div
				class="player-input"
				role="button"
				tabindex="0"
				onmouseenter={() => (hoveredPathIndex = i)}
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
				stroke={styleOptions.lineColor}
				stroke-width={styleOptions.lineThickness}
			/>
		{/each}
		<!-- Rungs -->
		{#each rungs as [ladderIndex, y]}
			<line
				x1={ladderIndex * LADDER_WIDTH + LADDER_WIDTH / 2}
				y1={y}
				x2={(ladderIndex + 1) * LADDER_WIDTH + LADDER_WIDTH / 2}
				y2={y}
				stroke={styleOptions.rungColor}
				stroke-width={styleOptions.lineThickness}
			/>
		{/each}
		<!-- Paths -->
		{#if showPaths}
			{@const finalPaths = isAnimating ? paths : Object.values(visiblePaths)}
			{@const pathKeys = isAnimating ? paths.map((_, i) => i) : Object.keys(visiblePaths).map(Number)}

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
			{@const isRevealed =
				!isObfuscated ||
				(Object.keys(winners).length > 0 && !isAnimating) ||
				(revealedWinners && revealedWinners[player])}
			<div
				class="result-input"
				role="button"
				tabindex="0"
				onmouseenter={() => (hoveredPathIndex = resultToPlayerMap[i])}
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
			<h3>結果</h3>
			<ul>
				{#each Object.entries(resultsToShow) as [player, result]}
					<li>{player} → {result}</li>
				{/each}
			</ul>
		</div>
	{/if}

	<div class="config-panel">
		<h3>設定</h3>
		<div>
			<label for="start-items">起始項目 (一行一個)</label>
			<textarea id="start-items" bind:value={startItemsInput} rows="4"></textarea>
		</div>
		<div>
			<label for="end-items">結束項目 (一行一個)</label>
			<textarea id="end-items" bind:value={endItemsInput} rows="4"></textarea>
		</div>

		{#if validationError}
			<p class="error-message">{validationError}</p>
		{/if}
		<button onclick={applyConfigChanges} disabled={isAnimating}>套用設定</button>

		<div class="manual-mode-toggle">
			<label>
				<input type="checkbox" bind:checked={isManualMode} />
				手動編輯模式
			</label>
		</div>
		<div class="manual-mode-toggle">
			<label>
				<input type="checkbox" bind:checked={isObfuscated} />
				隱藏終點
			</label>
		</div>

		<h4 class="config-header">樣式設定</h4>
		<div class="style-grid">
			<label for="font-family-input">字體</label>
			<input id="font-family-input" type="text" bind:value={styleOptions.fontFamily} />
			<label for="font-size-input">字體大小 (px)</label>
			<input id="font-size-input" type="number" bind:value={styleOptions.fontSize} min="8" />
			<label for="font-weight-select">字體粗細</label>
			<select id="font-weight-select" bind:value={styleOptions.fontWeight}>
				<option value="normal">Normal</option>
				<option value="bold">Bold</option>
				<option value="lighter">Lighter</option>
			</select>
			<label for="text-color-input">文字顏色</label>
			<input id="text-color-input" type="color" bind:value={styleOptions.textColor} />
			<label for="bg-color-input">背景顏色</label>
			<input id="bg-color-input" type="color" bind:value={styleOptions.backgroundColor} />
			<label for="line-color-input">梯線顏色</label>
			<input id="line-color-input" type="color" bind:value={styleOptions.lineColor} />
			<label for="rung-color-input">橫線顏色</label>
			<input id="rung-color-input" type="color" bind:value={styleOptions.rungColor} />
			<label for="line-thickness-range">線條粗細: {styleOptions.lineThickness}px</label>
			<input
				id="line-thickness-range"
				type="range"
				bind:value={styleOptions.lineThickness}
				min="1"
				max="10"
				class="slider"
			/>
		</div>

		<h4 class="config-header">儲存/分享</h4>
		<div class="save-share-grid">
			<button onclick={exportState}>匯出設定到剪貼簿</button>
			<textarea bind:value={importJson} placeholder="在此貼上設定 JSON..."></textarea>
			<button onclick={importState}>從 JSON 匯入設定</button>
		</div>
	</div>
</div>

<style>
	.game-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 1rem;
		box-sizing: border-box;
	}
	.inputs,
	.results-container {
		display: flex;
		gap: 10px;
		margin-bottom: 10px;
	}
	.results-container {
		margin-top: 10px;
	}
	.player-input,
	.result-input {
		width: 90px;
		text-align: center;
	}
	.player-input,
	.result-input {
		cursor: pointer;
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
	.config-panel {
		margin-top: 20px;
		padding: 15px;
		border: 1px solid #ddd;
		border-radius: 8px;
		width: 100%;
		max-width: 500px;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.config-panel h3,
	.config-panel h4 {
		margin: 0;
		text-align: center;
	}
	.config-panel textarea {
		width: 100%;
		box-sizing: border-box;
		padding: 8px;
		border-radius: 4px;
		border: 1px solid #ccc;
		background-color: inherit;
		color: inherit;
		font-family: inherit;
	}
	.error-message {
		color: red;
		font-weight: bold;
		margin: 0;
		text-align: center;
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
	.save-share-grid {
		display: flex;
		flex-direction: column;
		gap: 10px;
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
</style>
