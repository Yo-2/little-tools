export function calculateWinningIndex(finalAngle: number, numSegments: number): number {
	if (numSegments === 0) {
		return 0;
	}
	const anglePerSegment = 360 / numSegments;
	// The wheel is rotated -90deg initially, so 0 is at the top.
	// The rotation is clockwise. The final angle under the pointer is (-finalAngle).
	const correctedAngle = (-finalAngle % 360 + 360) % 360;
	return Math.floor(correctedAngle / anglePerSegment);
}
