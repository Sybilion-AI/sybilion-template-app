import type { ForecastDataPoint } from '@/components/charts/ForecastChart';

import type { ForecastArtifact } from './forecastArtifact';
import { normalizeForecastArtifact } from './forecastArtifact';

/** Minimal input point shape from GET /api/forecasts/:id → input.timeseries */
export interface InputTimeseriesPoint {
  date: string;
  value: number;
}

export interface ForecastChartSeries {
  data: ForecastDataPoint[];
  /** First forecast month where observed and forecast lines meet. */
  bridgeDate?: string;
}

function resolveLastObserved(
  timeseries: InputTimeseriesPoint[] | undefined,
  firstForecastMonth: string,
): number | undefined {
  const beforeForecast = (timeseries ?? []).filter((point) => point.date < firstForecastMonth);
  if (beforeForecast.length > 0) {
    return beforeForecast[beforeForecast.length - 1].value;
  }
  return timeseries?.[timeseries.length - 1]?.value;
}

/**
 * Canonical mapper for journey charts: merges input.timeseries + forecast quantiles
 * into one continuous ForecastChart series. Copy verbatim — do not reimplement in pages.
 *
 * Bridge rule: on the first forecast month, historical and forecast both use the last
 * observed value so the solid and dashed lines meet; P50 continues from month two.
 * Pass bridgeDate to ForecastChart's todayDate prop.
 */
export function mapJobToForecastChartData(
  timeseries: InputTimeseriesPoint[] | undefined,
  forecast: ForecastArtifact | undefined,
): ForecastChartSeries {
  const normalized = normalizeForecastArtifact(forecast);
  const months = normalized?.months ?? [];
  if (months.length === 0) {
    return { data: [] };
  }

  const firstForecastMonth = months[0];
  const p10 = normalized?.p10 ?? [];
  const p50 = normalized?.p50 ?? [];
  const p90 = normalized?.p90 ?? [];
  const lastObserved = resolveLastObserved(timeseries, firstForecastMonth);

  const historicalRows: ForecastDataPoint[] = (timeseries ?? [])
    .filter((point) => point.date < firstForecastMonth)
    .map((point) => ({
      date: point.date,
      historical: point.value,
    }));

  const forecastRows: ForecastDataPoint[] = months.map((month, index) => {
    if (index === 0 && lastObserved != null) {
      return {
        date: month,
        historical: lastObserved,
        forecast: lastObserved,
        quantileLow: p10[index],
        quantileHigh: p90[index],
      };
    }
    return {
      date: month,
      forecast: p50[index],
      quantileLow: p10[index],
      quantileHigh: p90[index],
    };
  });

  return {
    data: [...historicalRows, ...forecastRows],
    bridgeDate: firstForecastMonth,
  };
}
