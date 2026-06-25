import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@sybilion/uilib';
import { Area, ComposedChart, Line, ReferenceLine, XAxis, YAxis } from 'recharts';

import { buildXAxisTickIndices, formatMonthAxisLabel } from '@/lib/chartAxisTicks';

export interface ForecastDataPoint {
  /** ISO date label on the x-axis (e.g. `2026-01` or `2026-01-15`). */
  date: string;
  /** Realised value. Undefined on future points. */
  historical?: number;
  /** Predicted value. Undefined on historical points. */
  forecast?: number;
  /** Lower quantile of the uncertainty band (e.g. P10). */
  quantileLow?: number;
  /** Upper quantile of the uncertainty band (e.g. P90). */
  quantileHigh?: number;
}

export interface ForecastChartProps {
  data: ForecastDataPoint[];
  /** Draws a dashed vertical marker at this x value (the history/forecast split). */
  todayDate?: string;
  /** Appended to axis ticks and tooltip values (e.g. `USD/t`). */
  unit?: string;
  historicalLabel?: string;
  forecastLabel?: string;
  bandLabel?: string;
  height?: number;
}

/**
 * Historical (solid) + forecast (dashed) line chart with a shaded quantile band.
 * Feed data from mapJobToForecastChartData (src/lib/forecastChartData.ts) — do not
 * build splitAt mappers inline. See docs/demo-forecast-charts.md.
 */
export function ForecastChart({
  data,
  todayDate,
  unit = '',
  historicalLabel = 'Historical',
  forecastLabel = 'Forecast',
  bandLabel = 'Uncertainty band',
  height = 320,
}: ForecastChartProps) {
  if (!data || data.length === 0) {
    // Host renders an EmptyState (P-04) — the chart never shows its own message.
    return null;
  }

  const config = {
    historical: { label: historicalLabel, color: 'var(--chart-1)' },
    forecast: { label: forecastLabel, color: 'var(--chart-2)' },
    band: { label: bandLabel, color: 'var(--chart-2)' },
  } satisfies ChartConfig;

  const rows = data.map((point) => ({
    ...point,
    bandBase: point.quantileLow,
    bandSize:
      point.quantileHigh != null && point.quantileLow != null
        ? point.quantileHigh - point.quantileLow
        : undefined,
  }));

  const format = (value: number) =>
    `${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}${unit ? ` ${unit}` : ''}`;

  const tickIndices = buildXAxisTickIndices(rows.length, 8);
  const tickDates = tickIndices.map((index) => rows[index].date);

  return (
    <div className="min-w-0 w-full overflow-hidden" data-testid="forecast-journey-chart">
      <ChartContainer config={config} className="aspect-auto min-w-0 w-full" style={{ height }}>
        <ComposedChart data={rows} margin={{ top: 8, right: 20, left: 4, bottom: 4 }}>
          <XAxis
            dataKey="date"
            ticks={tickDates}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={{ fontSize: 11 }}
            tickFormatter={formatMonthAxisLabel}
            interval={0}
          />
          <YAxis
            width={64}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => format(Number(value))}
          />
          <ChartTooltip content={<ChartTooltipContent />} />

          <Area
            dataKey="bandBase"
            stackId="band"
            stroke="none"
            fill="transparent"
            dot={false}
            activeDot={false}
            legendType="none"
            isAnimationActive={false}
          />
          <Area
            dataKey="bandSize"
            name={bandLabel}
            stackId="band"
            stroke="none"
            fill="var(--color-band)"
            fillOpacity={0.15}
            dot={false}
            activeDot={false}
            legendType="none"
            isAnimationActive={false}
          />

          <Line
            dataKey="historical"
            name={historicalLabel}
            stroke="var(--color-historical)"
            strokeWidth={2}
            dot={false}
            connectNulls={false}
          />
          <Line
            dataKey="forecast"
            name={forecastLabel}
            stroke="var(--color-forecast)"
            strokeWidth={2}
            strokeDasharray="5 3"
            dot={false}
            connectNulls={false}
          />

          {todayDate ? (
            <ReferenceLine
              x={todayDate}
              stroke="var(--muted-foreground)"
              strokeWidth={1}
              strokeDasharray="3 3"
              label={{ value: 'Today', position: 'insideTopLeft', fontSize: 11 }}
            />
          ) : null}
        </ComposedChart>
      </ChartContainer>
    </div>
  );
}
