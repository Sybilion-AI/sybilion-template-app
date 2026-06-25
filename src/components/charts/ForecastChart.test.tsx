import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ForecastChart, type ForecastDataPoint } from './ForecastChart';

const data: ForecastDataPoint[] = [
  { date: '2025-11', historical: 100 },
  { date: '2025-12', historical: 104 },
  { date: '2026-01', forecast: 108, quantileLow: 99, quantileHigh: 117 },
  { date: '2026-02', forecast: 112, quantileLow: 102, quantileHigh: 122 },
];

describe('ForecastChart', () => {
  it('renders a chart container when data is present', () => {
    const { container } = render(
      <ForecastChart data={data} todayDate="2026-01" unit="USD/t" />,
    );
    expect(container.querySelector('[data-slot="chart"]')).not.toBeNull();
  });

  it('renders nothing when data is empty (host shows EmptyState)', () => {
    const { container } = render(<ForecastChart data={[]} />);
    expect(container.querySelector('[data-slot="chart"]')).toBeNull();
  });
});
