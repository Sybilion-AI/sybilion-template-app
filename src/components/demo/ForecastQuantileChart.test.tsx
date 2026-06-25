import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@sybilion/uilib', async () => {
  const actual = await vi.importActual<typeof import('@sybilion/uilib')>('@sybilion/uilib');
  return {
    ...actual,
    ChartAreaInteractive: () => <div data-slot="chart">Chart</div>,
    useTheme: () => ({ theme: 'light' }),
  };
});

import { ForecastQuantileChart } from './ForecastQuantileChart';

describe('ForecastQuantileChart', () => {
  it('renders chart when API returns numeric quantile arrays', () => {
    render(
      <ForecastQuantileChart
        forecast={{
          horizon: 2,
          months: ['2026-07-01', '2026-08-01'],
          p10: [90, 91],
          p50: [100, 101],
          p90: [110, 111],
        }}
      />,
    );

    expect(screen.getByTestId('forecast-quantile-chart')).toBeInTheDocument();
    expect(screen.getByText('Chart')).toBeInTheDocument();
  });
});
