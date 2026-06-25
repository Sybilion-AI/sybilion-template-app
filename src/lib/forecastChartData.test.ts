import { describe, expect, it } from 'vitest';

import { mapJobToForecastChartData } from './forecastChartData';

describe('mapJobToForecastChartData', () => {
  it('meets both lines on the first forecast month at the last observed value', () => {
    const { data, bridgeDate } = mapJobToForecastChartData(
      [
        { date: '2025-04-01', value: 102 },
        { date: '2025-05-01', value: 104 },
      ],
      {
        months: ['2025-06-01', '2025-07-01'],
        p10: [108, 109],
        p50: [115, 116],
        p90: [122, 123],
      },
    );

    expect(bridgeDate).toBe('2025-06-01');
    expect(data).toHaveLength(4);
    expect(data[2]).toMatchObject({
      date: '2025-06-01',
      historical: 104,
      forecast: 104,
    });
    const bridge = data.find((row) => row.historical != null && row.forecast != null);
    expect(bridge?.historical).toBe(bridge?.forecast);
  });
});
