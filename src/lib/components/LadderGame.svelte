<script lang="ts">
	/* eslint-disable @typescript-eslint/no-unused-vars */
	// --- Props ---
	let {
		players = ['Player 1', 'Player 2', 'Player 3', 'Player 4'],
		results = ['Prize A', 'Prize B', 'Prize C', 'Prize D']
	} = $props();

	// --- State ---
	type Rung =
		| { type: 'h'; lane: number; y: number }
		| { type: 'd'; lane: number; y1: number; y2: number };
	let rungs = $state<Rung[]>([]);
	let paths = $state<(string | undefined)[]>([]);
	let isAnimating = $state(false);
	let showPaths = $state(false);
	let winners = $state<Record<string, string>>({});
	let hoveredPathIndex = $state<number | null>(null);
	let allCalculatedPaths = $state<(string | undefined)[]>([]);
	let playerEditing = $state(new Array(players.length).fill(false));
	let resultEditing = $state(new Array(results.length).fill(false));
	let resultToPlayerIndex = $state<Record<string, number>>({});

	// --- Constants ---
	const LADDER_HEIGHT = 400;
	const LADDER_WIDTH = 100;

	// --- Lifecycle ---
	$effect(() => {
		generateLadders();
	});

	// Keep players and results arrays in sync, and reset editing state
	$effect(() => {
		playerEditing = new Array(players.length).fill(false);
		if (players.length !== results.length) {
			const newResults = new Array(players.length);
			for (let i = 0; i < players.length; i++) {
				newResults[i] = results[i] || `Prize ${i + 1}`;
			}
			results = newResults;
		}
	});

	$effect(() => {
		resultEditing = new Array(results.length).fill(false);
	});

	// --- Functions ---
	function generateLadders() {
		showPaths = false;
		winners = {};
		paths = [];
		allCalculatedPaths = [];

		const newRungs: Rung[] = [];
		const numLanes = players.length - 1;
		const numYSteps = 10;
		const yPositions = Array.from(
			{ length: numYSteps },
			(_, i) => (LADDER_HEIGHT / (numYSteps + 1)) * (i + 1)
		);

		// Generate horizontal rungs
		for (let lane = 0; lane < numLanes; lane++) {
			const rungsToPlace = 2;
			let placedCount = 0;
			const availableY = [...yPositions];

			while (placedCount < rungsToPlace && availableY.length > 0) {
				const yIndex = Math.floor(Math.random() * availableY.length);
				const y = availableY.splice(yIndex, 1)[0];

				const collision = newRungs.some(
					(r) => r.type === 'h' && r.y === y && Math.abs(r.lane - lane) < 2
				);
				if (!collision) {
					newRungs.push({ type: 'h', lane, y });
					placedCount++;
				}
			}
		}

		// Generate diagonal rungs
		const diagRungsToPlace = numLanes; // One per lane on average
		for (let i = 0; i < diagRungsToPlace; i++) {
			const lane = Math.floor(Math.random() * numLanes);
			const y1 = yPositions[Math.floor(Math.random() * yPositions.length)];
			const y2 = yPositions[Math.floor(Math.random() * yPositions.length)];

			if (y1 !== y2) {
				newRungs.push({ type: 'd', lane, y1: Math.min(y1, y2), y2: Math.max(y1, y2) });
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
			const horizontalRungs = rungs.filter(
				(r): r is Extract<Rung, { type: 'h' }> =>
					r.type === 'h' && (r.lane === currentLadder || r.lane === currentLadder - 1) && r.y > y
			);
			const nextHorizontalRung = horizontalRungs.sort((a, b) => a.y - b.y)[0];

			const diagonalRungs = rungs.filter(
				(r): r is Extract<Rung, { type: 'd' }> =>
					r.type === 'd' && r.lane === currentLadder && r.y1 > y
			);
			const nextDiagonalRung = diagonalRungs.sort((a, b) => a.y1 - b.y1)[0];

			let nextRung: Rung | undefined = undefined;
			if (nextHorizontalRung && nextDiagonalRung) {
				nextRung =
					nextHorizontalRung.y < nextDiagonalRung.y1 ? nextHorizontalRung : nextDiagonalRung;
			} else {
				nextRung = nextHorizontalRung || nextDiagonalRung;
			}

			if (nextRung) {
				if (nextRung.type === 'h') {
					path += ` L ${x} ${nextRung.y}`;
					y = nextRung.y;
					if (nextRung.lane === currentLadder) {
						x += LADDER_WIDTH;
						currentLadder++;
					} else {
						x -= LADDER_WIDTH;
						currentLadder--;
					}
					path += ` L ${x} ${y}`;
				} else {
					// Diagonal
					path += ` L ${x} ${nextRung.y1}`;
					x += LADDER_WIDTH;
					y = nextRung.y2;
					currentLadder++;
					path += ` L ${x} ${y}`;
				}
			} else {
				y = LADDER_HEIGHT;
				path += ` L ${x} ${y}`;
			}
		}
		return { path, endLadder: currentLadder };
	}

	function calculateAllPaths() {
		winners = {};
		const newResultMap: Record<string, number> = {};
		allCalculatedPaths = players.map((_, i) => {
			const { path, endLadder } = tracePath(i);
			const winnerResult = results[endLadder];
			winners[players[i]] = winnerResult;
			newResultMap[winnerResult] = i;
			return path;
		});
		resultToPlayerIndex = newResultMap;
	}

	function startAnimation() {
		if (isAnimating) return;
		isAnimating = true;
		showPaths = true;
		calculateAllPaths();
		paths = allCalculatedPaths;

		setTimeout(() => {
			isAnimating = false;
		}, 2000);
	}

	function startSinglePath(playerIndex: number) {
		if (isAnimating) return;
		isAnimating = true;
		showPaths = true;
		calculateAllPaths();
		const newPaths: (string | undefined)[] = [];
		newPaths[playerIndex] = allCalculatedPaths[playerIndex];
		paths = newPaths;

		setTimeout(() => {
			isAnimating = false;
			paths = allCalculatedPaths;
		}, 2000);
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
			await new Promise((resolve) => setTimeout(resolve, 2100));
		}

		paths = allCalculatedPaths;
		isAnimating = false;
	}
