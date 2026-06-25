import { describe, expect, it } from 'vitest';

import { normalizeForecastArtifact } from './forecastArtifact';

describe('normalizeForecastArtifact', () => {
  it('maps backend array payload with months to aligned series', () => {
    const normalized = normalizeForecastArtifact({
      horizon: 6,
      months: ['2026-07-01', '2026-08-01'],
      p10: [369000, 370000],
      p50: [410000, 411000],
      p90: [451000, 452000],
    });

    expect(normalized).toEqual({
      horizon: 6,
      months: ['2026-07-01', '2026-08-01'],
      p10: [369000, 370000],
      p50: [410000, 411000],
      p90: [451000, 452000],
    });
  });

  it('returns undefined when all series are empty', () => {
    expect(normalizeForecastArtifact({ p10: [], p50: [], p90: [] })).toBeUndefined();
  });
});
