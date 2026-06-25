/**
 * Canonical forecast artifact normalizer for SDK-backed demos.
 * Backend returns parallel numeric arrays + months; ChartAreaInteractive needs aligned series.
 * See docs/demo-forecast-charts.md — do not map .month/.value on raw API responses in pages.
 */

export interface ForecastQuantilePoint {
  month: string;
  value: number;
}

/** Backend returns numeric arrays; Dojo fixtures may use point objects. */
export type ForecastQuantileSeries = number[] | ForecastQuantilePoint[];

export interface ForecastArtifact {
  horizon?: number;
  months?: string[];
  p10?: ForecastQuantileSeries;
  p50?: ForecastQuantileSeries;
  p90?: ForecastQuantileSeries;
}

export interface NormalizedForecastArtifact {
  horizon?: number;
  months: string[];
  p10: number[];
  p50: number[];
  p90: number[];
}

function isQuantilePoint(
  entry: number | ForecastQuantilePoint | undefined,
): entry is ForecastQuantilePoint {
  return typeof entry === 'object' && entry !== null && 'month' in entry;
}

function readSeriesValue(
  series: ForecastQuantileSeries | undefined,
  index: number,
): number | undefined {
  const entry = series?.[index];
  if (entry == null) return undefined;
  if (typeof entry === 'number') return entry;
  if (isQuantilePoint(entry)) return entry.value;
  return undefined;
}

function readSeriesMonth(
  series: ForecastQuantileSeries | undefined,
  index: number,
): string | undefined {
  const entry = series?.[index];
  if (isQuantilePoint(entry)) return entry.month;
  return undefined;
}

/** Aligns backend array payloads (and legacy point arrays) to chart-friendly series. */
export function normalizeForecastArtifact(
  forecast: ForecastArtifact | undefined,
): NormalizedForecastArtifact | undefined {
  if (!forecast) return undefined;

  const p10 = forecast.p10 ?? [];
  const p50 = forecast.p50 ?? [];
  const p90 = forecast.p90 ?? [];
  const length = Math.max(
    forecast.months?.length ?? 0,
    p10.length,
    p50.length,
    p90.length,
  );

  if (length === 0) return undefined;

  const months: string[] = [];
  const p10Values: number[] = [];
  const p50Values: number[] = [];
  const p90Values: number[] = [];

  for (let index = 0; index < length; index += 1) {
    const month =
      forecast.months?.[index] ??
      readSeriesMonth(p50, index) ??
      readSeriesMonth(p10, index) ??
      readSeriesMonth(p90, index) ??
      `M${index + 1}`;

    const v10 = readSeriesValue(p10, index);
    const v50 = readSeriesValue(p50, index);
    const v90 = readSeriesValue(p90, index);

    if (v50 == null && v10 == null && v90 == null) continue;

    months.push(month);
    p10Values.push(v10 ?? v50 ?? 0);
    p50Values.push(v50 ?? v10 ?? 0);
    p90Values.push(v90 ?? v50 ?? 0);
  }

  if (months.length === 0) return undefined;

  return {
    horizon: forecast.horizon ?? months.length,
    months,
    p10: p10Values,
    p50: p50Values,
    p90: p90Values,
  };
}
