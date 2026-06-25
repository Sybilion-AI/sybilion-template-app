import { useCallback, useMemo, useState } from 'react';

import {
  ChartAreaInteractive,
  useTheme,
} from '@sybilion/uilib';

import { EmptyState } from '@/components/EmptyState';
import {
  normalizeForecastArtifact,
  type ForecastArtifact,
} from '@/lib/forecastArtifact';

const ANALYSIS_ID = 1;
const CHART_MIN_HEIGHT = 360;

function artifactToChartData(forecast: ForecastArtifact | undefined) {
  const normalized = normalizeForecastArtifact(forecast);
  if (!normalized) return [];

  return normalized.months.map((date, index) => ({
    date,
    [`forecast_${ANALYSIS_ID}`]: normalized.p50[index],
    [`q10_${ANALYSIS_ID}`]: normalized.p10[index],
    [`q90_${ANALYSIS_ID}`]: normalized.p90[index],
  }));
}

function artifactToOverlay(forecast: ForecastArtifact | undefined) {
  const normalized = normalizeForecastArtifact(forecast);
  if (!normalized) return {};

  return {
    [ANALYSIS_ID]: {
      analysisId: ANALYSIS_ID,
      dates: normalized.months,
      forecastValues: normalized.p50,
      allQuantiles: {
        p10: normalized.p10,
        p50: normalized.p50,
        p90: normalized.p90,
      },
    },
  };
}

export interface ForecastQuantileChartProps {
  forecast?: ForecastArtifact;
  loading?: boolean;
  error?: string | null;
}

export function ForecastQuantileChart({
  forecast,
  loading = false,
  error = null,
}: ForecastQuantileChartProps) {
  const { theme } = useTheme();
  const [timeRange, setTimeRange] = useState('All');
  const [pinMonth, setPinMonth] = useState<string | undefined>(undefined);
  const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(() => new Set());

  const chartData = useMemo(() => artifactToChartData(forecast), [forecast]);
  const overlayForecastData = useMemo(() => artifactToOverlay(forecast), [forecast]);
  const hasSeries = chartData.length > 0;

  const toggleLegendSeries = useCallback((seriesKey: string) => {
    setHiddenSeries((current) => {
      const next = new Set(current);
      if (next.has(seriesKey)) next.delete(seriesKey);
      else next.add(seriesKey);
      return next;
    });
  }, []);

  const ensureAnalysisSeriesVisible = useCallback((_analysisId: number | string) => {
    setHiddenSeries((current) => {
      const next = new Set(current);
      next.delete(`forecast_${ANALYSIS_ID}`);
      return next;
    });
  }, []);

  if (!loading && !error && !hasSeries) {
    return (
      <EmptyState
        what="No forecast chart data yet."
        why="The job may still be running or the artifact has not arrived."
      />
    );
  }

  const chartProps = {
    chartData,
    forecastData: [{ id: ANALYSIS_ID, name: 'Forecast p50' }],
    overlayForecastData,
    loading,
    error,
    isDarkTheme: theme === 'dark',
    timeRange,
    onTimeRangeChange: setTimeRange,
    pinMonth,
    onPinMonthChange: setPinMonth,
    toggleLegendSeries,
    ensureAnalysisSeriesVisible,
    hiddenSeries,
    disableTimeRangeSelector: true,
    mode: 'intervals' as const,
    selectedLowerQuantile: 'p10',
    selectedUpperQuantile: 'p90',
    lowerQuantiles: ['p10'],
    upperQuantiles: ['p90'],
    xAxisLabel: 'Month',
    yAxisLabel: 'MWh',
  };

  return (
    <div
      className="min-w-0 w-full"
      style={{ minHeight: CHART_MIN_HEIGHT }}
      data-testid="forecast-quantile-chart"
    >
      <ChartAreaInteractive
        {...(chartProps as unknown as Parameters<typeof ChartAreaInteractive>[0])}
      />
    </div>
  );
}
