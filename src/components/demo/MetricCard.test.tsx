import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { MetricCard } from './MetricCard';

describe('MetricCard', () => {
  it('renders title, value and unit', () => {
    render(<MetricCard title="Avg Forecast Price" value="534" unit="USD/t" />);
    expect(screen.getByText('Avg Forecast Price')).toBeInTheDocument();
    expect(screen.getByText('534')).toBeInTheDocument();
    expect(screen.getByText('USD/t')).toBeInTheDocument();
  });

  it('prefixes a positive delta with +', () => {
    render(<MetricCard title="MAPE" value="3.8" delta={1.4} trend="up" />);
    expect(screen.getByText('+1.4%')).toBeInTheDocument();
  });

  it('omits the delta line when no delta is given', () => {
    const { container } = render(<MetricCard title="Horizon" value="12" unit="months" />);
    expect(container.textContent).not.toContain('%');
  });
});
