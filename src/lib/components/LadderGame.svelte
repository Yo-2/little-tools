<script lang="ts">
	import { configStore } from '$lib/configStore';

	$props(); // No props needed, but the declaration is required for components in /routes.

	// --- State ---
	// All configuration is now derived from the global store.
	let players = $derived($configStore.ladderPlayers.split('\n').filter(Boolean));
	let results = $derived($configStore.ladderResults.split('\n').filter(Boolean));

	// Transient component state
	let rungs = $state<[number, number][]>([]);
	let paths = $state<(string | undefined)[]>([]);
	let isAnimating = $state(false);
	let showPaths = $state(false);
	let isResultsExpanded = $state(false);
	let winners = $state<Record<string, string>>({});
	let hoveredPathIndex = $state<number | null>(null);
	let resultToPlayerMap = $state<Record<number, number>>({});
	let allCalculatedPaths = $state<(string | undefined)[]>([]);
	let revealedWinners = $state<Record<string, string>>({});
	let visiblePaths = $state<Record<number, string>>({});
	let resultsToShow = $derived(Object.keys(winners).length > 0 ? winners : revealedWinners);

	// --- Constants ---
	const LADDER_HEIGHT = 400;
	const LADDER_WIDTH = 100;

	// --- Lifecycle ---
	// Regenerate ladder whenever the players array (derived from the store) changes.
	$effect(() => {
		const p = players; // Establish dependency on the derived value
		generateLadders();
	});

	// --- Functions ---
	function generateLadders() {
		if ($configStore.ladderIsManualMode) return;

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
		const numLevels = 12;
		const yLevels = Array.from(
			{ length: numLevels },
			(_, i) => (LADDER_HEIGHT / (numLevels + 1)) * (i + 1)
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
					if (!occupied.has(y)) occupied.set(y, new Set());
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
				if (!occupied.has(y)) occupied.set(y, new Set());
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

		const newPaths: (string | undefined)[] = [];
		newPaths[playerIndex] = allCalculatedPaths[playerIndex];
		paths = newPaths;

		setTimeout(() => {
			visiblePaths[playerIndex] = allCalculatedPaths[playerIndex] as string;
			revealedWinners[players[playerIndex]] = winners[players[playerIndex]];
			paths = [];
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
	style:font-family={$configStore.fontFamily}
	style:font-size={$configStore.fontSize}
	style:font-weight={$configStore.fontWeight}
	style:color={$configStore.textColor}
	style:background-color={$configStore.bgColorHex}
>
	<div class="inputs">
		{#each players as player, i}
			<div
				class="player-input"
				role="button"
				tabindex="0"
				onmouseenter={() => (hoveredPathIndex = i)}
				onmouseleave={() => (hoveredPathIndex = null)}
				onclick={() => startSinglePath(i)}
				onkeydown={(e) => e.key === 'Enter' && startSinglePath(i)}
			>
				{player}
			</div>
		{/each}
	</div>
	<div class="svg-container">
		<svg
			class="ladder-svg"
			viewBox={`0 0 ${players.length * LADDER_WIDTH} ${LADDER_HEIGHT + 50}`}
			preserveAspectRatio="xMidYMin meet"
		>
			{#each players as player, i}
				<line
					x1={i * LADDER_WIDTH + LADDER_WIDTH / 2}
					y1="0"
					x2={i * LADDER_WIDTH + LADDER_WIDTH / 2}
					y2={LADDER_HEIGHT}
					stroke={$configStore.ladderLineColor}
					stroke-width={$configStore.ladderLineThickness}
				/>
			{/each}
			{#each rungs as [ladderIndex, y]}
				<line
					x1={ladderIndex * LADDER_WIDTH + LADDER_WIDTH / 2}
					y1={y}
					x2={(ladderIndex + 1) * LADDER_WIDTH + LADDER_WIDTH / 2}
					y2={y}
					stroke={$configStore.ladderRungColor}
					stroke-width={$configStore.ladderLineThickness}
				/>
			{/each}
			{#if showPaths}
				{@const finalPaths = isAnimating ? paths : allCalculatedPaths}
				{#each finalPaths as path, i}
					<path
						d={path}
						stroke={[
							'rgba(255, 0, 0, 0.7)',
							'rgba(0, 0, 255, 0.7)',
							'rgba(0, 128, 0, 0.7)',
							'rgba(255, 165, 0, 0.7)'
						][i % 4]}
						stroke-width={hoveredPathIndex === i ? 5 : 3}
						fill="none"
						class:trace-path={isAnimating}
						style:opacity={hoveredPathIndex !== null && hoveredPathIndex !== i ? 0.3 : 1}
						style:transition="all 0.2s"
						style:--animation-duration={`${$configStore.ladderAnimationSpeed}s`}
					/>
				{/each}
			{/if}
		</svg>
	</div>
	<div class="results-container">
		{#each results as result, i}
			{@const playerForThisResult = players[resultToPlayerMap[i]]}
			{@const isRevealed =
				!$configStore.ladderIsObfuscated ||
				(Object.keys(winners).length > 0 && !isAnimating) ||
				revealedWinners[playerForThisResult]}

			<div class="result-input" title={result}>
				{isRevealed ? result : '???'}
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

	{#if Object.keys(resultsToShow).length > 0}
		<div class="winners">
			<h3 class="collapsible-header" onclick={() => (isResultsExpanded = !isResultsExpanded)}>
				結果 {isResultsExpanded ? '▼' : '▶'}
			</h3>
			{#if isResultsExpanded}
				<ul>
					{#each Object.entries(resultsToShow) as [player, result]}
						<li>{player} → {result}</li>
					{/each}
				</ul>
			{/if}
		</div>
	{/if}
</div>

<style>
	.game-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		height: 100%;
		padding: 1rem;
		box-sizing: border-box;
	}
	.inputs,
	.results-container {
		display: flex;
		justify-content: center;
		gap: 10px;
		margin-bottom: 10px;
		width: 100%;
		flex-wrap: wrap;
	}
	.results-container {
		margin-top: 10px;
	}
	.player-input,
	.result-input {
		width: 90px;
		text-align: center;
		padding: 8px;
		border: 1px solid #ccc;
		border-radius: 4px;
		display: grid;
		place-items: center;
	}
	.player-input {
		cursor: pointer;
	}
	.svg-container {
		width: 100%;
		flex-grow: 1;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.ladder-svg {
		border: 1px solid #eee;
		max-width: 100%;
		max-height: 100%;
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
	}
	.trace-path {
		stroke-dasharray: 5000;
		stroke-dashoffset: 5000;
		animation: dash var(--animation-duration) linear forwards;
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
		max-width: 90%;
	}
	.collapsible-header {
		cursor: pointer;
		user-select: none;
		margin: 0 0 10px 0;
	}
	.winners ul {
		margin: 0;
		padding-left: 20px;
	}
</style>
