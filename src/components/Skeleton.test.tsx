import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  CardSkeleton,
  ChartSkeleton,
  TableSkeleton,
} from './Skeleton';

describe('Skeleton', () => {
  it('TableSkeleton renders the requested rows × cols with aria-busy', () => {
    render(<TableSkeleton rows={4} cols={3} />);
    const wrapper = screen.getByTestId('table-skeleton');
    expect(wrapper).toHaveAttribute('aria-busy', 'true');
    expect(wrapper.querySelectorAll('tr')).toHaveLength(4);
    expect(wrapper.querySelectorAll('td')).toHaveLength(12);
  });

  it('ChartSkeleton applies the requested height', () => {
    render(<ChartSkeleton height={320} />);
    const el = screen.getByTestId('chart-skeleton');
    expect(el).toHaveAttribute('aria-busy', 'true');
    expect(el.style.height).toBe('320px');
  });

  it('CardSkeleton renders the requested number of lines', () => {
    render(<CardSkeleton lines={5} />);
    const el = screen.getByTestId('card-skeleton');
    expect(el.querySelectorAll('div')).toHaveLength(5);
  });
});
