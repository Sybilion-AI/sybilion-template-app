import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('renders the What/Why pair', () => {
    render(
      <EmptyState
        what="No forecasts yet."
        why="Run a forecast to see how Sybilion projects next-quarter demand."
      />,
    );
    expect(screen.getByText('No forecasts yet.')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Run a forecast to see how Sybilion projects next-quarter demand.',
      ),
    ).toBeInTheDocument();
  });

  it('renders the CTA as a button and fires onClick', () => {
    const onClick = vi.fn();
    render(
      <EmptyState
        what="No forecasts yet."
        cta={{ label: 'Run your first forecast', onClick }}
      />,
    );
    const cta = screen.getByTestId('empty-state-cta');
    expect(cta).toHaveTextContent('Run your first forecast');
    fireEvent.click(cta);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('renders the CTA as an anchor when href is provided', () => {
    render(
      <EmptyState
        what="Forecast not found."
        cta={{ label: 'Back to forecasts', href: '/forecasts' }}
      />,
    );
    const cta = screen.getByTestId('empty-state-cta');
    expect(cta.tagName).toBe('A');
    expect(cta).toHaveAttribute('href', '/forecasts');
  });

  it('renders without why or CTA when omitted', () => {
    render(<EmptyState what="No matching rows." />);
    expect(screen.queryByTestId('empty-state-cta')).toBeNull();
  });
});
