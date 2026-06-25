import { describe, expect, it } from 'vitest';

import { buildXAxisTickIndices, formatMonthAxisLabel } from './chartAxisTicks';

describe('buildXAxisTickIndices', () => {
  it('spreads ticks across a 126-point monthly series without tail clustering', () => {
    const indices = buildXAxisTickIndices(126, 8);
    expect(indices[0]).toBe(0);
    expect(indices[indices.length - 1]).toBe(125);
    expect(indices).not.toContain(120);

    for (let i = 1; i < indices.length; i++) {
      expect(indices[i] - indices[i - 1]).toBeGreaterThanOrEqual(12);
    }
  });
});

describe('formatMonthAxisLabel', () => {
  it('truncates day from monthly ISO dates', () => {
    expect(formatMonthAxisLabel('2026-07-01')).toBe('2026-07');
  });
});
