import { Card, CardContent } from '@sybilion/uilib';

import { cn } from '@/lib/utils';

export type MetricTrend = 'up' | 'down' | 'neutral';

export interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  /** Relative change in percent. Sign drives the +/- prefix. */
  delta?: number;
  trend?: MetricTrend;
  description?: string;
  className?: string;
}

const trendClass: Record<MetricTrend, string> = {
  up: 'text-emerald-600 dark:text-emerald-400',
  down: 'text-red-600 dark:text-red-400',
  neutral: 'text-muted-foreground',
};

/** KPI tile: label, big value with optional unit, and an optional signed delta. */
export function MetricCard({
  title,
  value,
  unit,
  delta,
  trend = 'neutral',
  description,
  className,
}: MetricCardProps) {
  return (
    <Card paddingSize="s" className={className}>
      <CardContent noScroll>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="mt-1 flex items-baseline gap-1">
          <span className="text-2xl font-semibold tabular-nums">{value}</span>
          {unit ? <span className="text-sm text-muted-foreground">{unit}</span> : null}
        </div>
        {delta != null ? (
          <p className={cn('mt-1 text-xs tabular-nums', trendClass[trend])}>
            {delta > 0 ? '+' : ''}
            {delta.toFixed(1)}%
          </p>
        ) : null}
        {description ? (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
