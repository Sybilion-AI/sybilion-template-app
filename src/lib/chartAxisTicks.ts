/** Evenly spaced tick indices for long monthly series (avoids crowding at the tail). */
export function buildXAxisTickIndices(length: number, maxTicks = 8): number[] {
  if (length <= 0) {
    return [];
  }
  if (length <= maxTicks) {
    return Array.from({ length }, (_, index) => index);
  }

  const gaps = maxTicks - 1;
  const step = (length - 1) / gaps;
  const indices = new Set<number>();
  for (let i = 0; i < maxTicks; i++) {
    indices.add(Math.min(length - 1, Math.round(i * step)));
  }
  return [...indices].sort((a, b) => a - b);
}

/** Shorten ISO month labels for the x-axis (YYYY-MM-DD → YYYY-MM). */
export function formatMonthAxisLabel(date: string): string {
  const match = /^(\d{4}-\d{2})/.exec(date);
  return match ? match[1] : date;
}
