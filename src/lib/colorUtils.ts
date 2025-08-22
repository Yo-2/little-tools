/**
 * Converts a HEX color string and an opacity percentage to an RGBA color string.
 * @param hex The HEX color string (e.g., "#RRGGBB" or "#RGB").
 * @param opacity The opacity percentage (0-100).
 * @returns The RGBA color string (e.g., "rgba(r, g, b, a)").
 */
export function hexToRgba(hex: string, opacity: number): string {
  if (!hex) {
    // Return a default color with the specified opacity if hex is invalid
    return `rgba(0, 0, 0, ${opacity / 100})`;
  }

  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    // Return a default color if hex is not valid
    return `rgba(0, 0, 0, ${opacity / 100})`;
  }

  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);

  // Clamp opacity to the range 0-1
  const alpha = Math.max(0, Math.min(1, opacity / 100));

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
