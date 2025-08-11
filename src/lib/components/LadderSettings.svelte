<script lang="ts">
	import { configStore } from '$lib/configStore';
</script>

<div class="settings-container">
	<h2>Ladder Game Settings</h2>

	<section>
		<h3>項目</h3>
		<label>
			Players (one per line)
			<textarea bind:value={$configStore.ladderPlayers} rows="5"></textarea>
		</label>
		<label>
			Prizes (one per line)
			<textarea bind:value={$configStore.ladderResults} rows="5"></textarea>
		</label>
	</section>

	<section>
		<h3>模式</h3>
		<label class="toggle">
			<input type="checkbox" bind:checked={$configStore.ladderIsManualMode} />
			手動編輯模式
		</label>
		<label class="toggle">
			<input type="checkbox" bind:checked={$configStore.ladderIsObfuscated} />
			隱藏終點
		</label>
	</section>

	<section>
		<h3>樣式</h3>
		<label>
			Animation Speed (seconds)
			<input type="number" bind:value={$configStore.ladderAnimationSpeed} min="0.1" step="0.1" />
		</label>
		<label>
			Line Thickness
			<input type="range" bind:value={$configStore.ladderLineThickness} min="1" max="10" />
		</label>
		<div class="color-grid">
			<label>
				Line Color
				<input type="color" bind:value={$configStore.ladderLineColor} />
			</label>
			<label>
				Rung Color
				<input type="color" bind:value={$configStore.ladderRungColor} />
			</label>
		</div>
	</section>
</div>

<style>
	.settings-container {
		color: #333;
	}
	h2,
	h3 {
		margin-top: 0;
		border-bottom: 1px solid #eee;
		padding-bottom: 0.5rem;
	}
	section {
		margin-bottom: 2rem;
	}
	label {
		display: block;
		margin-bottom: 1rem;
	}
	textarea,
	input {
		width: 100%;
		padding: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		box-sizing: border-box;
		margin-top: 0.25rem;
	}
	.toggle {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	.toggle input {
		width: auto;
	}
	.color-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}
</style>
