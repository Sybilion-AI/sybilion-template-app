import { type CSSProperties } from 'react';

export interface TableSkeletonProps {
  rows?: number;
  cols?: number;
}

export function TableSkeleton({
  rows = 6,
  cols = 4,
}: TableSkeletonProps) {
  return (
    <div
      role="presentation"
      aria-busy="true"
      data-testid="table-skeleton"
      style={tableWrapStyle}
    >
      <table style={tableStyle}>
        <tbody>
          {Array.from({ length: rows }).map((_, r) => (
            <tr key={r}>
              {Array.from({ length: cols }).map((_, c) => (
                <td key={c} style={cellTdStyle}>
                  <div
                    style={cellStyle((r + c) % 3)}
                    aria-hidden="true"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export interface ChartSkeletonProps {
  height?: number | string;
}

export function ChartSkeleton({ height = 280 }: ChartSkeletonProps) {
  return (
    <div
      role="presentation"
      aria-busy="true"
      data-testid="chart-skeleton"
      style={chartStyle(height)}
    />
  );
}

export interface CardSkeletonProps {
  lines?: number;
}

export function CardSkeleton({ lines = 3 }: CardSkeletonProps) {
  return (
    <div
      role="presentation"
      aria-busy="true"
      data-testid="card-skeleton"
      style={cardWrapStyle}
    >
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} style={cellStyle(i % 3)} aria-hidden="true" />
      ))}
    </div>
  );
}

const tableWrapStyle: CSSProperties = {
  width: '100%',
};

const tableStyle: CSSProperties = {
  width: '100%',
  borderCollapse: 'separate',
  borderSpacing: '0 8px',
};

const cellTdStyle: CSSProperties = {
  padding: 0,
};

function cellStyle(variant: number): CSSProperties {
  const widths = ['90%', '70%', '85%'];
  return {
    background: 'var(--color-muted, #e4e4e7)',
    height: 14,
    width: widths[variant],
    borderRadius: 4,
    opacity: 0.7,
  };
}

function chartStyle(height: number | string): CSSProperties {
  return {
    background: 'var(--color-muted, #e4e4e7)',
    width: '100%',
    height,
    borderRadius: 8,
    opacity: 0.7,
  };
}

const cardWrapStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  padding: 16,
  border: '1px solid var(--color-border, #e4e4e7)',
  borderRadius: 12,
  background: 'var(--color-card, #fff)',
};
