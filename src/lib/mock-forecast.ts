import type { ForecastDataPoint } from '@/components/charts/ForecastChart';

/**
 * Deterministic mock forecast series for the reference DashboardPage and tests.
 * Seeded so snapshots and screenshots stay stable across runs (no Math.random).
 * Demos replace this with real data from their backend via apiClient.
 * When wiring real data, add a bridge row at the anchor month (both `historical` and
 * `forecast` on the same `date`) — see docs/demo-forecast-charts.md § "Bridge row".
 */
export function generateMockForecast(
  months = 24,
  splitAt = 12,
  seed = 42,
): ForecastDataPoint[] {
  const base = 120;
  const today = new Date(Date.UTC(2026, 0, 1));
  let state = seed;
  const noise = () => {
    // Mulberry32 — small, deterministic PRNG so the chart is reproducible.
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return (((t ^ (t >>> 14)) >>> 0) / 4294967296 - 0.5) * 10;
  };

  return Array.from({ length: months }, (_, index) => {
    const point = new Date(
      Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - splitAt + index, 1),
    );
    const date = point.toISOString().slice(0, 7);
    const value = base + index * 0.4 + noise();

    if (index < splitAt) {
      return { date, historical: Number(value.toFixed(2)) };
    }
    return {
      date,
      forecast: Number(value.toFixed(2)),
      quantileLow: Number((value * 0.92).toFixed(2)),
      quantileHigh: Number((value * 1.08).toFixed(2)),
    };
  });
}
