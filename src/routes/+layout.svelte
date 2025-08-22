<script lang="ts">
	import { configStore } from '$lib/configStore';

	function loadFonts(fontFamilies: string) {
		if (!fontFamilies) return;

		const fonts = fontFamilies.split(',').map((f) => f.trim());
		for (const fontName of fonts) {
			const fontId = `font-link-${fontName.replace(/\s/g, '-')}`;
			if (!document.getElementById(fontId)) {
				const link = document.createElement('link');
				link.id = fontId;
				link.rel = 'stylesheet';
				link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(
					/\s/g,
					'+'
				)}&display=swap`;
				document.head.appendChild(link);
			}
		}
	}

	// --- Reactive Font Loading ---
	$effect(() => {
		if (typeof window === 'undefined') return;

		loadFonts($configStore.fontFamily);
		if ($configStore.clockOverrideGeneralStyle) {
			loadFonts($configStore.clockStyleOptions.fontFamily);
		}
		if ($configStore.timerOverrideGeneralStyle) {
			loadFonts($configStore.timerStyleOptions.fontFamily);
		}
		if ($configStore.textOverrideGeneralStyle) {
			loadFonts($configStore.textStyleOptions.fontFamily);
		}
		if ($configStore.spinningWheelOverrideGeneralStyle) {
			loadFonts($configStore.spinningWheelStyleOptions.fontFamily);
		}
		if ($configStore.ladderOverrideGeneralStyle) {
			loadFonts($configStore.ladderStyleOptions.fontFamily);
		}
		if ($configStore.weatherOverrideGeneralStyle) {
			loadFonts($configStore.weatherStyleOptions.fontFamily);
		}
	});
</script>

<slot />
