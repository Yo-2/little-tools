<script lang="ts">
	const tools = [
		{ name: 'Clock', path: '/clock' },
		{ name: 'Countdown Timer', path: '/countdownTimer' },
		{ name: 'Text Display', path: '/text' }
	];
</script>

<div class="container">
	<header>
		<h1>Toolkit</h1>
		<a href="/config" class="config-link">Settings</a>
	</header>
	<main>
		<ul class="tool-list">
			{#each tools as tool}
				<li>
					<a href={tool.path} class="tool-card">
						<h2>{tool.name}</h2>
					</a>
				</li>
			{/each}
		</ul>
	</main>
</div>

<style>
	.container {
		font-family: sans-serif;
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
	}

	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid #eaeaea;
		padding-bottom: 1rem;
		margin-bottom: 2rem;
	}

	h1 {
		font-size: 2.5rem;
		margin: 0;
	}

	.config-link {
		font-size: 1rem;
		text-decoration: none;
		color: #0070f3;
	}

	.config-link:hover {
		text-decoration: underline;
	}

	.tool-list {
		list-style: none;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 1.5rem;
	}

	.tool-card {
		display: block;
		padding: 2rem;
		border: 1px solid #eaeaea;
		border-radius: 8px;
		text-decoration: none;
		color: inherit;
		transition:
			box-shadow 0.2s ease,
			border-color 0.2s ease;
	}

	.tool-card:hover {
		border-color: #0070f3;
		box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
	}

	h2 {
		margin: 0;
		font-size: 1.5rem;
	}
</style>
