<script lang="ts">
	// --- Props ---
	let {
		players = ['Player 1', 'Player 2', 'Player 3', 'Player 4'],
		results = ['Prize A', 'Prize B', 'Prize C', 'Prize D']
	} = $props();

	// --- State ---
	let rungs = $state<[number, number][]>([]); // [ladderIndex, yPosition]
	let paths = $state<(string | undefined)[]>([]);
	let isAnimating = $state(false);
	let showPaths = $state(false);
	let winners = $state<Record<string, string>>({});
	let playerEditing = $state(new Array(players.length).fill(false));
	let resultEditing = $state(new Array(results.length).fill(false));

	// --- Constants ---
	const LADDER_HEIGHT = 400;
	const LADDER_WIDTH = 100;

	// --- Lifecycle ---
	$effect(() => {
		generateLadders();
	});

	// Keep players and results arrays in sync, and reset editing state
	$effect(() => {
		// When players array changes, reset editing state and sync results array
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
		// When results array changes, reset editing state
		resultEditing = new Array(results.length).fill(false);
	});

	// --- Functions ---
	function generateLadders() {
		showPaths = false;
		const newRungs: [number, number][] = [];
		const numVerticals = players.length;
		const numHorizontals = 10;

		for (let i = 0; i < numHorizontals; i++) {
			const y = (LADDER_HEIGHT / (numHorizontals + 1)) * (i + 1);

			// Iterate through possible start points and randomly place non-adjacent rungs
			for (let j = 0; j < numVerticals - 1; j++) {
				// 50% chance of placing a rung, but ensure it's not right next to another
				if (Math.random() > 0.5) {
					newRungs.push([j, y]);
					// Skip the next position to avoid adjacent rungs
					j++;
				}
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

	function startAnimation() {
		if (isAnimating) return;
		isAnimating = true;
		showPaths = true;
		winners = {};
		const newPaths: (string | undefined)[] = [];
		for (let i = 0; i < players.length; i++) {
			const { path, endLadder } = tracePath(i);
			newPaths[i] = path;
			winners[players[i]] = results[endLadder];
		}
		paths = newPaths;

		// Wait for animation to finish
		setTimeout(() => {
			isAnimating = false;
		}, 2000);
	}

	function startSinglePath(playerIndex: number) {
		if (isAnimating) return;
		isAnimating = true;
		showPaths = true;
		winners = {};

		const { path, endLadder } = tracePath(playerIndex);
		const newPaths = [];
		newPaths[playerIndex] = path;
		paths = newPaths; // Trigger reactivity
		winners[players[playerIndex]] = results[endLadder];

		setTimeout(() => {
			isAnimating = false;
		}, 2000);
	}
</script>

<div class="game-container">
	<div class="inputs">
		{#each players as player, i}
			<div
				class="player-input"
				data-player={player}
				onclick={() => startSinglePath(i)}
				onkeydown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						startSinglePath(i);
					}
				}}
				role="button"
				tabindex="0"
			>
				<input
					type="text"
					bind:value={players[i]}
					placeholder="Player Name"
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
		{#each rungs as [ladderIndex, y]}
			<line
				x1={ladderIndex * LADDER_WIDTH + LADDER_WIDTH / 2}
				y1={y}
				x2={(ladderIndex + 1) * LADDER_WIDTH + LADDER_WIDTH / 2}
				y2={y}
				stroke="brown"
				stroke-width="2"
			/>
		{/each}
		<!-- Paths -->
		{#if showPaths}
			{#each paths as path, i}
				<path
					d={path}
					stroke={[
						'rgba(255, 0, 0, 0.7)',
						'rgba(0, 0, 255, 0.7)',
						'rgba(0, 128, 0, 0.7)',
						'rgba(255, 165, 0, 0.7)'
					][i % 4]}
					stroke-width="3"
					fill="none"
					class="trace-path"
				/>
			{/each}
		{/if}
	</svg>
	<div class="results-container">
		{#each results as result, i}
			<div class="result-input" data-result={result}>
				<input
					type="text"
					bind:value={results[i]}
					placeholder="Prize/Result"
					readonly={!resultEditing[i]}
					ondblclick={() => (resultEditing[i] = true)}
					onblur={() => (resultEditing[i] = false)}
				/>
			</div>
		{/each}
	</div>

	<div class="controls">
		<button onclick={generateLadders} disabled={isAnimating}>New Ladder</button>
		<button onclick={startAnimation} disabled={isAnimating}>Start</button>
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
	input {
		width: 100%;
		text-align: center;
		border: 1px solid #ccc;
		padding: 5px;
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