</script>

<div class="game-container">
	<div class="inputs">
		{#each players as player, i}
			<div
				class="player-input"
				role="button"
				tabindex="0"
				onclick={() => {
					if (Object.keys(winners).length === 0) startSinglePath(i);
				}}
				onkeydown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						if (Object.keys(winners).length === 0) startSinglePath(i);
					}
				}}
				onmouseenter={() => (hoveredPathIndex = i)}
				onmouseleave={() => (hoveredPathIndex = null)}
			>
				<input
					type="text"
					bind:value={players[i]}
					readonly={!playerEditing[i]}
					ondblclick={() => (playerEditing[i] = true)}
					onblur={() => (playerEditing[i] = false)}
					onclick={(e) => e.stopPropagation()}
				/>
			</div>
		{/each}
	</div>
	<svg class="ladder-svg" width={players.length * LADDER_WIDTH} height={LADDER_HEIGHT + 50}>
		<!-- Ladders -->
		{#each players as player, i}
			<line
				data-player={player}
				x1={i * LADDER_WIDTH + LADDER_WIDTH / 2}
				y1="0"
				x2={i * LADDER_WIDTH + LADDER_WIDTH / 2}
				y2={LADDER_HEIGHT}
				stroke="black"
			/>
		{/each}
		<!-- Rungs -->
		{#each rungs as rung}
			{#if rung.type === 'h'}
				<line
					x1={rung.lane * LADDER_WIDTH + LADDER_WIDTH / 2}
					y1={rung.y}
					x2={(rung.lane + 1) * LADDER_WIDTH + LADDER_WIDTH / 2}
					y2={rung.y}
					stroke="brown"
					stroke-width="2"
				/>
			{:else if rung.type === 'd'}
				<line
					x1={rung.lane * LADDER_WIDTH + LADDER_WIDTH / 2}
					y1={rung.y1}
					x2={(rung.lane + 1) * LADDER_WIDTH + LADDER_WIDTH / 2}
					y2={rung.y2}
					stroke="purple"
					stroke-width="2"
					stroke-dasharray="4"
				/>
			{/if}
		{/each}
		<!-- Paths -->
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
				/>
			{/each}
		{/if}
	</svg>
	<div class="results-container">
		{#each results as result, i}
			<div
				class="result-input"
				role="group"
				onmouseenter={() => {
					const playerIndex = resultToPlayerIndex[result];
					if (playerIndex !== undefined) {
						hoveredPathIndex = playerIndex;
					}
				}}
				onmouseleave={() => (hoveredPathIndex = null)}
			>
				<input
					type="text"
					bind:value={results[i]}
					readonly={!resultEditing[i]}
					ondblclick={() => (resultEditing[i] = true)}
					onblur={() => (resultEditing[i] = false)}
				/>
			</div>
		{/each}
	</div>

	<div class="controls">
		<button onclick={generateLadders} disabled={isAnimating}>New Ladder</button>
		<button onclick={startAnimation} disabled={isAnimating}>Start All</button>
		<button onclick={startAnimationSequentially} disabled={isAnimating}>Start Sequentially</button>
	</div>

	{#if !isAnimating && Object.keys(winners).length > 0}
		<div class="winners">
			<h3>Results</h3>
			<ul>
				{#each Object.entries(winners) as [player, result]}
					<li>{player} → {result}</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>

<style>
	.game-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		font-family: sans-serif;
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
	.player-input {
		cursor: pointer;
	}
	input {
		width: 100%;
		text-align: center;
		border: 1px solid #ccc;
		padding: 5px;
		border-radius: 4px;
	}
	.ladder-svg {
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
	}
	.trace-path {
		stroke-dasharray: 5000;
		stroke-dashoffset: 5000;
		animation: dash 2s linear forwards;
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
</style>
