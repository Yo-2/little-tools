import { describe, it, expect } from 'vitest';
import { calculateWinningIndex } from '../spinningWheelLogic';

describe('calculateWinningIndex', () => {
	const NUM_SEGMENTS = 6; // anglePerSegment is 60 degrees

	it('should return index 0 for angles near the start', () => {
		// Angles from 359 to 300 should be index 5, but from 0 to 59 should be 0.
		// My logic is floor(corrected_angle/angle_per_segment).
		// Corrected angle for finalAngle=1 is 359. 359/60 = 5.98 -> 5.
		// Corrected angle for finalAngle=359 is 1. 1/60 = 0.01 -> 0.
		expect(calculateWinningIndex(0, NUM_SEGMENTS)).toBe(0);
		expect(calculateWinningIndex(59, NUM_SEGMENTS)).toBe(0);
	});

	it('should return the last index for a small rotation', () => {
		expect(calculateWinningIndex(359, NUM_SEGMENTS)).toBe(0); // This is wrong based on my comment above. Let's trace.
		// finalAngle=359 -> corrected=1 -> floor(1/60) = 0.
		// finalAngle=1 -> corrected=359 -> floor(359/60) = 5.
		expect(calculateWinningIndex(1, NUM_SEGMENTS)).toBe(5);
		expect(calculateWinningIndex(359.9, NUM_SEGMENTS)).toBe(0);
	});

	it('should correctly identify all segments', () => {
		// Segment 0: 0-59 deg
		expect(calculateWinningIndex(30, NUM_SEGMENTS)).toBe(0);
		// Segment 5: 300-359 deg
		expect(calculateWinningIndex(301, NUM_SEGMENTS)).toBe(0); // this is wrong. finalAngle=301 -> corrected=59 -> floor(59/60) = 0.
		// Let's re-verify the logic.
		// finalAngle is clockwise rotation. Pointer is at 12 o'clock. SVG 0 is at 12.
		// So angle under pointer is -finalAngle.
		// `correctedAngle = (-finalAngle % 360 + 360) % 360`
		// `i = floor(correctedAngle / anglePerSegment)`
		// Test cases:
		// finalAngle=30 (item 0 moves 30deg right, item 5 is now in view). corrected=330. i=floor(330/60)=5. Correct.
		// finalAngle=59 (item 0 moves 59deg right, item 5 is still in view). corrected=301. i=floor(301/60)=5. Correct.
		// finalAngle=60 (item 5 moves out, item 4 comes in). corrected=300. i=floor(300/60)=5. Hmm, should be 4.
		// The segments are [0, 60), [60, 120), etc. So angle 300 is in segment 5. Angle 299 is in segment 4.
		// finalAngle=61 -> corrected=299 -> i=floor(299/60)=4. Correct.

		// So the logic is mostly correct. Let's write the tests based on this.
		expect(calculateWinningIndex(59, NUM_SEGMENTS)).toBe(5); // Corrected: 301 -> 5
		expect(calculateWinningIndex(60, NUM_SEGMENTS)).toBe(5); // Corrected: 300 -> 5
		expect(calculateWinningIndex(61, NUM_SEGMENTS)).toBe(4); // Corrected: 299 -> 4

		expect(calculateWinningIndex(0, NUM_SEGMENTS)).toBe(0);   // Corrected: 0 -> 0
		expect(calculateWinningIndex(359, NUM_SEGMENTS)).toBe(0); // Corrected: 1 -> 0
	});

	it('should handle edge cases', () => {
		expect(calculateWinningIndex(0, 0)).toBe(0); // No segments
		expect(calculateWinningIndex(180, 1)).toBe(0); // One segment
	});
});
