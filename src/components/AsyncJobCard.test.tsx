import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { AsyncJobCard, type JobStage } from './AsyncJobCard';

const ALL_STAGES: JobStage[] = [
  'pending',
  'running',
  'completed',
  'failed',
  'canceled',
  'timeout',
];

describe('AsyncJobCard', () => {
  it.each(ALL_STAGES)('renders the %s stage with the badge text and ARIA live region', (stage) => {
    render(
      <AsyncJobCard
        jobId="7f3a-9c11-2b8d"
        title="Forecast for Lisboa"
        submittedAt="2026-05-27T14:00:00Z"
        status={stage}
      />,
    );
    const card = screen.getByTestId('async-job-card');
    expect(card).toBeInTheDocument();
    expect(card).toHaveAttribute('role', 'status');
    expect(card).toHaveAttribute('aria-live', 'polite');
    expect(screen.getByTestId('async-job-card-status')).toHaveTextContent(
      stage.toUpperCase(),
    );
  });

  it('marks aria-busy true when the job is in flight and false when terminal', () => {
    const { rerender } = render(
      <AsyncJobCard
        jobId="abc"
        title="x"
        submittedAt="2026-05-27T14:00:00Z"
        status="running"
      />,
    );
    expect(screen.getByTestId('async-job-card')).toHaveAttribute('aria-busy', 'true');
    rerender(
      <AsyncJobCard
        jobId="abc"
        title="x"
        submittedAt="2026-05-27T14:00:00Z"
        status="completed"
      />,
    );
    expect(screen.getByTestId('async-job-card')).toHaveAttribute('aria-busy', 'false');
  });

  it('shows the View result link only when completed and an artifactHref is set', () => {
    const { rerender } = render(
      <AsyncJobCard
        jobId="abc"
        title="x"
        submittedAt="2026-05-27T14:00:00Z"
        status="running"
        artifactHref="/forecasts/abc"
      />,
    );
    expect(screen.queryByTestId('async-job-card-view')).toBeNull();
    rerender(
      <AsyncJobCard
        jobId="abc"
        title="x"
        submittedAt="2026-05-27T14:00:00Z"
        status="completed"
        artifactHref="/forecasts/abc"
      />,
    );
    expect(screen.getByTestId('async-job-card-view')).toHaveAttribute(
      'href',
      '/forecasts/abc',
    );
  });

  it('shows the Retry button on failed status and fires onRetry on click', () => {
    const onRetry = vi.fn();
    render(
      <AsyncJobCard
        jobId="abc"
        title="x"
        submittedAt="2026-05-27T14:00:00Z"
        status="failed"
        onRetry={onRetry}
      />,
    );
    fireEvent.click(screen.getByTestId('async-job-card-retry'));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('uses the custom microcopy override when provided', () => {
    render(
      <AsyncJobCard
        jobId="abc"
        title="x"
        submittedAt="2026-05-27T14:00:00Z"
        status="running"
        microcopy={{ running: 'Crunching 120 monthly observations…' }}
      />,
    );
    expect(
      screen.getByText('Crunching 120 monthly observations…'),
    ).toBeInTheDocument();
  });
});
