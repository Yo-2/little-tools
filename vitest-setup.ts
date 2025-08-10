import { cleanup } from '@testing-library/svelte';
import { afterEach } from 'vitest';

// This runs after each test and ensures that any components
// rendered during the test are unmounted and removed from the DOM.
afterEach(() => {
	cleanup();
});
